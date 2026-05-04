import crypto from "crypto";
import { withAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Resume from "@/models/Resume";
import User from "@/models/User";
import ResumeAnalysis from "@/models/ResumeAnalysis";
import mongoose from "mongoose";
import {
  handleRoute,
  success,
  error,
  notFound,
  forbidden,
} from "@/lib/api-response";
import { aiResponseSchema, objectIdSchema } from "@/lib/validation";
import { normalizeAIResponse } from "@/lib/ai-normalised";
import { GoogleGenAI } from "@google/genai";
import { sanitizeResumeForAI } from "@/lib/ai/sanitize";
import {
  ENHANCE_RESUME_PROMPT,
  ENHANCE_RESUME_SYSTEM_PROMPT,
} from "@/lib/ai/prompt";
import { generateWithRetry } from "@/lib/ai/retry";
import { checkRateLimit } from "@/lib/rate-limit";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

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
  console.log(`[AI Enhance] Hash generated: ${hash}`);
  return hash;
}

function extractJSON(text: string) {
  // Remove markdown fences
  const cleaned = text.replace(/```json|```/g, "").trim();

  // Try direct parse first
  try {
    return JSON.parse(cleaned);
  } catch {}

  // Robust JSON extraction using bracket matching
  let start = cleaned.indexOf("{");
  if (start === -1) return null;

  let depth = 0;

  for (let i = start; i < cleaned.length; i++) {
    if (cleaned[i] === "{") depth++;
    if (cleaned[i] === "}") depth--;

    if (depth === 0) {
      const candidate = cleaned.slice(start, i + 1);
      try {
        return JSON.parse(candidate);
      } catch {}
    }
  }

  return null;
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

    const rateCheck = await checkRateLimit({
      key: `enhance:${user.sub}`,
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 15,
    });

    if (!rateCheck.allowed) {
      return error("Too many requests. Please slow down.", 429);
    }

    const [currentUser, resume] = await Promise.all([
      User.findById(user.sub).select("activeResumeId").lean(),
      Resume.findOne({ _id: id, userId: user.sub }).lean(),
    ]);

    if (!currentUser?.activeResumeId) {
      return error("No active resume set", 400);
    }

    if (currentUser.activeResumeId.toString() !== id) {
      return forbidden("You can only enhance the active resume");
    }

    if (!resume) return notFound("Resume not found");

    if (!id || resume._id.toString() !== id) {
      return error("Unauthorized access", 401);
    }

    const currentHash = stableHash(resume.content);

    const existingAnalysis = await ResumeAnalysis.findOne({
      resumeId: resume._id,
      contentHash: currentHash,
    }).lean();

    if (existingAnalysis) {
      console.log(`[AI Enhance] Cache HIT for resume ${id}`);
      return success({
        message: "Already enhanced",
        cached: true,
        atsScore: existingAnalysis.atsScore,
        improvedContent: existingAnalysis.improvedContent, 
        analysis: existingAnalysis,
        contentHash: currentHash,
      });
    }
    
    console.log(`[AI Enhance] Cache MISS for resume ${id}. Generating new...`);
    const safeContent = sanitizeResumeForAI(resume.content);
    const prompt = ENHANCE_RESUME_PROMPT(safeContent);

    const genResult = await generateWithRetry(
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

    if (genResult === false) {
      return error(
        "AI is currently busy. Please try again in a few seconds.",
        503,
      );
    }

    const { response, modelUsed } = genResult;

    let text = response.text || "";

    text = text.replace(/```json|```/g, "").trim();

    const parsedAI = extractJSON(text);

    if (!parsedAI) {
      console.warn("[AI Parse Fail]", {
        preview: text.slice(0, 500),
      });
      throw new Error("AI response parsing failed");
    }

    if (!parsedAI.atsScore || !parsedAI.improvedContent) {
      throw new Error("Invalid AI response structure");
    }

    const normalized = normalizeAIResponse(parsedAI);

    const validationResult = aiResponseSchema.safeParse(normalized);

    if (!validationResult.success) {
      console.error("[Schema Validation Error]", validationResult.error);
      throw new Error("Invalid AI response schema");
    }

    const validAI = validationResult.data;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await ResumeAnalysis.create(
        [
          {
            userId: user.sub,
            resumeId: resume._id,
            contentHash: currentHash,
            atsScore: validAI.atsScore,
            improvedContent: validAI.improvedContent,
            sectionFeedback: validAI.sectionFeedback,
            missingSkills: validAI.missingSkills,
            strengths: validAI.strengths,
            weaknesses: validAI.weaknesses,
            suggestions: validAI.suggestions,
            modelUsed,
          },
        ],
        { session },
      );

      await Resume.updateOne(
        { _id: resume._id },
        { lastAiProcessedHash: currentHash },
        { session },
      );

      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }

    

    return success({
      message: "Resume enhancement generated",
      atsScore: validAI.atsScore,
      improvedContent: validAI.improvedContent,
      analysis: validAI,
      contentHash: currentHash

    });
  });
});
