import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Resume from "@/models/Resume";
import User from "@/models/User";
import { objectIdSchema } from "@/lib/validation";
import {
  handleRoute,
  success,
  notFound,
  forbidden,
  error,
} from "@/lib/api-response";

export const PATCH = withAuth(async (req: NextRequest, { user, params }) => {
  return handleRoute(async () => {
    await connectToDatabase();

    const { id } = await params!;

    
    const parsed = objectIdSchema.safeParse(id);
    if (!parsed.success) {
      return error("Invalid resume ID", 400);
    }

    const resume = await Resume.findById(id)
      .select("_id userId")
      .lean();

    if (!resume) {
      return notFound("Resume not found");
    }

    if (resume.userId.toString() !== user.sub) {
      return forbidden("You do not have access to this resume");
    }

    const currentUser = await User.findById(user.sub)
      .select("activeResumeId")
      .lean();

    if (currentUser?.activeResumeId?.toString() === id) {
      return success({
        message: "Resume already active",
        activeResumeId: id,
      });
    }

      await User.findByIdAndUpdate(user.sub, {
        activeResumeId: id,
      });

    return success({
      message: "Active resume updated successfully",
      activeResumeId: id,
    });
  });
});
