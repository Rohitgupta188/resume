"use client";

import React from "react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { X, Sparkles, ChevronRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

import { RubricBreakdown, EnhanceModalProps } from "./enhance/types";
import { getSafeContent, diffSkills, Divider } from "./enhance/utils";
import { ScoreArc } from "./enhance/ScoreArc";
import { RubricSection } from "./enhance/RubricSection";
import { DiffSection } from "./enhance/DiffSection";
import { SkillChip } from "./enhance/SkillChip";
import { SuggestionCard } from "./enhance/SuggestionCard";

export function EnhanceModal({
  isOpen,
  onClose,
  originalContent,
  enhancedData,
  onAccept,
  onDiscard,
}: EnhanceModalProps) {
  if (!enhancedData) return null;

  const improvedContent = enhancedData.improvedContent;
  const atsScore = enhancedData.atsScore;
  const analysis = enhancedData.analysis;
  const contentHash = enhancedData.contentHash ?? analysis?.contentHash ?? "";
  const suggestions: string[] = analysis?.suggestions ?? [];
  const rubric: RubricBreakdown | undefined =
    enhancedData.rubricBreakdown ?? analysis?.rubricBreakdown;

  const oldScore = originalContent?.atsScore ?? 0;

  const safeOriginal = getSafeContent(originalContent?.content);
  const safeImproved = getSafeContent(improvedContent);

  // Skills diff
  const origSkills: string[] = safeOriginal.skills ?? [];
  const newSkills: string[] = safeImproved.skills ?? [];
  const { kept, added } = diffSkills(origSkills, newSkills);

  const handleApply = () => {
    if (!contentHash) {
      console.error("Cannot apply: contentHash missing.");
      return;
    }
    onAccept({
      improvedContent: safeImproved,
      atsScore,
      contentHash,
    });
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onDiscard();
      }}
    >
      <SheetContent
        side="right"
        showCloseButton={false}
        className={cn(
          "w-full sm:w-[500px] p-0 flex flex-col gap-0",
          "bg-white dark:bg-zinc-950",
          "border-l border-zinc-200 dark:border-zinc-800",
          "overflow-hidden"
        )}
      >
        {/* ── Header ───────────────────────────────────────────── */}
        <div className="px-6 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-500" />
              </div>
              <div>
                <SheetTitle className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100 leading-none">
                  AI improvement draft
                </SheetTitle>
                <SheetDescription className="text-[12px] text-zinc-400 mt-0.5">
                  Review before applying to your resume
                </SheetDescription>
              </div>
            </div>
            <button
              onClick={onDiscard}
              className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Score arc */}
          <ScoreArc oldScore={oldScore} newScore={atsScore} />
        </div>

        {/* ── Scrollable body ───────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-0">
          {/* Rubric breakdown */}
          {rubric && <RubricSection rubric={rubric} />}

          {/* Summary diff */}
          {(safeOriginal.summary || safeImproved.summary) && (
            <>
              <DiffSection
                title="Professional summary"
                original={
                  safeOriginal.summary || (
                    <span className="italic text-zinc-400">—</span>
                  )
                }
                improved={
                  safeImproved.summary || (
                    <span className="italic text-zinc-400">—</span>
                  )
                }
              />
              <Divider />
            </>
          )}

          {/* Skills diff */}
          {(origSkills.length > 0 || newSkills.length > 0) && (
            <>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2.5">
                Skills
                {added.length > 0 && (
                  <span className="ml-2 normal-case text-emerald-500 font-semibold">
                    +{added.length} added
                  </span>
                )}
              </p>
              <div className="grid grid-cols-2 gap-2.5 mb-1">
                {/* Original */}
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 p-3">
                  <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide mb-2">
                    Original
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {origSkills.length > 0 ? (
                      origSkills.map((s) => <SkillChip key={s} label={s} />)
                    ) : (
                      <span className="text-[12px] text-zinc-400 italic">
                        —
                      </span>
                    )}
                  </div>
                </div>
                {/* Improved */}
                <div className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/40 p-3">
                  <p className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wide mb-2">
                    Improved
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {kept.map((s) => (
                      <SkillChip key={s} label={s} />
                    ))}
                    {added.map((s) => (
                      <SkillChip key={s} label={s} added />
                    ))}
                  </div>
                </div>
              </div>
              <Divider />
            </>
          )}

          {/* Projects diff */}
          {(safeOriginal.projects?.length > 0 ||
            safeImproved.projects?.length > 0) && (
            <>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2.5">
                Projects
              </p>
              <div className="flex flex-col gap-2.5">
                {(safeImproved.projects ?? safeOriginal.projects ?? []).map(
                  (proj: any, i: number) => {
                    const origProj = safeOriginal.projects?.[i];
                    return (
                      <DiffSection
                        key={i}
                        title={
                          proj.title ?? origProj?.title ?? `Project ${i + 1}`
                        }
                        original={
                          origProj?.description ?? (
                            <span className="italic text-zinc-400">
                              No description
                            </span>
                          )
                        }
                        improved={
                          proj?.description ?? (
                            <span className="italic">No description</span>
                          )
                        }
                      />
                    );
                  }
                )}
              </div>
              <Divider />
            </>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <>
              <div className="flex items-center gap-1.5 mb-3">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">
                  Optimization tips
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {suggestions.map((s, i) => (
                  <SuggestionCard key={i} index={i + 1} text={s} />
                ))}
              </div>
            </>
          )}

          <div className="h-6" />
        </div>

        {/* ── Footer ───────────────────────────────────────────── */}
        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-950 shrink-0">
          <button
            onClick={onDiscard}
            className="text-[13px] font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Discard
          </button>
          <button
            onClick={handleApply}
            disabled={!contentHash}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg",
              "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800",
              "text-white text-[13px] font-semibold",
              "transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            )}
          >
            Apply to resume
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}