import { z } from "zod";
import { objectIdSchema, percentageSchema, stringArraySchema } from "./primitives";

export const scoreBreakdownSchema = z.object({
  skills: percentageSchema,
  experience: percentageSchema,
  projects: percentageSchema,
});

const baseMatchSchema = z.object({
  userId: objectIdSchema,
  resumeId: objectIdSchema,
  jobId: objectIdSchema,
  matchPercentage: percentageSchema,
  matchedSkills: stringArraySchema,
  missingSkills: stringArraySchema,
  scoreBreakdown: scoreBreakdownSchema,
  suggestions: stringArraySchema,
});

export const createMatchSchema = baseMatchSchema
  .omit({ userId: true })
  .extend({
    userId: objectIdSchema.optional(),
  })
  .superRefine(({ matchPercentage, matchedSkills, missingSkills }, ctx) => {
    if (matchPercentage === 100 && missingSkills.length > 0) {
      ctx.addIssue({
        code: "custom",
        message: "A 100% match cannot have missing skills",
        path: ["missingSkills"],
      });
    }

    if (matchPercentage === 0 && matchedSkills.length > 0) {
      ctx.addIssue({
        code: "custom",
        message: "A 0% match cannot have matched skills",
        path: ["matchedSkills"],
      });
    }
  });

export const updateMatchSchema = baseMatchSchema
  .omit({ userId: true, resumeId: true, jobId: true })
  .partial()
  .superRefine((data, ctx) => {
    if (Object.keys(data).length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "At least one field must be provided for update",
        path: [],
      });
    }
  });

export type ScoreBreakdown = z.infer<typeof scoreBreakdownSchema>;
export type CreateMatchInput = z.infer<typeof createMatchSchema>;
export type UpdateMatchInput = z.infer<typeof updateMatchSchema>;
