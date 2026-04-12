import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Resume from "@/models/Resume";
import ResumeVersion from "@/models/ResumeVersion";
import { objectIdSchema } from "@/lib/validation";
import {
  handleRoute,
  success,
  notFound,
  forbidden,
  error,
} from "@/lib/api-response";


// Get a specific version

export const GET = withAuth(async (req, { user, params }) => {
  return handleRoute(async () => {
    await connectToDatabase();

    const { id, versionId } = await params!;

    const resumeIdResult = objectIdSchema.safeParse(id);
    const versionIdResult = objectIdSchema.safeParse(versionId);

    if (!resumeIdResult.success || !versionIdResult.success) {
      return error("Invalid ID format", 400);
    }

    // Verify resume ownership
    const resume = await Resume.findById(id).lean();
    if (!resume) return notFound("Resume not found");
    if (resume.userId.toString() !== user.sub) {
      return forbidden("You do not have access to this resume");
    }

    const version = await ResumeVersion.findOne({
      _id: versionId,
      resumeId: id,
    }).lean();

    if (!version) {
      return notFound("Version not found");
    }

    return success({ version });
  });
});


// Delete a specific version

export const DELETE = withAuth(async (req, { user, params }) => {
  return handleRoute(async () => {
    await connectToDatabase();

    const { id, versionId } = await params!;

    const resumeIdResult = objectIdSchema.safeParse(id);
    const versionIdResult = objectIdSchema.safeParse(versionId);

    if (!resumeIdResult.success || !versionIdResult.success) {
      return error("Invalid ID format", 400);
    }

    // Verify resume ownership
    const resume = await Resume.findById(id).lean();
    if (!resume) return notFound("Resume not found");
    if (resume.userId.toString() !== user.sub) {
      return forbidden("You do not have access to this resume");
    }

    const deleted = await ResumeVersion.findOneAndDelete({
      _id: versionId,
      resumeId: id,
    });

    if (!deleted) {
      return notFound("Version not found");
    }

    return success({ message: "Version deleted successfully" });
  });
});
