import { z } from "zod";
import {
  nonEmptyString,
  optionalUrlSchema,
  coercedDateSchema,
  stringArraySchema,
  percentageSchema,
  paginationSchema,
} from "./primitives";

export const EXPERIENCE_LEVELS = [
  "internship",
  "entry",
  "mid",
  "senior",
  "lead",
  "executive",
] as const;

export const experienceLevelSchema = z
  .enum(EXPERIENCE_LEVELS, {
    error: `Experience level must be one of: ${EXPERIENCE_LEVELS.join(", ")}`,
  })
  .optional();

const salaryRangeSchema = z
  .string()
  .trim()
  .regex(
    /^(\$?[\d,]+k?)\s*[-–]\s*(\$?[\d,]+k?)(\s*(USD|GBP|EUR|INR))?$/i,
    { error: 'Salary range must match a pattern like "$60k – $90k USD" or "60000 - 90000"' }
  )
  .optional();

const baseJobSchema = z.object({
  externalJobId: z.string().trim().optional(),

  title: nonEmptyString("Job title", 200),

  company: nonEmptyString("Company", 200),

  location: z.string().trim().max(300, { error: "Location is too long" }).optional(),

  description: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Job description is required"
          : "Job description must be a string",
    })
    .trim()
    .min(30, { error: "Description must be at least 30 characters" })
    .max(20_000, { error: "Description must be at most 20,000 characters" }),

  extractedSkills: stringArraySchema,

  experienceLevel: experienceLevelSchema,

  salaryRange: salaryRangeSchema,

  applyLink: optionalUrlSchema,

  source: nonEmptyString("Source", 200),

  postedDate: coercedDateSchema.optional(),
});

export const createJobSchema = baseJobSchema;

export const updateJobSchema = baseJobSchema.partial().superRefine((data, ctx) => {
  if (Object.keys(data).length === 0) {
    ctx.addIssue({
      code: "custom",
      message: "At least one field must be provided for update",
      path: [],
    });
  }
});

export const jobQuerySchema = z.object({
  q: z.string().trim().max(200).optional(),
  company: z.string().trim().max(200).optional(),
  location: z.string().trim().max(200).optional(),
  experienceLevel: experienceLevelSchema,
  minScore: z
    .string()
    .optional()
    .transform((v) => (v !== undefined ? Number(v) : undefined))
    .pipe(percentageSchema.optional()),
  ...paginationSchema.shape,
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type JobQueryInput = z.infer<typeof jobQuerySchema>;
