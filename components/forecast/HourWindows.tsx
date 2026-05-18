"use client";

import type { GoldenHourDuration, BlueHourWindow } from "@/types";
import { formatMinutes } from "@/lib/formatting";
import { Sun, Moon } from "lucide-react";

interface HourWindowsProps {
  goldenHour: GoldenHourDuration;
  blueHour: BlueHourWindow | null;
}

export function HourWindows({ goldenHour, blueHour }: HourWindowsProps) {
  return (
    <div
      className="rounded-xl p-4 grid grid-cols-2 gap-4"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
    >
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Sun size={12} style={{ color: "#f59e0b" }} />
          <span className="label-caps">Golden Hour</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span style={{ color: "var(--text-muted)" }}>Sunrise</span>
            <span className="font-bold" style={{ color: "var(--text-primary)" }}>
              {formatMinutes(goldenHour.sunrise)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span style={{ color: "var(--text-muted)" }}>Sunset</span>
            <span className="font-bold" style={{ color: "var(--text-primary)" }}>
              {formatMinutes(goldenHour.sunset)}
            </span>
          </div>
        </div>
      </div>

      {blueHour && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Moon size={12} style={{ color: "#60a5fa" }} />
            <span className="label-caps">Blue Hour</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span style={{ color: "var(--text-muted)" }}>Dawn</span>
              <span className="font-bold" style={{ color: "var(--text-primary)" }}>
                {formatMinutes(blueHour.dawnDuration)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: "var(--text-muted)" }}>Dusk</span>
              <span className="font-bold" style={{ color: "var(--text-primary)" }}>
                {formatMinutes(blueHour.duskDuration)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
