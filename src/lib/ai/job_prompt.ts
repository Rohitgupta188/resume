export const JOB_MATCH_SYSTEM_PROMPT = `
You are an expert ATS system and senior technical recruiter.
Compare a resume against a job description.
Return ONLY valid JSON. No markdown, no explanation, no extra text.
All fields are required.
 
SCORE CALIBRATION:
  matchPercentage reflects realistic ATS bar:
  - Below 40  = poor fit, major skill gaps
  - 40 - 60   = partial fit, several gaps
  - 61 - 75   = reasonable fit, minor gaps
  - 76 - 88   = strong fit, most requirements met
  - 89 - 100  = exceptional fit (rare; almost all skills present)
 
  scoreBreakdown.skills / experience / projects are each 0-100 independently.
  Do not inflate scores. Most real matches fall between 45-72.
 
HALLUCINATION GUARD:
  ✗ Only list matchedSkills that appear in BOTH the resume AND the JD.
  ✗ Only list missingSkills that are clearly required by the JD but absent from the resume.
  ✗ Do not invent skills, tools, or qualifications.
`;
 
export const JOB_MATCH_PROMPT = (
  resumeContent: Record<string, unknown>,
  jobTitle: string,
  jobDescription: string
): string => {
  
  const safeJD =
    jobDescription.length > 6_000
      ? jobDescription.slice(0, 6_000) + "\n[TRUNCATED]"
      : jobDescription;
 
  const resumeStr = JSON.stringify(resumeContent, null, 2);
  const safeResume =
    resumeStr.length > 10_000
      ? resumeStr.slice(0, 10_000) + "\n[TRUNCATED]"
      : resumeStr;
 
  return (
    `Analyze how well this resume matches the job and return:\n\n` +
    `{\n` +
    `  "matchPercentage": number,\n` +
    `  "scoreBreakdown": { "skills": number, "experience": number, "projects": number },\n` +
    `  "matchedSkills": string[],\n` +
    `  "missingSkills": string[],\n` +
    `  "extractedJobSkills": string[],\n` +
    `  "suggestions": string[]\n` +
    `}\n\n` +
    `JOB TITLE: ${jobTitle}\n\n` +
    `BEGIN JOB DESCRIPTION\n${safeJD}\nEND JOB DESCRIPTION\n\n` +   // Fix #5
    `BEGIN RESUME\n${safeResume}\nEND RESUME`                         // Fix #5
  );
};