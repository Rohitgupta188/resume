import { z } from "zod";

const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

export const objectIdSchema = z
  .string({ error: "ID must be a string" })
  .regex(OBJECT_ID_REGEX, { error: "Invalid MongoDB ObjectId" });

export const nonEmptyString = (label: string, max = 500) =>
  z
    .string({
      error: (issue) =>
        issue.input === undefined ? `${label} is required` : `${label} must be a string`,
    })
    .trim()
    .max(max, { error: `${label} must be at most ${max} characters` });

export const optionalUrlSchema = z
  .string()
  .trim()
  .refine((val) => val === "" || z.url().safeParse(val).success, {
    error: "Must be a valid URL",
  })
  .transform((val) => (val === "" ? undefined : val))
  .optional();

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .refine((val) => val === "" || z.email().safeParse(val).success, {
    message: "Invalid email address",
  });

export const coercedDateSchema = z.coerce.date({
  error: (issue) =>
    issue.input === undefined ? "Date is required" : "Must be a valid date",
});


/** A float in [0, 100] representing a percentage. */
export const percentageSchema = z
  .number({
    error: (issue) =>
      issue.input === undefined
        ? "Percentage is required"
        : "Percentage must be a number",
  })
  .min(0, { error: "Must be at least 0" })
  .max(100, { error: "Must be at most 100" });

export const atsScoreSchema = z
  .number()
  .min(0, { error: "ATS score must be at least 0" })
  .max(100, { error: "ATS score must be at most 100" })
  .optional();


export const stringArraySchema = z
  .array(z.string().trim().min(1, { error: "Array items must not be empty" }))
  .default([]);


export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
