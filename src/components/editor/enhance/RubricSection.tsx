"use client";

import React, { useEffect, useState } from "react";
import { RubricBreakdown, RUBRIC_CONFIG } from "./types";
import { Divider } from "./utils";

interface RubricRowProps {
  label: string;
  value: number;
  max: number;
  color: string;
  trackColor: string;
  delay: number;
  oldValue?: number;
}

export function RubricRow({
  label,
  value,
  max,
  color,
  trackColor,
  delay,
  oldValue,
}: RubricRowProps) {
  const [width, setWidth] = useState(0);
  const pct = Math.round((value / max) * 100);
  const oldPct = oldValue !== undefined ? Math.round((oldValue / max) * 100) : null;

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 80 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);

  return (
    <div className="flex items-center gap-3">
      {/* Label */}
      <span className="text-[12px] text-zinc-500 dark:text-zinc-400 w-[130px] shrink-0 truncate">
        {label}
      </span>

      {/* Bar */}
      <div className="relative flex-1 h-[7px] rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-visible">
        {/* Old value ghost */}
        {oldPct !== null && (
          <div
            className="absolute top-0 left-0 h-full rounded-full opacity-25"
            style={{ width: `${oldPct}%`, background: color }}
          />
        )}
        {/* New value bar */}
        <div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{
            width: `${width}%`,
            background: color,
            transition: `width 0.7s cubic-bezier(0.34,1.1,0.64,1) ${delay}ms`,
            boxShadow: `0 0 6px ${color}55`,
          }}
        />
      </div>

      {/* Score / Max */}
      <div className="flex items-baseline gap-0.5 w-[42px] text-right shrink-0">
        <span
          className="text-[13px] font-semibold tabular-nums"
          style={{ color }}
        >
          {value}
        </span>
        <span className="text-[10px] text-zinc-400">/{max}</span>
      </div>
    </div>
  );
}

interface RubricSectionProps {
  rubric: RubricBreakdown;
}

export function RubricSection({ rubric }: RubricSectionProps) {
  return (
    <>
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
        Score breakdown
      </p>
      <div className="flex flex-col gap-3">
        {RUBRIC_CONFIG.map((cfg, i) => (
          <RubricRow
            key={cfg.key}
            label={cfg.label}
            value={rubric[cfg.key]}
            max={cfg.max}
            color={cfg.color}
            trackColor={cfg.trackColor}
            delay={i * 70}
          />
        ))}
      </div>
      <Divider />
    </>
  );
}
