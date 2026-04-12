import { NextRequest } from "next/server";
import crypto from "crypto";
import { withAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Resume from "@/models/Resume";
import User from "@/models/User";
import ResumeAnalysis from "@/models/ResumeAnalysis";
import ResumeVersion from "@/models/ResumeVersion";
import {
  handleRoute,
  success,
  error,
  notFound,
  forbidden,
} from "@/lib/api-response";
import { objectIdSchema } from "@/lib/validation";
import { sanitizeResumeForAI } from "@/lib/ai/sanitize";
import {
  ENHANCE_RESUME_PROMPT,
  ENHANCE_RESUME_SYSTEM_PROMPT,
} from "@/lib/ai/prompt";
import { generateWithRetry } from "@/lib/ai/retry";

import { GoogleGenAI } from "@google/genai";

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 min
const MAX_REQUESTS = 15;

let requestLog: number[] = [];

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

function generateHash(content: any) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(content))
    .digest("hex");
}
export const POST = withAuth(async (req, { user, params }) => {
  return handleRoute(async () => {
    // validate ID
    // validate user
    // check active resume in user
    // check hash
    // call gemini api

    const { id } = await params!;

    const parsed = objectIdSchema.safeParse(id);
    if (!parsed.success) {
      return error("Invalid resume ID", 400);
    }

    await connectToDatabase();

    const now = Date.now();
    requestLog = requestLog.filter((t) => now - t < RATE_LIMIT_WINDOW);

    if (requestLog.length >= MAX_REQUESTS) {
      return error("Too many requests. Please slow down.", 429);
    }

    requestLog.push(now);

    const [currentUser, resume] = await Promise.all([
      User.findById(user.sub).select("activeResumeId").lean(),
      Resume.findOne({ _id: id, userId: user.sub }),
    ]);

    if (!currentUser?.activeResumeId) {
      return error("No active resume set", 400);
    }

    if (currentUser.activeResumeId.toString() !== id) {
      return forbidden("You can only enhance the active resume");
    }

    if (!resume) return notFound("Resume not found");

    if (!id || !resume._id.equals(id)) {
      return error("Unauthorized access", 401);
    }

    const latestVersion = await ResumeVersion.findOne({ resumeId: id })
      .sort({ versionNumber: -1 })
      .lean();

    const nextVersionNumber = latestVersion
      ? (latestVersion.versionNumber ?? 0) + 1
      : 1;

    const currentHash = generateHash(resume.content);

    if (resume.lastAiProcessedHash === currentHash) {
      return error("Resume already enhanced. Modify content first.", 400);
    }

    const safeContent = sanitizeResumeForAI(resume.content);
    const prompt = ENHANCE_RESUME_PROMPT(safeContent);

    const result = await generateWithRetry(
      () =>
        ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            systemInstruction: ENHANCE_RESUME_SYSTEM_PROMPT,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      () =>
        ai.models.generateContent({
          model: "gemini-2.5-flash-lite",
          contents: prompt,
          config: {
            systemInstruction: ENHANCE_RESUME_SYSTEM_PROMPT,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
    );

    if (result === false) {
      return error(
        "AI is currently busy. Please try again in a few seconds.",
        503,
      );
    }

    const { response, modelUsed } = result; 

    let text = response.text || "";

    text = text.replace(/```json|```/g, "").trim();

    let parsedAI;

    try {
      parsedAI = JSON.parse(text);
    } catch {
      throw new Error("AI response parsing failed");
    }

    if (!parsedAI.atsScore || !parsedAI.improvedContent) {
      throw new Error("Invalid AI response structure");
    }

    await ResumeAnalysis.create({
      userId: user.sub,
      resumeId: resume._id,
      atsScore: parsedAI.atsScore,
      sectionFeedback: parsedAI.sectionFeedback,
      missingSkills: parsedAI.missingSkills,
      strengths: parsedAI.strengths,
      weaknesses: parsedAI.weaknesses,
      suggestions: parsedAI.suggestions,
      modelUsed,
    });

    const improved = parsedAI.improvedContent;

    await ResumeVersion.create({
      resumeId: resume._id,
      userId: user.sub,
      versionNumber: nextVersionNumber,
      content: improved,
      type: "ai_improved",
      changesSummary: "AI enhanced resume",
    });

    const updatedContent = {
      ...resume.content,
      summary:
        typeof improved?.summary === "string"
          ? improved.summary
          : resume.content.summary,
      skills:
        typeof improved?.skills === "string"
          ? improved.skills
          : resume.content.skills,
      projects: Array.isArray(improved?.projects)
        ? improved.projects
        : resume.content.projects,
    };

    const newHash = generateHash(updatedContent);

    const updatedResume = await Resume.findByIdAndUpdate(
      resume._id,
      {
        content: updatedContent,
        lastAiProcessedHash: newHash,
        atsScore: parsedAI.atsScore,
      },
      { returnDocument: "after" },
    ).lean();

    return success({
      message: "Resume enhanced successfully",
      atsScore: parsedAI.atsScore,
      resume: updatedResume,
    });
  });
});
