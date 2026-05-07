import { z } from "zod";

const aiResponseSchema = z.object({
  atsScore: z.number().min(0).max(100),
  rubricBreakdown: z.object({
    keywordRelevance: z.number().min(0).max(30),
    impactQuantification: z.number().min(0).max(25),
    writingQuality: z.number().min(0).max(20),
    structureClarity: z.number().min(0).max(15),
    projectRelevance: z.number().min(0).max(10),
  }).optional(),

  improvedContent: z.object({
    summary: z.string().optional(),

    skills: z.array(z.string()).optional(),

    projects: z.array(
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        techStack: z.array(z.string()).optional().default([]),
        link: z.string().optional(),
        bullets: z.array(z.string()).optional().default([]),
      })
    ).optional(),
  }),

  sectionFeedback: z.object({
    summary: z.string().optional(),
    education: z.string().optional(),
    experience: z.string().optional(),
    projects: z.string().optional(),
    skills: z.string().optional(),
  }).optional(),
  missingSkills: z.array(z.string()).default([]),
  strengths: z.array(z.string()).default([]),
  weaknesses: z.array(z.string()).default([]),
  suggestions: z.array(z.string()).default([]),
});

export { aiResponseSchema };
