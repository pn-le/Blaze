"use client";

import type { DayData } from "@/types";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { lightningRisk } from "@/lib/scoring";
import { formatTime, formatDate } from "@/lib/formatting";
import { Zap } from "lucide-react";

interface DayCardProps {
  day: DayData;
  selected: boolean;
  onClick: () => void;
}

export function DayCard({ day, selected, onClick }: DayCardProps) {
  const lightning = lightningRisk(day.maxAfternoonCape);
  const showLightning = lightning.level >= 2;
  const isToday =
    day.dateStr === new Date().toISOString().slice(0, 10);

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-xl border p-3 transition-all"
      style={{
        background: selected ? "var(--bg-elevated)" : "var(--bg-surface)",
        borderColor: selected ? "var(--border-active)" : "var(--border-subtle)",
        boxShadow: selected ? "0 0 0 1px var(--border-active)" : "none",
      }}
    >
      {/* Date header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <div
            className="text-xs font-bold"
            style={{ color: isToday ? "var(--border-active)" : "var(--text-secondary)" }}
          >
            {isToday ? "Today" : new Date(day.dateStr + "T12:00:00").toLocaleDateString([], { weekday: "short" })}
          </div>
          <div className="label-caps">
            {new Date(day.dateStr + "T12:00:00").toLocaleDateString([], { month: "short", day: "numeric" })}
          </div>
        </div>
        {showLightning && (
          <div
            className="flex items-center gap-0.5 text-[0.6rem] font-bold uppercase px-1.5 py-0.5 rounded-full"
            style={{
              color: lightning.color,
              background: `${lightning.color}22`,
              border: `1px solid ${lightning.color}44`,
            }}
          >
            <Zap size={8} />
            {lightning.label}
          </div>
        )}
      </div>

      {/* Scores */}
      <div className="grid grid-cols-2 gap-2">
        <div className="text-center">
          <div className="label-caps mb-1">Sunrise</div>
          <ScoreBadge score={day.sunriseScore} size="sm" />
          <div
            className="text-[0.65rem] mt-0.5"
            style={{ color: "var(--text-muted)" }}
          >
            {formatTime(day.sunriseIso)}
          </div>
        </div>
        <div className="text-center">
          <div className="label-caps mb-1">Sunset</div>
          <ScoreBadge score={day.sunsetScore} size="sm" />
          <div
            className="text-[0.65rem] mt-0.5"
            style={{ color: "var(--text-muted)" }}
          >
            {formatTime(day.sunsetIso)}
          </div>
        </div>
      </div>
    </button>
  );
}
