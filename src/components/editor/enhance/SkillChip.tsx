import React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillChipProps {
  label: string;
  added?: boolean;
}

export function SkillChip({ label, added }: SkillChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border",
        added
          ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400"
          : "bg-zinc-100 border-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400"
      )}
    >
      {added && <CheckCircle2 className="w-3 h-3 shrink-0" />}
      {label}
    </span>
  );
}
