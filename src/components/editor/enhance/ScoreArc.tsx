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
  const cx = 100;
  const cy = 100;
  const r = 80;
  // Arc from 180° to 0° (left to right, bottom up)
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcPoint = (pct: number) => {
    const angle = 180 - pct * 180;
    return {
      x: cx + r * Math.cos(toRad(angle)),
      y: cy - r * Math.sin(toRad(angle)),
    };
  };

  const start = arcPoint(0);
  const end = arcPoint(animated / 100);
  const largeArc = animated / 100 > 0.5 ? 1 : 0;

  const scoreColor =
    newScore >= 80 ? "#10b981" : newScore >= 60 ? "#f59e0b" : "#ef4444";
  const diff = newScore - oldScore;

  return (
    <div className="flex flex-col items-center pt-1 pb-0">
      <div className="relative w-[200px] h-[108px] overflow-hidden">
        <svg
          viewBox="0 0 200 108"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Track arc */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            stroke="currentColor"
            strokeWidth="14"
            strokeLinecap="round"
            className="text-zinc-100 dark:text-zinc-800"
            fill="none"
          />
          {/* Progress arc */}
          {animated > 0 && (
            <path
              d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`}
              stroke={scoreColor}
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
              style={{
                transition: "d 1s cubic-bezier(0.34,1.2,0.64,1)",
                filter: `drop-shadow(0 0 6px ${scoreColor}66)`,
              }}
            />
          )}
          {/* Old score tick */}
          {oldScore > 0 && (() => {
            const pt = arcPoint(oldScore / 100);
            return (
              <circle
                cx={pt.x}
                cy={pt.y}
                r="5"
                fill="white"
                stroke="#94a3b8"
                strokeWidth="2"
              />
            );
          })()}
        </svg>

        {/* Center score */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center">
          <span
            className="text-[38px] font-black tabular-nums leading-none"
            style={{ color: scoreColor }}
          >
            {newScore}
          </span>
          <span className="text-[11px] text-zinc-400 font-medium tracking-wide">
            ATS score
          </span>
        </div>
      </div>

      {/* Diff badge */}
      <div className="flex items-center gap-3 mt-3">
        <span className="text-[12px] text-zinc-400 line-through tabular-nums">
          {oldScore}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-semibold",
            diff > 0
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
              : "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
          )}
        >
          <TrendingUp className="w-3 h-3" />
          {diff > 0 ? "+" : ""}
          {diff} pts
        </span>
      </div>
    </div>
  );
}
