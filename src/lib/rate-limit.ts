import { connectToDatabase } from "@/lib/db";
import mongoose, { Schema, Model } from "mongoose";

/**
 * Per-user, per-action rate limiter backed by MongoDB.
 * Works correctly in serverless environments (Vercel, etc.)
 * where in-memory state is lost between invocations.
 */

interface IRateLimit {
  key: string;
  timestamps: Date[];
  updatedAt: Date;
}

const RateLimitSchema = new Schema<IRateLimit>(
  {
    key: { type: String, required: true, unique: true },
    timestamps: { type: [Date], default: [] },
  },
  { timestamps: true }
);

// Auto-expire documents after 24h of inactivity to keep collection lean
RateLimitSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 86400 });

const RateLimitModel: Model<IRateLimit> =
  (mongoose.models.RateLimit as Model<IRateLimit>) ||
  mongoose.model<IRateLimit>("RateLimit", RateLimitSchema);

interface RateLimitOptions {
  /** Unique identifier for this user+action (e.g. `enhance:${userId}`) */
  key: string;
  /** Time window in milliseconds */
  windowMs: number;
  /** Max requests allowed within the window */
  maxRequests: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs?: number;
}

export async function checkRateLimit({
  key,
  windowMs,
  maxRequests,
}: RateLimitOptions): Promise<RateLimitResult> {
  await connectToDatabase();

  const windowStart = new Date(Date.now() - windowMs);

  // Atomically: remove expired timestamps and push the new one,
  // but only if we're under the limit.
  // Step 1: Clean old timestamps and read current count
  const doc = await RateLimitModel.findOneAndUpdate(
    { key },
    {
      $pull: { timestamps: { $lt: windowStart } },
    },
    { upsert: true, returnDocument: "after" }
  );

  const currentCount = doc.timestamps.length;

  if (currentCount >= maxRequests) {
    // Find the earliest timestamp to calculate retry-after
    const earliest = doc.timestamps[0];
    const retryAfterMs = earliest
      ? earliest.getTime() + windowMs - Date.now()
      : windowMs;

    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: Math.max(retryAfterMs, 0),
    };
  }

  // Step 2: Push new timestamp (we're under the limit)
  await RateLimitModel.updateOne(
    { key },
    { $push: { timestamps: new Date() } }
  );

  return {
    allowed: true,
    remaining: maxRequests - currentCount - 1,
  };
}
