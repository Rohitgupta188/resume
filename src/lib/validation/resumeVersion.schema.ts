import { z } from "zod";
import { objectIdSchema } from "./primitives";
import { resumeContentSchema } from "./resume.schema";

export const RESUME_VERSION_TYPES = ["original", "ai_improved", "manual"] as const;

export const resumeVersionTypeSchema = z.enum(RESUME_VERSION_TYPES, {
  error: `Version type must be one of: ${RESUME_VERSION_TYPES.join(", ")}`,
});

const versionContentSchema = z.union([
  resumeContentSchema,
  z.record(z.string(), z.unknown()),
]);

export const createResumeVersionSchema = z
  .object({
    resumeId: objectIdSchema,

    versionNumber: z
      .number({
        error: (issue) =>
          issue.input === undefined
            ? "Version number is required"
            : "Version number must be a number",
      })
      .int({ error: "Version number must be an integer" })
      .min(1, { error: "Version number must be at least 1" }),

    type: resumeVersionTypeSchema,

    content: versionContentSchema,

    aiPromptUsed: z
      .string()
      .trim()
      .max(5_000, { error: "AI prompt must be at most 5,000 characters" })
      .optional(),

    changesSummary: z
      .string()
      .trim()
      .max(2_000, { error: "Changes summary must be at most 2,000 characters" })
      .optional(),
  })
  .superRefine(({ type, aiPromptUsed }, ctx) => {
    if (type === "ai_improved" && !aiPromptUsed) {
      ctx.addIssue({
        code: "custom",
        message: "aiPromptUsed is required for ai_improved versions",
        path: ["aiPromptUsed"],
      });
    }
  });

export const updateResumeVersionSchema = z.object({
  changesSummary: z
    .string()
    .trim()
    .max(2_000, { error: "Changes summary must be at most 2,000 characters" })
    .optional(),
});

export type ResumeVersionType = z.infer<typeof resumeVersionTypeSchema>;
export type CreateResumeVersionInput = z.infer<typeof createResumeVersionSchema>;
export type UpdateResumeVersionInput = z.infer<typeof updateResumeVersionSchema>;
