export function normalizeAIResponse(data: any) {
  return {
    ...data,
    atsScore: Number(data.atsScore) || 0,

    improvedContent: {
      ...data.improvedContent,

      // Fix skills (string → array)
      skills: Array.isArray(data.improvedContent?.skills)
        ? data.improvedContent.skills
        : typeof data.improvedContent?.skills === "string"
        ? data.improvedContent.skills.split(",").map((s: string) => s.trim())
        : [],

      // Ensure projects array
      projects: Array.isArray(data.improvedContent?.projects)
        ? data.improvedContent.projects
        : [],
    },

    missingSkills: data.missingSkills || [],
    strengths: data.strengths || [],
    weaknesses: data.weaknesses || [],
    suggestions: data.suggestions || [],
  };
}
