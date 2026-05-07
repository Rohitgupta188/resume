import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import mongoose from "mongoose";
import Resume from "@/models/Resume";
import ResumeVersion from "@/models/ResumeVersion";
import ResumeAnalysis from "@/models/ResumeAnalysis";
import User from "@/models/User";

import { updateResumeSchema, objectIdSchema } from "@/lib/validation";
import {
  handleRoute,
  success,
  notFound,
  forbidden,
  error,
  validationError,
} from "@/lib/api-response";

async function getOwnedResume(id: string, userId: string) {
  const idResult = objectIdSchema.safeParse(id);

  if (!idResult.success) {
    return { error: "invalid_id" as const };
  }

  const resume = await Resume.findById(id).lean();

  if (!resume) {
    return { error: "not_found" as const };
  }

  if (resume.userId.toString() !== userId) {
    return { error: "forbidden" as const };
  }

  return { resume };
}

export const GET = withAuth(async (req, { user, params }) => {
  return handleRoute(async () => {
    await connectToDatabase();

    const { id } = await params!;

    const result = await getOwnedResume(id, user.sub);

    if ("error" in result) {
      if (result.error === "invalid_id") return error("Invalid resume ID", 400);
      if (result.error === "not_found") return notFound("Resume not found");
      return forbidden("You do not have access to this resume");
    }

    const userDoc = await User.findById(user.sub)
      .select("activeResumeId")
      .lean();

    const isActive =
      userDoc?.activeResumeId?.toString() === result.resume._id.toString();

    return success({
      resume: {
        ...result.resume,
        isActive,
      },
    });
  });
});

export const PATCH = withAuth(async (req, { user, params }) => {
  return handleRoute(async () => {
    await connectToDatabase();

    const { id } = await params!;

    const result = await getOwnedResume(id, user.sub);

    if ("error" in result) {
      if (result.error === "invalid_id") return error("Invalid resume ID", 400);
      if (result.error === "not_found") return notFound("Resume not found");
      return forbidden("You do not have access to this resume");
    }

    const body = await req.json();

    const parsed = updateResumeSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (parsed.data.createVersion) {
        const lastVersion = await ResumeVersion.findOne({ resumeId: id })
          .sort({ versionNumber: -1 })
          .select("versionNumber")
          .session(session)
          .lean();

        const nextVersion = lastVersion ? lastVersion.versionNumber + 1 : 1;

        // Snapshot current content before applying update
        await ResumeVersion.create([{
          resumeId: id,
          userId: user.sub,
          content: result.resume.content,
          versionNumber: nextVersion,
          type: "manual",
          changesSummary: "Snapshot before manual update",
        }], { session });

        // ✅ Version Growth Control: Keep latest 50 versions
        const versionCount = await ResumeVersion.countDocuments({ resumeId: id }).session(session);
        if (versionCount > 50) {
          const oldestToKeep = await ResumeVersion.find({ resumeId: id })
            .sort({ versionNumber: -1 })
            .skip(49)
            .limit(1)
            .session(session)
            .lean();
          
          if (oldestToKeep.length > 0) {
            await ResumeVersion.deleteMany({
              resumeId: id,
              versionNumber: { $lt: oldestToKeep[0].versionNumber }
            }).session(session);
          }
        }
      }

      const updatePayload: Record<string, unknown> = {
        ...parsed.data,
      };

      if (parsed.data.content) {
        const existing = result.resume.content || {};
        const incoming = parsed.data.content;

        updatePayload.content = {
          ...existing,
          ...incoming,
          ...(incoming.personalInfo && {
            personalInfo: { ...existing.personalInfo, ...incoming.personalInfo },
          }),
        };
      }

      const updated = await Resume.findByIdAndUpdate(
        id,
        { $set: updatePayload },
        { returnDocument: "after", runValidators: true, session },
      ).lean();

      if (!updated) {
        throw new Error("Resume not found after update");
      }

      await session.commitTransaction();

      //  Attach computed isActive
      const userDoc = await User.findById(user.sub)
        .select("activeResumeId")
        .lean();

      const isActive =
        userDoc?.activeResumeId?.toString() === updated._id.toString();

      return success({
        message: "Resume updated successfully",
        resume: {
          ...updated,
          isActive,
        },
      });
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }
  });
});

export const DELETE = withAuth(async (req, { user, params }) => {
  return handleRoute(async () => {
    await connectToDatabase();

    const { id } = await params!;

    const result = await getOwnedResume(id, user.sub);

    if ("error" in result) {
      if (result.error === "invalid_id") return error("Invalid resume ID", 400);
      if (result.error === "not_found") return notFound("Resume not found");
      return forbidden("You do not have access to this resume");
    }

    //  Check if this resume is active
    const userDoc = await User.findById(user.sub).lean();

    if (userDoc?.activeResumeId?.toString() === id) {
      await User.findByIdAndUpdate(user.sub, {
        $unset: { activeResumeId: "" },
      });
    }

    //  Delete resume + versions
    await Promise.all([
      Resume.findByIdAndDelete(id),
      ResumeVersion.deleteMany({ resumeId: id }),
      ResumeAnalysis.deleteMany({
        resumeId: id,
        userId: user.sub,
      }),
    ]);

    return success({
      message: "Resume deleted successfully",
    });
  });
});
