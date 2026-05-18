"use client";

import type { MoonPhaseResult } from "@/types";

interface MoonCardProps {
  moon: MoonPhaseResult;
}

export function MoonCard({ moon }: MoonCardProps) {
  const hikerNote =
    moon.illum > 80
      ? "Bright moon — excellent for pre-dawn approach without headlamp."
      : moon.illum > 40
      ? "Partial moon — useful light for the approach."
      : moon.daysToFull <= 3
      ? `Full moon in ${moon.daysToFull} days — great for night hiking soon.`
      : "Dark sky — headlamp required for pre-dawn start.";

  return (
    <div
      className="rounded-xl p-4 flex items-center gap-4"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
    >
      <div className="text-4xl" aria-hidden="true">
        {moon.emoji}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="label-caps">Moon Phase</span>
          <span className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>
            {moon.illum}% illuminated
          </span>
        </div>
        <div className="text-sm font-bold mb-1" style={{ color: "var(--text-primary)" }}>
          {moon.name}
        </div>
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          {hikerNote}
        </p>
      </div>
    </div>
  );
}
