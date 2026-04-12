import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Job from "@/models/Job";
import { handleRoute, success, error } from "@/lib/api-response";
import { fetchJobsFromJSearch, normalizeJob } from "@/lib/jsearch";
import { normalizeSearchQuery } from "@/lib/search-normalized";

export const GET = withAuth(async (req: NextRequest) => {
  return handleRoute(async () => {
    await connectToDatabase();

    const searchParams = req.nextUrl.searchParams;

    const rawQuery = searchParams.get("q")?.trim() ?? "";
    const q = normalizeSearchQuery(rawQuery);
    const location = searchParams.get("location")?.trim() ?? "India";

    if (!q) return error("Search query is required", 400);

    const searchQuery = `${q} ${location}`.toLowerCase().trim();

    // 1. check cache first
    const cachedJobs = await Job.find({
      searchQuery,
      expiresAt: { $gt: new Date() },
    })
      .select("-description") // description is heavy, omit from list
      .sort({ postedDate: -1 })
      .limit(10)
      .lean();

    if (cachedJobs.length > 0) {
      return success({ jobs: cachedJobs, source: "cache" });
    }

    // 2. fetch from JSearch
    const rawJobs = await fetchJobsFromJSearch(q, location);

    if (!rawJobs.length) {
      return success({ jobs: [], source: "fresh" });
    }

    const normalized = rawJobs
      .slice(0, 10) 
      .map((job) => normalizeJob(job, searchQuery));

    // 3. upsert — no duplicates across searches
    await Promise.all(
      normalized.map((job) =>
        Job.findOneAndUpdate(
          { externalJobId: job.externalJobId },
          { $set: job },
          { upsert: true, returnDocument: "after" },
        ),
        
      ),
    );

    // return without description for list view
    const jobs = normalized.map(({ description: _, ...rest }) => rest);

    return success({ jobs, source: "fresh" });
  });
});
