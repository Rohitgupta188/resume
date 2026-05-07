import React from "react";

interface DiffSectionProps {
  title: string;
  original: React.ReactNode;
  improved: React.ReactNode;
}

export function DiffSection({
  title,
  original,
  improved,
}: DiffSectionProps) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2.5">
        {title}
      </p>
      <div className="grid grid-cols-2 gap-2.5">
        {/* Original */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 p-3">
          <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide mb-2">
            Original
          </p>
          <div className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {original}
          </div>
        </div>
        {/* Improved */}
        <div className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/40 p-3">
          <p className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wide mb-2">
            Improved
          </p>
          <div className="text-[13px] text-indigo-900 dark:text-indigo-200 leading-relaxed">
            {improved}
          </div>
        </div>
      </div>
    </div>
  );
}
