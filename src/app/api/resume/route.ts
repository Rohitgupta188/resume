import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Resume from "@/models/Resume";
import ResumeVersion from "@/models/ResumeVersion";
import { createResumeSchema } from "@/lib/validation";
import {
  handleRoute,
  success,
  created,
  validationError,
} from "@/lib/api-response";

import User from "@/models/User";

export const GET = withAuth(async (req, { user }) => {
  return handleRoute(async () => {
    await connectToDatabase();

    const searchParams = req.nextUrl.searchParams;
    const filter: Record<string, any> = { userId: user.sub };

    const q = searchParams.get("q")?.trim();

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { "content.personalInfo.name": { $regex: q, $options: "i" } },
        { "content.skills": { $regex: q, $options: "i" } },
      ];
    }

    // Fetch resumes and user's activeResumeId in parallel
    const [resumes, userDoc] = await Promise.all([
      Resume.find(filter).sort({ updatedAt: -1 }).limit(50).lean(),
      User.findById(user.sub).select("activeResumeId").lean(),
    ]);

    const activeId = userDoc?.activeResumeId?.toString();

    const resumesWithActive = resumes.map((r) => ({
      ...r,
      isActive: r._id.toString() === activeId,
    }));

    return success({ resumes: resumesWithActive });
  });
});

export const POST = withAuth(async (req, { user }) => {
  return handleRoute(async () => {
    await connectToDatabase();

    const body = await req.json();

    const parsed = createResumeSchema.safeParse(body);
    if (!parsed.success) {
      return validationError(parsed.error);
    }

    const resumeData = {
      ...parsed.data,
      userId: user.sub,
    };

    const resume = await Resume.create(resumeData);

    await ResumeVersion.create({
      resumeId: resume._id,
      userId: user.sub,
      versionNumber: 1,
      type: "original",
      content: resume.content,
      changesSummary: "Initial resume creation",
    });

    return created({
      message: "Resume created successfully",
      resume,
    });
  });
});
