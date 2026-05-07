import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Job from "@/models/Job";
import { handleRoute, success, error } from "@/lib/api-response";
import { fetchJobsFromJSearch, normalizeJob } from "@/lib/jsearch";
import { normalizeSearchQuery } from "@/lib/search-normalized";

import { checkRateLimit } from "@/lib/rate-limit";

const PAGE_SIZE = 15;
const STORE_LIMIT = 40;

export const GET = withAuth(async (req: NextRequest, { user }) => {
  return handleRoute(async () => {
    await connectToDatabase();

    // ✅ Rate Limiting: 30 searches per minute
    const rateCheck = await checkRateLimit({
      key: `job-search:${user.sub}`,
      windowMs: 60 * 1000,
      maxRequests: 30,
    });

    if (!rateCheck.allowed) {
      return error("Too many searches. Please slow down.", 429);
    }

    const searchParams = req.nextUrl.searchParams;

    const rawQuery = searchParams.get("q")?.trim() ?? "";
    const q = normalizeSearchQuery(rawQuery);
    const location = searchParams.get("location")?.trim() ?? "India";
    const skip = Math.max(0, Number(searchParams.get("skip") ?? "0"));

    if (!q) return error("Search query is required", 400);

    const searchQuery = `${q} ${location}`.toLowerCase().trim();

    const queryFilter = {
      searchQuery,
      expiresAt: { $gt: new Date() },
    };

    // 1. check cache first
    const cachedJobs = await Job.find(queryFilter)
      .select("-description") // description is heavy, omit from list
      .sort({ postedDate: -1 })
      .limit(STORE_LIMIT)
      .lean();

    if (cachedJobs.length > skip) {
      return success({ 
        jobs: cachedJobs.slice(skip, skip + PAGE_SIZE),
        hasMore: skip + PAGE_SIZE < cachedJobs.length || cachedJobs.length === STORE_LIMIT,
        total: cachedJobs.length, 
        source: "cache" });
    }

    // 2. fetch from JSearch
    const page = Math.floor(skip / PAGE_SIZE) + 1;
    const rawJobs = await fetchJobsFromJSearch(q, location, page);

    if (!rawJobs.length) {
      return success({ jobs: [], hasMore: false, total: 0, source: "fresh" });
    }

    const normalized = rawJobs
      .slice(0, STORE_LIMIT) 
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

    // 4. Read back from DB for consistent shape and IDs
    const storedJobs = await Job.find(queryFilter)
      .select("-description")
      .sort({ postedDate: -1 })
      .limit(STORE_LIMIT)
      .lean();

    return success({ 
      jobs: storedJobs.slice(skip, skip + PAGE_SIZE),
      hasMore: skip + PAGE_SIZE < storedJobs.length,
      total: storedJobs.length,
      source: "fresh" 
    });
  });
});
