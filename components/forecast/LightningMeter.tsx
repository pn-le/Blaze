"use client";

import { lightningRisk } from "@/lib/scoring";
import { Zap } from "lucide-react";

interface LightningMeterProps {
  maxAfternoonCape: number;
}

export function LightningMeter({ maxAfternoonCape }: LightningMeterProps) {
  const risk = lightningRisk(maxAfternoonCape);
  const pct = Math.min(100, (maxAfternoonCape / 3000) * 100);

  const levels = ["Minimal", "Low", "Moderate", "High", "Extreme"];

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Zap size={14} style={{ color: risk.color }} />
        <span className="label-caps">Lightning Risk</span>
        <span
          className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ color: risk.color, background: `${risk.color}22` }}
        >
          {risk.label}
        </span>
      </div>

      {/* Meter */}
      <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: "var(--border-subtle)" }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: risk.color }}
        />
      </div>

      {/* Level labels */}
      <div className="flex justify-between mb-3">
        {levels.map((lvl) => (
          <span
            key={lvl}
            className="text-[0.55rem] uppercase font-bold"
            style={{
              color: lvl === risk.label ? risk.color : "var(--text-faint)",
            }}
          >
            {lvl}
          </span>
        ))}
      </div>

      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
        {risk.desc}
      </p>

      <p className="text-[0.65rem] mt-1" style={{ color: "var(--text-muted)" }}>
        Based on max afternoon CAPE: {Math.round(maxAfternoonCape)} J/kg
      </p>
    </div>
  );
}
