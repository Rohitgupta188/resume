import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";

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

    const lastVersion = await ResumeVersion.findOne({ resumeId: id })
      .sort({ versionNumber: -1 })
      .select("versionNumber")
      .lean();

    const nextVersion = lastVersion ? lastVersion.versionNumber + 1 : 1;

    // Snapshot current content before applying update (for version history / rollback)
    await ResumeVersion.create({
      resumeId: id,
      userId: user.sub,
      content: result.resume.content,
      versionNumber: nextVersion,
      type: "manual",
      changesSummary: "Snapshot before manual update",
    });

    const updatePayload: Record<string, unknown> = {
      ...parsed.data,
    };

    // Merge content: objects are shallow-merged, arrays are replaced entirely
    // (so users can actually remove skills, experience entries, etc.)
    if (parsed.data.content) {
      const existing = result.resume.content || {};
      const incoming = parsed.data.content;

      updatePayload.content = {
        ...existing,
        ...incoming,
        // For nested objects like personalInfo, shallow merge one level deeper
        ...(incoming.personalInfo && {
          personalInfo: { ...existing.personalInfo, ...incoming.personalInfo },
        }),
      };
    }

    const updated = await Resume.findByIdAndUpdate(
      id,
      { $set: updatePayload },
      { returnDocument: "after", runValidators: true },
    ).lean();

    if (!updated) {
      return notFound("Resume not found after update");
    }

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
