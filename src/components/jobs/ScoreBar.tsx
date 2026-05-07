"use client";

import React, { useEffect, useState } from "react";

interface ScoreBarProps {
  label: string;
  value: number;
  color: string;
  delay?: number;
}

export function ScoreBar({
  label,
  value,
  color,
  delay = 0,
}: ScoreBarProps) {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setHeight(value), 120 + delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      {/* Score value */}
      <span
        className="text-[13px] font-bold tabular-nums"
        style={{ color }}
      >
        {value}
      </span>

      {/* Bar track */}
      <div className="relative w-full h-[100px] bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="absolute bottom-0 left-0 right-0 rounded-full"
          style={{
            height: `${height}%`,
            background: color,
            transition: `height 0.8s cubic-bezier(0.34,1.2,0.64,1) ${delay}ms`,
            opacity: 0.9,
          }}
        />
      </div>

      {/* Label */}
      <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 text-center leading-tight">
        {label}
      </span>
    </div>
  );
}
