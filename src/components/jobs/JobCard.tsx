"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Briefcase,
  ExternalLink,
  ChevronRight,
  Building2,
  Zap,
  Target,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type Job, type MatchResult } from "@/hooks/useJobMatch";

interface JobCardProps {
  job: Job;
  isMatching: boolean;
  matchResult?: MatchResult;
  canMatch: boolean;
  onMatch: () => void;
  onViewResult: () => void;
}

export function JobCard({
  job,
  isMatching,
  matchResult,
  canMatch,
  onMatch,
  onViewResult,
}: JobCardProps) {
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
                className="shrink-0 flex flex-col items-end cursor-pointer group/score"
                onClick={onViewResult}
              >
                <div className={cn(
                  "px-2 py-0.5 rounded-lg text-[13px] font-bold tabular-nums border",
                  score >= 80 ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400" :
                  score >= 60 ? "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-400" :
                  "bg-red-50 border-red-200 text-red-600 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400"
                )}>
                  {score}%
                </div>
                <p className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold mt-1">
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
