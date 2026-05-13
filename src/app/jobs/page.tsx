"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useJobMatch, type Job, type MatchResult } from "@/hooks/useJobMatch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  MapPin,
  Sparkles,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Loader2,
  FileText,
} from "lucide-react";
import Link from "next/link";

// Extracted Components
import { JobCard } from "@/components/jobs/JobCard";
import { MatchPanel } from "@/components/jobs/MatchPanel";

export default function JobsPage() {
  const {
    jobs,
    isSearching,
    isLoadingMore,
    matchingJobId,
    activeResume,
    isFetchingResume,
    hasMore,
    total,
    fetchActiveResume,
    searchJobs,
    loadMoreJobs,
    matchJob,
    fetchMatches,
  } = useJobMatch();

  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("India");
  const [hasSearched, setHasSearched] = useState(false);

  // match results keyed by jobId
  const [matchResults, setMatchResults] = useState<Record<string, MatchResult>>(
    {},
  );

  // the job whose result panel is currently open
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    fetchActiveResume();
  }, [fetchActiveResume]);

  // Load previous matches from DB once we have the active resume
  useEffect(() => {
    if (!activeResume) return;
    fetchMatches(activeResume._id).then((matches) => {
      const map: Record<string, MatchResult> = {};
      matches.forEach((m) => {
        if (!m.jobId) return;
        const jid = typeof m.jobId === "string" ? m.jobId : m.jobId._id;
        map[jid] = m;
      });
      setMatchResults(map);
    });
  }, [activeResume, fetchMatches]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setHasSearched(true);
    setSelectedJob(null);
    await searchJobs(query, location);
  };

  const handleMatch = async (job: Job) => {
    if (!activeResume) return;
    const result = await matchJob(activeResume._id, job._id);
    if (result) {
      setMatchResults((prev) => ({ ...prev, [job._id]: result }));
      setSelectedJob(job);
    }
  };

  const handleViewResult = (job: Job) => {
    setSelectedJob(job);
  };

  const handleClosePanel = () => setSelectedJob(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Job Match
            <span className="inline-flex items-center gap-1 text-sm font-normal bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              <Sparkles className="h-3 w-3" />
              AI Powered
            </span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Search jobs and instantly see how well your resume matches.
          </p>
        </div>

        {/* Active resume pill */}
        <div className="shrink-0">
          {isFetchingResume ? (
            <Skeleton className="h-10 w-48 rounded-xl" />
          ) : activeResume ? (
            <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <div>
                <p className="text-xs font-bold text-green-700 dark:text-green-400">
                  Active Resume
                </p>
                <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                  {activeResume.title}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-2">
              <AlertCircle className="h-4 w-4 text-yellow-500 shrink-0" />
              <div>
                <p className="text-xs font-bold text-yellow-700 dark:text-yellow-400">
                  No Active Resume
                </p>
                <Link href="/dashboard">
                  <span className="text-xs text-primary underline underline-offset-2 cursor-pointer">
                    Set one in Dashboard →
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── SEARCH BAR ── */}
      <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="job-search-query"
              placeholder="Job title, skills, or keywords..."
              className="pl-9 h-11 rounded-xl bg-muted/40 border-none text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          <div className="relative sm:w-52">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="job-search-location"
              placeholder="Location"
              className="pl-9 h-11 rounded-xl bg-muted/40 border-none text-sm"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          <Button
            id="job-search-btn"
            className="h-11 px-6 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20"
            disabled={isSearching || !query.trim()}
            onClick={handleSearch}
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </div>
      </div>

      {/* ── CONTENT AREA ── */}
      <div className="flex gap-6 min-h-[60vh]">
        {/* ── JOB LIST ── */}
        <div
          className={`flex-1 min-w-0 ${selectedJob ? "hidden lg:block" : ""}`}
        >
          {/* Loading skeleton */}
          {isSearching && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border/40 bg-card p-5 space-y-3"
                >
                  <div className="flex gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <div className="flex gap-1.5">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <Skeleton key={j} className="h-5 w-14 rounded-md" />
                    ))}
                  </div>
                  <Skeleton className="h-9 w-full rounded-xl" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isSearching && !hasSearched && (
            <div className="flex flex-col items-center justify-center h-full min-h-[40vh] text-center gap-4">
              <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Find Your Next Role</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Search for jobs above and get AI-powered match scores against
                  your active resume instantly.
                </p>
              </div>
              {!activeResume && !isFetchingResume && (
                <Link href="/dashboard">
                  <Button variant="outline" className="gap-2 rounded-xl mt-2">
                    <FileText className="h-4 w-4" />
                    Go set up a Resume first
                  </Button>
                </Link>
              )}
            </div>
          )}

          {!isSearching && hasSearched && jobs.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full min-h-[40vh] text-center gap-3">
              <Search className="h-12 w-12 text-muted-foreground/30" />
              <h3 className="text-lg font-bold">No jobs found</h3>
              <p className="text-muted-foreground text-sm">
                Try different keywords or a broader location.
              </p>
            </div>
          )}

          {/* Job grid */}
          {!isSearching && jobs.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground font-medium">
                  Showing {jobs.length} of {total} result{total !== 1 && "s"}
                  {activeResume && (
                    <span className="ml-1 text-primary">
                      · matching against <strong>{activeResume.title}</strong>
                    </span>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {jobs.map((job) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      isMatching={matchingJobId === job._id}
                      matchResult={matchResults[job._id]}
                      canMatch={!!activeResume}
                      onMatch={() => handleMatch(job)}
                      onViewResult={() => handleViewResult(job)}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {hasMore && (
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    className="h-11 px-8 rounded-xl font-bold gap-2 border-primary/20 hover:bg-primary/5 text-primary"
                    disabled={isLoadingMore}
                    onClick={loadMoreJobs}
                  >
                    {isLoadingMore ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ChevronRight className="h-4 w-4 rotate-90" />
                    )}
                    {isLoadingMore ? "Loading..." : "Load More Jobs"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── MATCH RESULT PANEL ── */}
        {selectedJob && matchResults[selectedJob._id] && (
          <MatchPanel
            isOpen={!!selectedJob}
            onClose={handleClosePanel}
            job={selectedJob}
            result={matchResults[selectedJob._id]}
          />
        )}
      </div>
    </motion.div>
  );
}
