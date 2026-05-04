"use client";

import { useCallback, useState } from "react";
import { api, ApiError } from "@/lib/api-client";
import { toast } from "sonner";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */

export interface Job {
  _id: string;
  externalJobId: string;
  title: string;
  company: string;
  location?: string;
  experienceLevel?: string;
  salaryRange?: string;
  applyLink?: string;
  source: string;
  postedDate?: string;
  expiresAt: string;
  extractedSkills: string[];
}

export interface MatchResult {
  _id: string;
  resumeId: string;
  jobId: string | { _id: string; title: string; company: string; location?: string; applyLink?: string };
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  scoreBreakdown: {
    skills: number;
    experience: number;
    projects: number;
  };
  suggestions: string[];
  createdAt: string;
}

export interface ActiveResume {
  _id: string;
  title: string;
  atsScore?: number;
}

/* ─────────────────────────────────────────────
   Hook
───────────────────────────────────────────── */

export function useJobMatch() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [matchingJobId, setMatchingJobId] = useState<string | null>(null);
  const [activeResume, setActiveResume] = useState<ActiveResume | null>(null);
  const [isFetchingResume, setIsFetchingResume] = useState(false);
  const [previousMatches, setPreviousMatches] = useState<MatchResult[]>([]);

  /* ── Fetch active resume ── */
  const fetchActiveResume = useCallback(async () => {
    setIsFetchingResume(true);
    try {
      const data = await api.get<{ resumes: ActiveResume[] }>("/api/resume");
      const active = (data.resumes as any[]).find((r) => r.isActive);
      setActiveResume(active ?? null);
      return active ?? null;
    } catch {
      toast.error("Failed to fetch resumes");
      return null;
    } finally {
      setIsFetchingResume(false);
    }
  }, []);

  /* ── Search jobs ── */
  const searchJobs = useCallback(async (query: string, location: string) => {
    if (!query.trim()) return;
    setIsSearching(true);
    setJobs([]);
    try {
      const params = new URLSearchParams({ q: query });
      if (location.trim()) params.set("location", location.trim());
      const data = await api.get<{ jobs: Job[]; source: string }>(
        `/api/jobs/search?${params.toString()}`
      );
      setJobs(data.jobs);
      if (data.jobs.length === 0) {
        toast.info("No jobs found for that query. Try different keywords.");
      }
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Job search failed";
      toast.error(msg);
    } finally {
      setIsSearching(false);
    }
  }, []);

  /* ── Match resume against a job ── */
  const matchJob = useCallback(
    async (resumeId: string, jobId: string): Promise<MatchResult | null> => {
      setMatchingJobId(jobId);
      try {
        toast.loading("AI is analysing your match...", { id: `match-${jobId}` });
        const data = await api.post<{ match: MatchResult; source: string }>(
          `/api/resume/${resumeId}/match`,
          { jobId }
        );
        const msg =
          data.source === "cache"
            ? "Showing cached match result"
            : "Match analysis complete!";
        toast.success(msg, { id: `match-${jobId}` });
        return data.match;
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : "Match failed";
        toast.error(msg, { id: `match-${jobId}` });
        return null;
      } finally {
        setMatchingJobId(null);
      }
    },
    []
  );

  /* ── Fetch previous matches for a resume ── */
  const fetchMatches = useCallback(async (resumeId: string) => {
    try {
      const data = await api.get<{ matches: MatchResult[] }>(
        `/api/resume/${resumeId}/match`
      );
      setPreviousMatches(data.matches);
      return data.matches;
    } catch {
      return [];
    }
  }, []);

  return {
    jobs,
    isSearching,
    matchingJobId,
    activeResume,
    isFetchingResume,
    previousMatches,
    fetchActiveResume,
    searchJobs,
    matchJob,
    fetchMatches,
  };
}
