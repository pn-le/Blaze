"use client";

import { scoreColor, scoreLabel } from "@/lib/scoring";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function ScoreBadge({
  score,
  size = "md",
  showLabel = true,
}: ScoreBadgeProps) {
  const color = scoreColor(score);
  const { label, emoji } = scoreLabel(score);

  const sizeClasses = {
    sm: "text-lg font-black",
    md: "text-3xl font-black",
    lg: "text-5xl font-black",
  };

  const labelSizes = {
    sm: "text-[0.6rem]",
    md: "text-xs",
    lg: "text-sm",
  };

  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={sizeClasses[size]} style={{ color }}>
        {score}
      </span>
      {showLabel && (
        <span
          className={`${labelSizes[size]} font-bold uppercase tracking-wide`}
          style={{ color }}
        >
          {emoji} {label}
        </span>
      )}
    </div>
  );
}
