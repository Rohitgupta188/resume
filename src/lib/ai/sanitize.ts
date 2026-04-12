export function sanitizeResumeForAI(content: any) {
  return {
    summary: content.summary || "",
    education: content.education || [],
    skills: content.skills || [],
    experience: content.experience || [],
    projects: content.projects || [],
  };
}
