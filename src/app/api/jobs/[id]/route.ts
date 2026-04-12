import { withAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Job from "@/models/Job";
import { handleRoute, success, notFound } from "@/lib/api-response";
import { objectIdSchema } from "@/lib/validation";

export const GET = withAuth(async (req, { params }) => {
  return handleRoute(async () => {
    await connectToDatabase();

    const { id } = await params!;
    const parsed = objectIdSchema.safeParse(id);
    if (!parsed.success) return notFound("Job not found");

    const job = await Job.findById(id).lean();
    if (!job) return notFound("Job not found");

    return success({ job });
  });
});