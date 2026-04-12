import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Resume from "@/models/Resume";
import ResumeVersion from "@/models/ResumeVersion";
import { createResumeVersionSchema, objectIdSchema } from "@/lib/validation";
import {
  handleRoute,
  success,
  created,
  notFound,
  forbidden,
  error,
  validationError,
} from "@/lib/api-response";


async function verifyResumeOwnership(resumeId: string, userId: string) {
  const idResult = objectIdSchema.safeParse(resumeId);
  if (!idResult.success) {
    return { error: "invalid_id" as const };
  }

  const resume = await Resume.findById(resumeId).lean();
  if (!resume) {
    return { error: "not_found" as const };
  }

  if (resume.userId.toString() !== userId) {
    return { error: "forbidden" as const };
  }

  return { resume };
}

//  ALL resume version

export const GET = withAuth(async (req, { user, params }) => {
  return handleRoute(async () => {
    await connectToDatabase();

    const { id } = await params!;

    const ownership = await verifyResumeOwnership(id, user.sub);

    if ("error" in ownership) {
      if (ownership.error === "invalid_id") return error("Invalid resume ID", 400);
      if (ownership.error === "not_found") return notFound("Resume not found");
      return forbidden("You do not have access to this resume");
    }

    const versions = await ResumeVersion.find({ resumeId: id })
      .sort({ versionNumber: -1 })
      .lean();

    return success({ versions, total: versions.length });
  });
});


