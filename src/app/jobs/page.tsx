"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useJobMatch, type Job, type MatchResult } from "@/hooks/useJobMatch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  MapPin,
  Briefcase,
  Sparkles,
  ExternalLink,
  ChevronRight,
  X,
  Building2,
  Zap,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  FileText,
} from "lucide-react";
import Link from "next/link";

/* ═══════════════════════════════════════════════
   Score Ring
   ═══════════════════════════════════════════════ */

function ScoreRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80
      ? "#22c55e"
      : score >= 60
        ? "#f59e0b"
        : score >= 40
          ? "#f97316"
          : "#ef4444";

  return (
    <div className="relative flex items-center justify-center w-36 h-36">
      <svg width="144" height="144" className="-rotate-90">
        <circle
          cx="72"
          cy="72"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          className="text-muted/30"
        />
        <circle
          cx="72"
          cy="72"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-black" style={{ color }}>
          {score}%
        </span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
          Match
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Score Bar
   ═══════════════════════════════════════════════ */

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color =
    value >= 80 ? "bg-green-500" : value >= 60 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs font-medium">
        <span className="text-muted-foreground capitalize">{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Match Result Panel
   ═══════════════════════════════════════════════ */

function MatchPanel({
  result,
  job,
  onClose,
}: {
  result: MatchResult;
  job: Job;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="flex flex-col gap-6 h-full"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">
            Match Result
          </p>
          <h2 className="text-lg font-bold leading-tight">{job.title}</h2>
          <p className="text-sm text-muted-foreground">{job.company}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Score ring */}
      <div className="flex flex-col items-center gap-4 py-4 rounded-2xl bg-muted/20 border border-border/40">
        <ScoreRing score={result.matchPercentage} />
        <div className="grid grid-cols-3 gap-3 w-full px-6">
          <ScoreBar label="Skills" value={result.scoreBreakdown?.skills ?? 0} />
          <ScoreBar
            label="Experience"
            value={result.scoreBreakdown?.experience ?? 0}
          />
          <ScoreBar
            label="Projects"
            value={result.scoreBreakdown?.projects ?? 0}
          />
        </div>
      </div>

      {/* Skills */}
      <div className="grid grid-cols-2 gap-4">
        {/* Matched */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-green-600">
              Matched ({result.matchedSkills.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {result.matchedSkills.length === 0 ? (
              <span className="text-xs text-muted-foreground">None</span>
            ) : (
              result.matchedSkills.map((s, i) => (
                <Badge
                  key={`matched-${s}-${i}`}
                  variant="outline"
                  className="text-[10px] bg-green-500/10 text-green-700 border-green-500/20 font-medium"
                >
                  {s}
                </Badge>
              ))
            )}
          </div>
        </div>

        {/* Missing */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <XCircle className="h-3.5 w-3.5 text-red-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-red-600">
              Missing ({result.missingSkills.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {result.missingSkills.length === 0 ? (
              <span className="text-xs text-muted-foreground">None 🎉</span>
            ) : (
              result.missingSkills.map((s, i) => (
                <Badge
                  key={`missing-${s}-${i}`}
                  variant="outline"
                  className="text-[10px] bg-red-500/10 text-red-700 border-red-500/20 font-medium"
                >
                  {s}
                </Badge>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Suggestions */}
      {result.suggestions && result.suggestions.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              AI Suggestions
            </span>
          </div>
          <ul className="space-y-2">
            {result.suggestions.map((s, i) => (
              <li key={i} className="flex gap-2 text-xs text-muted-foreground">
                <span className="shrink-0 mt-0.5 h-4 w-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[9px] font-bold">
                  {i + 1}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Apply link */}
      {job.applyLink && (
        <a
          href={job.applyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto"
        >
          <Button className="w-full gap-2 font-bold rounded-xl">
            <ExternalLink className="h-4 w-4" />
            Apply Now
          </Button>
        </a>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Job Card
   ═══════════════════════════════════════════════ */

function JobCard({
  job,
  isMatching,
  matchResult,
  canMatch,
  onMatch,
  onViewResult,
}: {
  job: Job;
  isMatching: boolean;
  matchResult?: MatchResult;
  canMatch: boolean;
  onMatch: () => void;
  onViewResult: () => void;
}) {
  const score = matchResult?.matchPercentage;
  const scoreColor =
    score == null
      ? ""
      : score >= 80
        ? "text-green-500"
        : score >= 60
          ? "text-yellow-500"
          : "text-red-500";

  const posted = job.postedDate
    ? new Date(job.postedDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
    >
      <div className="group relative rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all overflow-hidden">
        {/* top accent bar */}
        <div className="h-1 bg-linear-to-r from-primary via-violet-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="p-5 space-y-4">
          {/* Title row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight line-clamp-2">
                  {job.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                  {job.company}
                </p>
              </div>
            </div>

            {score != null && (
              <div
                className={`shrink-0 text-right cursor-pointer group/score`}
                onClick={onViewResult}
              >
                <p className={`text-xl font-black ${scoreColor}`}>{score}%</p>
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">
                  match
                </p>
              </div>
            )}
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-2">
            {job.location && (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {job.location}
              </span>
            )}
            {job.experienceLevel && (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Briefcase className="h-3 w-3" />
                {job.experienceLevel}
              </span>
            )}
            {posted && (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                {posted}
              </span>
            )}
          </div>

          {/* Skills */}
          {job.extractedSkills && job.extractedSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {job.extractedSkills.slice(0, 5).map((s, i) => (
                <Badge
                  key={`${s}-${i}`}
                  variant="secondary"
                  className="text-[10px] rounded-md px-2 py-0.5"
                >
                  {s}
                </Badge>
              ))}
              {job.extractedSkills.length > 5 && (
                <Badge
                  variant="outline"
                  className="text-[10px] rounded-md px-2 py-0.5 text-muted-foreground"
                >
                  +{job.extractedSkills.length - 5}
                </Badge>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            {matchResult ? (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-9 gap-2 rounded-xl font-semibold border-primary/30 hover:bg-primary/5"
                onClick={onViewResult}
              >
                <Target className="h-3.5 w-3.5 text-primary" />
                View Result
                <ChevronRight className="h-3.5 w-3.5 ml-auto" />
              </Button>
            ) : (
              <Button
                size="sm"
                variant="secondary"
                className="flex-1 h-9 gap-2 rounded-xl font-semibold bg-primary/10 text-primary hover:bg-primary/20 border-none"
                disabled={!canMatch || isMatching}
                onClick={onMatch}
              >
                {isMatching ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Zap className="h-3.5 w-3.5" />
                )}
                {isMatching ? "Matching..." : "Match Resume"}
              </Button>
            )}

            {job.applyLink && (
              <a href={job.applyLink} target="_blank" rel="noopener noreferrer">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-9 w-9 p-0 rounded-xl"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Main Page
   ═══════════════════════════════════════════════ */

export default function JobsPage() {
  const {
    jobs,
    isSearching,
    matchingJobId,
    activeResume,
    isFetchingResume,
    fetchActiveResume,
    searchJobs,
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
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground font-medium">
                  {jobs.length} result{jobs.length !== 1 && "s"} found
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
            </>
          )}
        </div>

        {/* ── MATCH RESULT PANEL ── */}
        <AnimatePresence>
          {selectedJob && matchResults[selectedJob._id] && (
            <motion.div
              key="match-panel"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "380px" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="shrink-0 overflow-hidden"
            >
              <div className="w-[380px] rounded-2xl border border-border/50 bg-card p-6 sticky top-24 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto shadow-2xl shadow-primary/5">
                <MatchPanel
                  result={matchResults[selectedJob._id]}
                  job={selectedJob}
                  onClose={handleClosePanel}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile full-screen panel */}
        <AnimatePresence>
          {selectedJob && matchResults[selectedJob._id] && (
            <motion.div
              key="match-panel-mobile"
              className="lg:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-sm p-6 overflow-y-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
            >
              <MatchPanel
                result={matchResults[selectedJob._id]}
                job={selectedJob}
                onClose={handleClosePanel}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
