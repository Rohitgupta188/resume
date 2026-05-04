import { withAuth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Resume from "@/models/Resume";
import Job from "@/models/Job";
import Match from "@/models/Match";
import { handleRoute, success, error, notFound } from "@/lib/api-response";
import { objectIdSchema } from "@/lib/validation";
import { sanitizeResumeForAI } from "@/lib/ai/sanitize";
import { JOB_MATCH_PROMPT, JOB_MATCH_SYSTEM_PROMPT } from "@/lib/ai/job_prompt";
import { generateWithRetry } from "@/lib/ai/retry";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const POST = withAuth(async (req, { user, params }) => {
  return handleRoute(async () => {
    await connectToDatabase();

    const { id } = await params!;
    const parsed = objectIdSchema.safeParse(id);
    if (!parsed.success) return error("Invalid resume ID", 400);

    const body = await req.json();
    const { jobId } = body;

    if (!jobId) return error("jobId is required", 400);

    const jobIdParsed = objectIdSchema.safeParse(jobId);
    if (!jobIdParsed.success) return error("Invalid job ID", 400);

    // fetch resume + job in parallel
    const [resume, job] = await Promise.all([
      Resume.findOne({ _id: id, userId: user.sub }).lean(),
      Job.findById(jobId).lean(),
    ]);

    if (!resume) return notFound("Resume not found");
    if (!job)    return notFound("Job not found");

    // check if already matched this resume against this job
    const existingMatch = await Match.findOne({
      userId:   user.sub,
      resumeId: id,
      jobId,
    }).lean();

    if (existingMatch) {
      return success({
        match:   existingMatch,
        source:  "cache",
        message: "Already matched. Edit your resume to rematch.",
      });
    }

    const safeContent = sanitizeResumeForAI(resume.content);

    const result = await generateWithRetry(
      () =>
        ai.models.generateContent({
          model:    "gemini-2.5-flash",
          contents: JOB_MATCH_PROMPT(safeContent, job.title, job.description),
          config:   {
            systemInstruction: JOB_MATCH_SYSTEM_PROMPT,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      () =>
        ai.models.generateContent({
          model:    "gemini-2.5-flash-lite",
          contents: JOB_MATCH_PROMPT(safeContent, job.title, job.description),
          config:   {
            systemInstruction: JOB_MATCH_SYSTEM_PROMPT,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
    );

    if (result === false) {
      return error("AI is currently busy. Please try again.", 503);
    }
    let {response} = result
    let text = (response.text ?? "").replace(/```json|```/g, "").trim();
    let parsedAI: any;

    try {
      parsedAI = JSON.parse(text);
    } catch {
      // Fallback: try extracting JSON between first { and last }
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start !== -1 && end > start) {
        try {
          parsedAI = JSON.parse(text.slice(start, end + 1));
        } catch {
          console.warn("[AI Match Parse Fail] Raw response:", text.slice(0, 500));
          throw new Error("AI response parsing failed");
        }
      } else {
        console.warn("[AI Match Parse Fail] No JSON found:", text.slice(0, 500));
        throw new Error("AI response parsing failed");
      }
    }

    if (
      typeof parsedAI.matchPercentage !== "number" ||
      !Array.isArray(parsedAI.matchedSkills) ||
      !Array.isArray(parsedAI.missingSkills)
    ) {
      throw new Error("Invalid AI response structure");
    }

    // save match + update job skills in parallel
    const [match] = await Promise.all([
      Match.create({
        userId:          user.sub,
        resumeId:        id,
        jobId,
        matchPercentage: parsedAI.matchPercentage,
        matchedSkills:   parsedAI.matchedSkills,
        missingSkills:   parsedAI.missingSkills,
        scoreBreakdown:  parsedAI.scoreBreakdown,
        suggestions:     parsedAI.suggestions,
      }),
      // update job with AI-extracted skills if not already set
      job.extractedSkills.length === 0
        ? Job.findByIdAndUpdate(jobId, {
            extractedSkills: parsedAI.extractedJobSkills ?? [],
          })
        : Promise.resolve(),
    ]);

    return success({
      match,
      source: "fresh",
    });
  });
});

export const GET = withAuth(async (req, { user, params }) => {
  return handleRoute(async () => {
    await connectToDatabase();

    const { id } = await params!;
    const parsed = objectIdSchema.safeParse(id);
    if (!parsed.success) return error("Invalid resume ID", 400);

    const matches = await Match.find({ resumeId: id, userId: user.sub })
      .populate("jobId", "title company location applyLink expiresAt postedDate")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return success({ matches });
  });
});