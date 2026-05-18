"use client";

import type { DayData } from "@/types";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
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
  const accentColor = scoreColor(bestScore);

  return (
    /* Double-bezel outer shell */
    <div
      className="rounded-2xl p-px"
      style={{
        background: selected
          ? `linear-gradient(135deg, ${accentColor}60 0%, ${accentColor}20 100%)`
          : "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
        transitionProperty: "background",
        transitionDuration: "300ms",
        transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
      }}
    >
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left rounded-[calc(1rem-1px)] p-3"
        style={{
          background: selected ? "var(--bg-elevated)" : "var(--bg-surface)",
          boxShadow: selected
            ? `inset 0 1px 1px rgba(255,255,255,0.06), 0 0 24px ${accentColor}22`
            : "inset 0 1px 1px rgba(255,255,255,0.04)",
          transitionProperty: "background, box-shadow, transform",
          transitionDuration: "200ms",
          transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
        }}
        onMouseDown={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
        }}
        onMouseUp={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
      >
        {/* Date header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div
              className="text-xs font-bold"
              style={{
                color: isToday ? "var(--border-active)" : "var(--text-secondary)",
              }}
            >
              {isToday
                ? "Today"
                : new Date(day.dateStr + "T12:00:00").toLocaleDateString([], {
                    weekday: "short",
                  })}
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

        {/* Scores */}
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center">
            <div className="label-caps mb-1">Sunrise</div>
            <ScoreBadge score={day.sunriseScore} size="sm" showLabel={false} />
            <div
              className="text-[0.65rem] mt-1 tabular-nums"
              style={{ color: "var(--text-muted)" }}
            >
              {formatTime(day.sunriseIso)}
            </div>
          </div>
          <div className="text-center">
            <div className="label-caps mb-1">Sunset</div>
            <ScoreBadge score={day.sunsetScore} size="sm" showLabel={false} />
            <div
              className="text-[0.65rem] mt-1 tabular-nums"
              style={{ color: "var(--text-muted)" }}
            >
              {formatTime(day.sunsetIso)}
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
