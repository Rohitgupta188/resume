import { z } from "zod";
import {
  objectIdSchema,
  nonEmptyString,
  optionalUrlSchema,
  emailSchema,
  atsScoreSchema,
  stringArraySchema,
} from "./primitives";

export const personalInfoSchema = z.object({
  name: nonEmptyString("Name", 100),
  email: emailSchema,
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s\-().]{7,20}$/, {
      error: "Phone number must be 7–20 digits (optional leading +)",
    })
    .optional(),
  linkedin: optionalUrlSchema,
  location: z.string().trim().max(200, { error: "Location is too long" }).optional(),
  portfolio: optionalUrlSchema,
});

export const educationEntrySchema = z.object({
  school: nonEmptyString("School", 200),
  degree: nonEmptyString("Degree", 200),
  field: z.string().trim().max(200).optional(),

  year: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "Year is required" : "Year must be a string",
    })
    .trim()
    .min(4, { error: "Year must be at least 4 characters" })
    .max(30, { error: "Year string is too long" }),
  gpa: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, { error: "GPA must be numeric (e.g. 3.8)" })
    .optional(),
});

export const experienceEntrySchema = z.object({
  company: nonEmptyString("Company", 200),
  role: nonEmptyString("Role", 200),
  duration: nonEmptyString("Duration", 100),
  bullets: stringArraySchema,
});

export const projectEntrySchema = z.object({
  title: nonEmptyString("Project title", 200),
  description: nonEmptyString("Project description", 1000),
  techStack: stringArraySchema,
  link: optionalUrlSchema,
  bullets: stringArraySchema,
});


export const resumeContentSchema = z.object({
  personalInfo: personalInfoSchema,
  summary: z
    .string()
    .trim()
    .max(2000, { error: "Summary must be at most 2,000 characters" })
    .optional(),
  education: z.array(educationEntrySchema).default([]),
  skills: stringArraySchema,
  experience: z.array(experienceEntrySchema).default([]),
  projects: z.array(projectEntrySchema).default([]),
});

export const createResumeSchema = z.object({
 
  userId: objectIdSchema.optional(),

  title: nonEmptyString("Resume title", 100),

  isActive: z.boolean().default(false),

  content: resumeContentSchema,

  rawText: z.string().trim().optional(),

  atsScore: atsScoreSchema,

  pdfUrl: optionalUrlSchema,
});

export const updateResumeSchema = createResumeSchema
  .omit({ userId: true }) // userId is never updatable
  .partial()
  .extend({
    content: resumeContentSchema.partial().optional(),
  });

export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type EducationEntryInput = z.infer<typeof educationEntrySchema>;
export type ExperienceEntryInput = z.infer<typeof experienceEntrySchema>;
export type ProjectEntryInput = z.infer<typeof projectEntrySchema>;
export type ResumeContentInput = z.infer<typeof resumeContentSchema>;
export type CreateResumeInput = z.infer<typeof createResumeSchema>;
export type UpdateResumeInput = z.infer<typeof updateResumeSchema>;
