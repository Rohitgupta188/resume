"use client";

import React from "react";
import { motion } from "framer-motion";
import {

  Lightbulb,

} from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";
import { type Job, type MatchResult } from "@/hooks/useJobMatch";
import { ScoreRing } from "./ScoreRing";
import { ScoreBar } from "./ScoreBar";

interface MatchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
  result: MatchResult;
}

// ─── Skill Chip ───────────────────────────────────────────────────────────────

function SkillChip({
  label,
  matched,
}: {
  label: string;
  matched: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium border transition-all",
        matched
          ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400"
          : "bg-red-50 border-red-200 text-red-600 dark:bg-red-950 dark:border-red-900 dark:text-red-400"
      )}
    >

      {label}
    </span>
  );
}

// ─── Tip Card ─────────────────────────────────────────────────────────────────

function TipCard({
  index,
  text,
}: {
  index: number;
  text: string;
}) {
  return (
    <div className="flex gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-100 dark:border-amber-900 group hover:border-amber-300 dark:hover:border-amber-700 transition-all">
      <div className="shrink-0 w-6 h-6 rounded-full bg-amber-400 dark:bg-amber-600 text-white text-[11px] font-bold flex items-center justify-center mt-0.5">
        {index}
      </div>
      <p className="text-[13px] text-amber-900 dark:text-amber-300 leading-relaxed">
        {text}
      </p>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">
      {children}
    </h3>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────

function Divider() {
  return <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-5" />;
}

export function MatchPanel({
  isOpen,
  onClose,
  job,
  result,
}: MatchPanelProps) {
  const breakdown = [
    { label: "Skills", score: result.scoreBreakdown?.skills ?? 0, color: "#22c55e" },
    { label: "Experience", score: result.scoreBreakdown?.experience ?? 0, color: "#f59e0b" },
    { label: "Projects", score: result.scoreBreakdown?.projects ?? 0, color: "#6366f1" },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className={cn(
          "w-full sm:w-[460px] p-0 flex flex-col gap-0",
          "bg-white dark:bg-zinc-950",
          "border-l border-zinc-200 dark:border-zinc-800",
          "overflow-hidden"
        )}
      >
        <VisuallyHidden>
          <SheetTitle>Match Analysis for {job.title}</SheetTitle>
          <SheetDescription>
            Detailed breakdown of how your resume matches the {job.title} position at {job.company}.
          </SheetDescription>
        </VisuallyHidden>

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="px-6 pt-6 pb-5 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-1">
                Match analysis
              </p>
              <h2 className="text-[17px] font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                {job.title}
              </h2>
              <p className="text-[13px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                {job.company}
              </p>
            </div>
          </div>

          <div className="flex justify-center py-2">
            <ScoreRing score={result.matchPercentage} />
          </div>
        </div>

        {/* ── Scrollable Body ─────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-0">
          <SectionHeader>Score breakdown</SectionHeader>
          <div className="flex items-end gap-3">
            {breakdown.map((item, i) => (
              <ScoreBar
                key={item.label}
                label={item.label}
                value={item.score}
                color={item.color}
                delay={i * 80}
              />
            ))}
          </div>

          <Divider />

          <SectionHeader>
            Matched skills{" "}
            <span className="text-emerald-500 ml-1">({result.matchedSkills.length})</span>
          </SectionHeader>
          <div className="flex flex-wrap gap-2 mb-1">
            {result.matchedSkills.map((s) => (
              <SkillChip key={s} label={s} matched />
            ))}
          </div>

          {result.missingSkills.length > 0 && (
            <div className="mt-4 mb-3">
              <SectionHeader>
                Missing skills{" "}
                <span className="text-red-400 ml-1">({result.missingSkills.length})</span>
              </SectionHeader>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills.map((s) => (
                  <SkillChip key={s} label={s} matched={false} />
                ))}
              </div>
            </div>
          )}

          <Divider />

          {result.suggestions && result.suggestions.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <SectionHeader>
                  <span className="text-amber-600 dark:text-amber-500">
                    Improvement tips
                  </span>
                </SectionHeader>
              </div>
              <div className="flex flex-col gap-2.5">
                {result.suggestions.map((s, i) => (
                  <TipCard key={i} index={i + 1} text={s} />
                ))}
              </div>
            </>
          )}

          <div className="h-6" />
        </div>


      </SheetContent>
    </Sheet>
  );
}
