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
          ? `linear-gradient(135deg, ${accent}70 0%, ${accent}25 100%)`
          : "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
        transitionProperty: "background, box-shadow",
        transitionDuration: "300ms",
        transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
        boxShadow: selected ? `0 0 32px ${accent}22` : "none",
      }}
    >
      <button
        type="button"
        onClick={onClick}
        className="day-card-btn w-full text-left rounded-[calc(1rem-1px)] p-3"
        style={{
          background: selected ? "var(--bg-elevated)" : "var(--bg-surface)",
          boxShadow: selected
            ? `inset 0 1px 1px rgba(255,255,255,0.07)`
            : "inset 0 1px 1px rgba(255,255,255,0.03)",
          transitionProperty: "background, box-shadow, transform",
          transitionDuration: "180ms",
          transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
          cursor: "pointer",
        }}
      >
        {/* Date header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div
              className="text-xs font-bold"
              style={{ color: isToday ? "var(--border-active)" : "var(--text-secondary)" }}
            >
              {isToday
                ? "Today"
                : new Date(day.dateStr + "T12:00:00").toLocaleDateString([], { weekday: "short" })}
            </div>
            <div className="label-caps">
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
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col items-center gap-1">
            <div className="label-caps">Sunrise</div>
            <ScoreRing score={day.sunriseScore} size="sm" />
            <div className="text-[0.62rem] tabular-nums" style={{ color: "var(--text-muted)" }}>
              {formatTime(day.sunriseIso)}
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="label-caps">Sunset</div>
            <ScoreRing score={day.sunsetScore} size="sm" />
            <div className="text-[0.62rem] tabular-nums" style={{ color: "var(--text-muted)" }}>
              {formatTime(day.sunsetIso)}
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
