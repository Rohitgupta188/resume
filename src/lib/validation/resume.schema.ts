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
  name: z.string().trim().max(100).optional().default(""),
  email: emailSchema.optional().default(""),
  phone: z
    .string()
    .trim()
    .refine((val) => val === "" || /^\+?[0-9\s\-().]{7,20}$/.test(val), {
      message: "Phone number must be 7-20 digits (optional leading +)",
    })
    .optional(),
  linkedin: optionalUrlSchema,
  location: z.string().trim().max(200, { error: "Location is too long" }).optional(),
  portfolio: optionalUrlSchema,
});

export const educationEntrySchema = z.object({
  school: z.string().trim().max(200).optional().default(""),
  degree: z.string().trim().max(200).optional().default(""),
  field: z.string().trim().max(200).optional(),

  year: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "Year is required" : "Year must be a string",
    })
    .trim()
    .max(30, { error: "Year string is too long" }),
  gpa: z
    .string()
    .trim()
    .refine((val) => val === "" || /^\d+(\.\d{1,2})?$/.test(val), {
      message: "GPA must be numeric (e.g. 3.8)",
    })
    .optional(),
});

export const experienceEntrySchema = z.object({
  company: z.string().trim().max(200).optional().default(""),
  role: z.string().trim().max(200).optional().default(""),
  duration: z.string().trim().max(100).optional().default(""),
  bullets: stringArraySchema,
});

export const projectEntrySchema = z.object({
  title: z.string().trim().max(200).optional().default(""),
  description: z.string().trim().max(1000).optional().default(""),
  techStack: z
    .preprocess(
      (val) => (Array.isArray(val) ? val.join(", ") : val),
      z.string().trim().max(500).optional().default(""),
    ),
  link: optionalUrlSchema,
  bullets: stringArraySchema,
});


export const certificationEntrySchema = z.object({
  name: z.string().trim().max(200).optional().default(""),
  issuer: z.string().trim().max(200).optional().default(""),
  date: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "Date is required" : "Date must be a string",
    })
    .trim()
    .max(30, { error: "Date string is too long" }),
  url: optionalUrlSchema,
});

export const languageEntrySchema = z.object({
  language: z.string().trim().max(100).optional().default(""),
  proficiency: z.string().trim().max(100).optional().or(z.literal("")),
});

export const customSectionSchema = z.object({
  title: z.string().trim().min(1).max(100),
  items: stringArraySchema,
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
  certifications: z.array(certificationEntrySchema).default([]),
  languages: z.array(languageEntrySchema).default([]),
  customSections: z.array(customSectionSchema).default([]),
  themeColor: z.string().optional(),
  fontSize: z.string().optional(),
});

export const createResumeSchema = z.object({
 
  userId: objectIdSchema.optional(),

  title: nonEmptyString("Resume title", 100),
  templateId: z.string().trim().optional(),

  content: resumeContentSchema,

  atsScore: atsScoreSchema,

  pdfUrl: optionalUrlSchema,
});

export const updateResumeSchema = createResumeSchema
  .omit({ userId: true }) // userId is never updatable
  .partial()
  .extend({
    content: resumeContentSchema.partial().optional(),
    createVersion: z.boolean().optional(),
  });

export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type EducationEntryInput = z.infer<typeof educationEntrySchema>;
export type ExperienceEntryInput = z.infer<typeof experienceEntrySchema>;
export type ProjectEntryInput = z.infer<typeof projectEntrySchema>;
export type CertificationEntryInput = z.infer<typeof certificationEntrySchema>;
export type LanguageEntryInput = z.infer<typeof languageEntrySchema>;
export type CustomSectionInput = z.infer<typeof customSectionSchema>;
export type ResumeContentInput = z.infer<typeof resumeContentSchema>;
export type CreateResumeInput = z.infer<typeof createResumeSchema>;
export type UpdateResumeInput = z.infer<typeof updateResumeSchema>;
