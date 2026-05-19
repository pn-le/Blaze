"use client";

import type { DayData } from "@/types";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { lightningRisk, scoreColor } from "@/lib/scoring";
import { formatTime } from "@/lib/formatting";
import { Zap } from "lucide-react";

interface DayCardProps {
  day: DayData;
  selected: boolean;
  onClick: () => void;
}

export function DayCard({ day, selected, onClick }: DayCardProps) {
  const lightning = lightningRisk(day.maxAfternoonCape);
  const showLightning = lightning.level >= 2;
  const isToday = day.dateStr === new Date().toISOString().slice(0, 10);
  const bestScore = Math.max(day.sunriseScore, day.sunsetScore);
  const accent = scoreColor(bestScore);

  return (
    <div
      className="rounded-2xl p-px"
      style={{
        background: selected
          ? `linear-gradient(135deg, ${accent}80 0%, ${accent}30 60%, transparent 100%)`
          : "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
        transitionProperty: "background, box-shadow",
        transitionDuration: "250ms",
        transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
        boxShadow: selected ? `0 0 40px ${accent}30, 0 8px 32px rgba(0,0,0,0.4)` : "0 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      <button
        type="button"
        onClick={onClick}
        className="day-card-btn w-full text-left rounded-[calc(1rem-1px)] p-4 cursor-pointer"
        style={{
          background: selected
            ? `linear-gradient(160deg, ${accent}10 0%, var(--bg-elevated) 50%)`
            : "var(--bg-surface)",
          boxShadow: selected
            ? `inset 0 1px 1px rgba(255,255,255,0.08)`
            : "inset 0 1px 1px rgba(255,255,255,0.03)",
          transitionProperty: "background, box-shadow, transform",
          transitionDuration: "200ms",
          transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        {/* Date header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div
              className="text-sm font-black tracking-tight"
              style={{ color: isToday ? "var(--border-active)" : "var(--text-primary)" }}
            >
              {isToday
                ? "Today"
                : new Date(day.dateStr + "T12:00:00").toLocaleDateString([], { weekday: "short" })}
            </div>
            <div
              className="text-[0.7rem] font-medium mt-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              {new Date(day.dateStr + "T12:00:00").toLocaleDateString([], {
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
          {showLightning && (
            <div
              className="flex items-center gap-0.5 text-[0.55rem] font-bold uppercase px-1.5 py-0.5 rounded-full"
              style={{
                color: lightning.color,
                background: `${lightning.color}18`,
                border: `1px solid ${lightning.color}40`,
              }}
            >
              <Zap size={7} />
              {lightning.label}
            </div>
          )}
        </div>

        {/* Score rings */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center gap-1.5">
            <div className="label-caps">Sunrise</div>
            <ScoreRing score={day.sunriseScore} size="sm" />
            <div className="text-[0.65rem] tabular-nums font-medium" style={{ color: "var(--text-muted)" }}>
              {formatTime(day.sunriseIso)}
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="label-caps">Sunset</div>
            <ScoreRing score={day.sunsetScore} size="sm" />
            <div className="text-[0.65rem] tabular-nums font-medium" style={{ color: "var(--text-muted)" }}>
              {formatTime(day.sunsetIso)}
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
