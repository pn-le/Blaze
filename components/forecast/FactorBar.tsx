"use client";

interface FactorBarProps {
  label: string;
  value: number; // 0-100 score
  rawLabel: string;
  color: string;
}

export function FactorBar({ label, value, rawLabel, color }: FactorBarProps) {
  const isStrong = value >= 75;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="label-caps">{label}</span>
        <span
          className="text-xs tabular-nums font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          {rawLabel}
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: "rgba(45,63,87,0.5)" }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="h-full rounded-full bar-fill"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color}cc, ${color})`,
            boxShadow: isStrong ? `0 0 8px ${color}88` : "none",
          }}
        />
      </div>
    </div>
  );
}
