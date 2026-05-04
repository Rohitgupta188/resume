import { NextRequest } from "next/server";
import crypto from "crypto";
import mongoose from "mongoose";
import { withAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Resume from "@/models/Resume";
import ResumeVersion from "@/models/ResumeVersion";
import ResumeAnalysis from "@/models/ResumeAnalysis";
import User from "@/models/User";
import {
  handleRoute,
  success,
  error,
  notFound,
  forbidden,
} from "@/lib/api-response";
import { objectIdSchema } from "@/lib/validation";

function stableHash(content: any) {
  const stringify = (obj: any): string => {
    if (obj === undefined) return "undefined";
    if (obj === null) return "null";
    if (typeof obj !== "object") return JSON.stringify(obj);
    
    if (Array.isArray(obj)) {
      return "[" + obj.map(stringify).join(",") + "]";
    }
    
    const keys = Object.keys(obj).sort();
    return "{" + keys.map(k => `"${k}":${stringify(obj[k])}`).join(",") + "}";
  };

  const str = stringify(content);
  const hash = crypto.createHash("sha256").update(str).digest("hex");
  console.log(`[AI Apply] Hash generated: ${hash}`);
  return hash;
}

function isValidImprovedContent(content: any) {
  if (!content || typeof content !== "object") return false;

  if (
    content.summary &&
    (typeof content.summary !== "string" || content.summary.trim().length === 0)
  ) {
    return false;
  }

  if (
    content.skills &&
    (!Array.isArray(content.skills) ||
      !content.skills.every((s: any) => typeof s === "string"))
  ) {
    return false;
  }

  if (
    content.projects &&
    (!Array.isArray(content.projects) ||
      !content.projects.every(
        (p: any) => p && typeof p === "object" && typeof p.title === "string",
      ))
  ) {
    return false;
  }

  return true;
}

export const POST = withAuth(async (req: NextRequest, { user, params }) => {
  return handleRoute(async () => {
    const { id } = await params!;

    const parsed = objectIdSchema.safeParse(id);
    if (!parsed.success) return error("Invalid resume ID", 400);

    let body;
    try {
      body = await req.json();
    } catch {
      return error("Invalid JSON", 400);
    }

    const { improvedContent, atsScore, contentHash } = body;
    console.log(contentHash);
    

    if (typeof atsScore !== "number") {
      return error("Invalid ATS score", 400);
    }

    if (!isValidImprovedContent(improvedContent)) {
      return error("Invalid content", 400);
    }

    if (!contentHash) {
      // This is where your error is triggering
      return error(
        `Missing contentHash. Received keys: ${Object.keys(body).join(", ")}`,
        400,
      );
    }

    await connectToDatabase();

    const [currentUser, resume] = await Promise.all([
      User.findById(user.sub).select("activeResumeId").lean(),
      Resume.findOne({ _id: id, userId: user.sub }).lean(),
    ]);

    if (!currentUser?.activeResumeId) {
      return error("No active resume", 400);
    }

    if (currentUser.activeResumeId.toString() !== id) {
      return forbidden("Only active resume editable");
    }

    if (!resume) return notFound("Resume not found");

    const analysis = await ResumeAnalysis.findOne({
      resumeId: resume._id,
      contentHash,
    });

    if (!analysis) {
      return error("Enhancement not found or outdated", 400);
    }

    const currentHash = stableHash(resume.content);

    if (currentHash !== contentHash) {
      return error("Resume has changed. Please re-enhance.", 400);
    }

    // ✅ Safe merge
    const updatedContent = {
      ...resume.content,
      summary: improvedContent.summary?.trim() || resume.content.summary,
      skills: Array.isArray(improvedContent.skills)
        ? improvedContent.skills
        : resume.content.skills,
      projects: Array.isArray(improvedContent.projects)
        ? improvedContent.projects
        : resume.content.projects,
    };

    const newHash = stableHash(updatedContent);

    // ✅ Optimistic concurrency
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const freshResume = await Resume.findById(resume._id).session(session);

      if (!freshResume) throw new Error("Resume missing");

      if (freshResume.lastAiProcessedHash === newHash) {
        await session.abortTransaction();
        return error("Already applied", 400);
      }

      // Versioning
      const latestVersion = await ResumeVersion.findOne({
        resumeId: id,
      })
        .sort({ versionNumber: -1 })
        .session(session);

      const nextVersion = latestVersion ? latestVersion.versionNumber + 1 : 1;

      await ResumeVersion.create(
        [
          {
            resumeId: resume._id,
            userId: user.sub,
            versionNumber: nextVersion,
            content: updatedContent,
            type: "ai_improved",
            changesSummary: "Applied AI enhancement",
          },
        ],
        { session },
      );

      const updatedResume = await Resume.findOneAndUpdate(
        {
          _id: resume._id,
          lastAiProcessedHash: { $ne: newHash }, // ✅ concurrency guard
        },
        {
          content: updatedContent,
          atsScore,
          lastAiProcessedHash: newHash,
        },
        { returnDocument: "after", session },
      );

      if (!updatedResume) {
        throw new Error("Concurrent update detected");
      }

      await session.commitTransaction();

      return success({
        message: "Enhancement applied",
        resume: {
          ...updatedResume.toJSON(),
          isActive: true, // We verified this on line 102
        },
        atsScore,
      });
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }
  });
});
