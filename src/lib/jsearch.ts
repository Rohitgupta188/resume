const JSEARCH_URL = "https://jsearch.p.rapidapi.com/search";

export interface JSearchJob {
  job_id: string;
  job_title: string;
  employer_name: string;
  job_city: string;
  job_country: string;
  job_description: string;
  job_required_skills: string[];
  job_employment_type?: string;
  job_salary_currency?: string;
  job_min_salary?: number;
  job_max_salary?: number;
  job_apply_link?: string;
  job_posted_at_datetime_utc?: string;
  job_offer_expiration_datetime_utc?: string;
}

export async function fetchJobsFromJSearch(
  query: string,
  location: string,
  page = 1,
): Promise<JSearchJob[]> {
  const params = new URLSearchParams({
    query: `${query} ${location}`,
    page: String(page),
    num_pages: "1",
    country: "in",
    date_posted: "week",
  });

  const res = await fetch(`${JSEARCH_URL}?${params}`, {
    headers: {
      "x-rapidapi-host": "jsearch.p.rapidapi.com",
      "x-rapidapi-key": process.env.JSEARCH_API_KEY!,
    },
  });

  if (!res.ok) {
    throw new Error(`JSearch API error: ${res.status}`);
  }

  const data = await res.json();
  return data.data ?? [];
}

export function normalizeJob(job: JSearchJob, searchQuery: string) {
  const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

  return {
    externalJobId: job.job_id,
    searchQuery: searchQuery.toLowerCase().trim(),
    title: job.job_title,
    company: job.employer_name,
    location: [job.job_city, job.job_country].filter(Boolean).join(", "),
    description: job.job_description,
    extractedSkills: job.job_required_skills ?? [],
    experienceLevel: job.job_employment_type ?? undefined,
    salaryRange:
      job.job_min_salary && job.job_max_salary
        ? `${job.job_salary_currency ?? ""} ${job.job_min_salary}–${job.job_max_salary}`.trim()
        : undefined,
    applyLink: job.job_apply_link ?? undefined,
    source: "jsearch",
    postedDate: job.job_posted_at_datetime_utc
      ? new Date(job.job_posted_at_datetime_utc)
      : undefined,
    expiresAt: job.job_offer_expiration_datetime_utc
      ? new Date(job.job_offer_expiration_datetime_utc) // real expiry
      : new Date(Date.now() + SEVEN_DAYS), // fallback 7 days
  };
}
