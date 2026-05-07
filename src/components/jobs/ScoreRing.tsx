import React, { useEffect, useState } from "react";

export function ScoreRing({ score }: { score: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setTimeout(() => setAnimated(score), 80);
    });
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const offset = circ - (animated / 100) * circ;

  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";

  const label =
    score >= 80 ? "Strong match" : score >= 60 ? "Good match" : "Weak match";

  return (
    <div className="flex flex-col items-center gap-1 select-none">
      <div className="relative w-[136px] h-[136px]">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 136 136"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Track */}
          <circle
            cx="68"
            cy="68"
            r={r}
            stroke="currentColor"
            strokeWidth="10"
            className="text-zinc-100 dark:text-zinc-800"
          />
          {/* Progress */}
          <circle
            cx="68"
            cy="68"
            r={r}
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 1s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-[32px] font-bold tabular-nums leading-none"
            style={{ color }}
          >
            {score}
          </span>
          <span className="text-[11px] font-medium text-zinc-400 tracking-wide mt-0.5">
            / 100
          </span>
        </div>
      </div>

      <span
        className="text-[12px] font-semibold tracking-widest uppercase px-3 py-0.5 rounded-full"
        style={{ color, background: `${color}18` }}
      >
        {label}
      </span>
    </div>
  );
}
