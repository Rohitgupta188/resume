import React from "react";

interface SuggestionCardProps {
  index: number;
  text: string;
}

export function SuggestionCard({ index, text }: SuggestionCardProps) {
  return (
    <div className="flex gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900 hover:border-amber-300 dark:hover:border-amber-700 transition-colors">
      <div className="shrink-0 w-5 h-5 rounded-full bg-amber-400 dark:bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">
        {index}
      </div>
      <p className="text-[13px] text-amber-900 dark:text-amber-300 leading-relaxed">
        {text}
      </p>
    </div>
  );
}
