"use client";

interface FactorBarProps {
  label: string;
  value: number; // 0-100 score
  rawLabel: string; // e.g. "72%", "30 km/h"
  color: string;
}

export function FactorBar({ label, value, rawLabel, color }: FactorBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="label-caps">{label}</span>
        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
          {rawLabel}
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "var(--border-subtle)" }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}
