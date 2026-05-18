"use client";

import { useState } from "react";
import { leaveByTime, formatTime } from "@/lib/formatting";
import { Calendar, Clock } from "lucide-react";
import { exportIcs } from "@/lib/ics";
import type { DayData } from "@/types";

interface TimingSectionProps {
  day: DayData;
  locationName: string;
}

export function TimingSection({ day, locationName }: TimingSectionProps) {
  const [distance, setDistance] = useState("5");
  const [pace, setPace] = useState<"easy" | "moderate" | "fast">("moderate");

  const paceMap = { easy: 1.5, moderate: 2.0, fast: 2.5 };
  const paceLabels = { easy: "1.5 mph", moderate: "2.0 mph", fast: "2.5 mph" };

  const dist = parseFloat(distance) || 5;
  const paceVal = paceMap[pace];

  const srLeave = leaveByTime(day.sunriseIso, dist, paceVal);
  const ssLeave = leaveByTime(day.sunsetIso, dist, paceVal);

  return (
    <div
      className="rounded-xl p-4 space-y-4"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={14} style={{ color: "var(--text-secondary)" }} />
          <span className="label-caps">Leave-By Calculator</span>
        </div>
        <button
          type="button"
          onClick={() => exportIcs(day, locationName)}
          className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-lg border transition-colors hover:bg-white/5"
          style={{
            color: "var(--text-secondary)",
            borderColor: "var(--border-default)",
          }}
        >
          <Calendar size={12} />
          Export .ics
        </button>
      </div>

      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="label-caps block mb-1">Distance (miles)</label>
          <input
            type="number"
            min="0.5"
            max="50"
            step="0.5"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg text-sm border outline-none"
            style={{
              background: "var(--bg-input)",
              color: "var(--text-primary)",
              borderColor: "var(--border-default)",
            }}
          />
        </div>
        <div>
          <label className="label-caps block mb-1">Pace</label>
          <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: "var(--border-default)" }}>
            {(["easy", "moderate", "fast"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPace(p)}
                className="px-2 py-1.5 text-xs font-semibold capitalize transition-colors"
                style={{
                  background:
                    pace === p ? "var(--border-active)" : "var(--bg-input)",
                  color:
                    pace === p ? "#fff" : "var(--text-secondary)",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className="rounded-lg px-4 py-3 space-y-1.5"
        style={{ background: "var(--bg-surface)" }}
      >
        <div className="flex justify-between text-sm">
          <span style={{ color: "var(--text-muted)" }}>Leave for sunrise</span>
          <span className="font-bold" style={{ color: "var(--text-primary)" }}>
            {srLeave.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span style={{ color: "var(--text-muted)" }}>Leave for sunset</span>
          <span className="font-bold" style={{ color: "var(--text-primary)" }}>
            {ssLeave.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
          </span>
        </div>
        <div
          className="text-xs pt-1"
          style={{ color: "var(--text-faint)", borderTop: "1px solid var(--border-subtle)" }}
        >
          {dist} miles at {paceLabels[pace]} + 20 min buffer
        </div>
      </div>
    </div>
  );
}
