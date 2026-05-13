"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreArcProps {
  oldScore: number;
  newScore: number;
}

export function ScoreArc({ oldScore, newScore }: ScoreArcProps) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(newScore), 100);
    return () => clearTimeout(t);
  }, [newScore]);

  // Half-circle arc params
  // Circle math
  const cx = 100;
  const cy = 100;
  const r = 80;
  const circ = 2 * Math.PI * r;
  const dashOffset = circ - (animated / 100) * circ;

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const scoreColor =
    newScore >= 80 ? "#10b981" : newScore >= 60 ? "#f59e0b" : "#ef4444";
  const diff = newScore - oldScore;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[180px] h-[180px]">
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full -rotate-90"
        >
          {/* Track circle */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            stroke="currentColor"
            strokeWidth="12"
            className="text-zinc-100 dark:text-zinc-800"
          />
          
          {/* Progress circle */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            stroke={scoreColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={dashOffset}
            style={{
              transition: "stroke-dashoffset 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
              filter: `drop-shadow(0 0 8px ${scoreColor}44)`,
            }}
          />

          {/* Old score indicator (a small ring segment or dot) */}
          {oldScore > 0 && (
            <circle
              cx={cx}
              cy={cy}
              r={r}
              stroke="#94a3b8"
              strokeWidth="12"
              strokeDasharray={`2 ${circ - 2}`}
              strokeDashoffset={circ - (oldScore / 100) * circ}
              className="opacity-50"
            />
          )}

          {/* Old score dot */}
          {oldScore > 0 && (() => {
            const angle = (oldScore / 100) * 360;
            const tx = cx + r * Math.cos(toRad(angle));
            const ty = cy + r * Math.sin(toRad(angle));
            return (
              <circle
                cx={tx}
                cy={ty}
                r="4"
                fill="white"
                className="drop-shadow-md"
              />
            );
          })()}
        </svg>

        {/* Center score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <span
            className="text-[44px] font-black tabular-nums leading-none tracking-tighter"
            style={{ color: scoreColor }}
          >
            {newScore}
          </span>
          <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
            ATS Score
          </span>
          {diff > 0 && (
            <div className="flex items-center gap-0.5 mt-2 px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-wide">
              <TrendingUp className="w-2.5 h-2.5" />
              +{diff}
            </div>
          )}
        </div>
      </div>

      {/* Comparison label */}
      <div className="mt-4 flex items-center gap-2 text-[12px] font-medium text-zinc-400">
        <span>Previous: {oldScore}</span>
        <div className="w-1 h-1 rounded-full bg-zinc-300" />
        <span style={{ color: scoreColor }}>Improved: {newScore}</span>
      </div>
    </div>
  );
}

