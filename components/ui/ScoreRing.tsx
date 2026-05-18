"use client";

import { scoreColor, scoreLabel } from "@/lib/scoring";

interface ScoreRingProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const CONFIGS = {
  sm: { dim: 56, r: 22, stroke: 3, font: 14 },
  md: { dim: 76, r: 30, stroke: 3.5, font: 19 },
  lg: { dim: 100, r: 40, stroke: 4, font: 26 },
};

export function ScoreRing({ score, size = "md", showLabel = false }: ScoreRingProps) {
  const color = scoreColor(score);
  const { label, emoji } = scoreLabel(score);
  const cfg = CONFIGS[size];
  const CIRC = 2 * Math.PI * cfg.r;
  const offset = CIRC - (score / 100) * CIRC;
  const cx = cfg.dim / 2;
  const cy = cfg.dim / 2;
  const id = `glow-${size}-${score}`;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        width={cfg.dim}
        height={cfg.dim}
        viewBox={`0 0 ${cfg.dim} ${cfg.dim}`}
        className="overflow-visible"
        aria-label={`Score: ${score} — ${label}`}
      >
        <defs>
          <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background track */}
        <circle
          cx={cx}
          cy={cy}
          r={cfg.r}
          fill="none"
          stroke="rgba(45,63,87,0.45)"
          strokeWidth={cfg.stroke}
        />

        {/* Score arc */}
        <circle
          cx={cx}
          cy={cy}
          r={cfg.r}
          fill="none"
          stroke={color}
          strokeWidth={cfg.stroke}
          strokeLinecap="round"
          strokeDasharray={`${CIRC} ${CIRC}`}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          filter={`url(#${id})`}
          style={{
            transitionProperty: "stroke-dashoffset, stroke",
            transitionDuration: "700ms",
            transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
          }}
        />

        {/* Score number */}
        <text
          x={cx}
          y={cy + cfg.font * 0.38}
          textAnchor="middle"
          fill={color}
          fontSize={cfg.font}
          fontWeight="900"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {score}
        </text>
      </svg>

      {showLabel && (
        <span
          className="text-[0.6rem] font-bold uppercase tracking-widest"
          style={{ color }}
        >
          {emoji} {label}
        </span>
      )}
    </div>
  );
}
