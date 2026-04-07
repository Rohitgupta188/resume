import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Resume from "@/models/Resume";
import { createResumeSchema, paginationSchema } from "@/lib/validation";
import {
  handleRoute,
  success,
  created,
  validationError,
} from "@/lib/api-response";

export const GET = withAuth(async (req, { user }) => {
  return handleRoute(async () => {
    await connectToDatabase();

    const searchParams = req.nextUrl.searchParams;

    const paginationResult = paginationSchema.safeParse({
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    if (!paginationResult.success) {
      return validationError(paginationResult.error);
    }

    const { page, limit } = paginationResult.data;

    const safeLimit = Math.min(limit, 50);
    const skip = (page - 1) * safeLimit;

    const filter: Record<string, any> = { userId: user.sub };

    const active = searchParams.get("active");
    if (active === "true") filter.isActive = true;
    if (active === "false") filter.isActive = false;

    const q = searchParams.get("q")?.trim();
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { "content.personalInfo.name": { $regex: q, $options: "i" } },
        { "content.skills": { $regex: q, $options: "i" } },
      ];
    }

    const [resumes, total] = await Promise.all([
      Resume.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Resume.countDocuments(filter),
    ]);

    return success({
      resumes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
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

    if (resumeData.isActive) {
      await Resume.updateMany(
        { userId: user.sub, isActive: true },
        { $set: { isActive: false } },
      );
    }

    const resume = await Resume.create(resumeData);

    return created({
      message: "Resume created successfully",
      resume,
    });
  });
});
