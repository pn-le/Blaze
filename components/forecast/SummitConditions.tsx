"use client";

import type { EventWeather } from "@/types";
import { tempAtElevation, windAtElevation } from "@/lib/elevation";
import { formatTemp, formatElevation, formatWind } from "@/lib/formatting";
import { Mountain, Thermometer, Wind, AlertTriangle } from "lucide-react";

interface SummitConditionsProps {
  sunriseWeather: EventWeather;
  sunsetWeather: EventWeather;
  modelElevM: number;
  summitElevM: number;
  elevUnit: "ft" | "m";
}

export function SummitConditions({
  sunriseWeather,
  sunsetWeather,
  modelElevM,
  summitElevM,
  elevUnit,
}: SummitConditionsProps) {
  const srTemp = tempAtElevation(sunriseWeather.temp, modelElevM, summitElevM);
  const ssTemp = tempAtElevation(sunsetWeather.temp, modelElevM, summitElevM);
  const srWind = windAtElevation(sunriseWeather.wind, modelElevM, summitElevM);
  const ssWind = windAtElevation(sunsetWeather.wind, modelElevM, summitElevM);
  const freezeLevel =
    sunriseWeather.freezeLevel > 0
      ? sunriseWeather.freezeLevel
      : sunsetWeather.freezeLevel;
  const aboveFreezing = summitElevM > freezeLevel;

  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
    >
      <div className="flex items-center gap-2">
        <Mountain size={14} style={{ color: "var(--bar-vis)" }} />
        <span className="label-caps">Summit Conditions</span>
        <span className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>
          {formatElevation(summitElevM, elevUnit)}
        </span>
      </div>

      {aboveFreezing && (
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold"
          style={{ background: "#ef444422", color: "#ef4444", border: "1px solid #ef444444" }}
        >
          <AlertTriangle size={12} />
          Summit is above the freezing level ({formatElevation(freezeLevel, elevUnit)}).
          Ice/snow likely.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-lg p-3 space-y-2"
          style={{ background: "var(--bg-surface)" }}
        >
          <div className="label-caps text-center">At Sunrise</div>
          <div className="flex items-center gap-1.5">
            <Thermometer size={12} style={{ color: "#60a5fa" }} />
            <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              {formatTemp(srTemp)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wind size={12} style={{ color: "#a78bfa" }} />
            <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              {formatWind(srWind)}
            </span>
          </div>
        </div>

        <div
          className="rounded-lg p-3 space-y-2"
          style={{ background: "var(--bg-surface)" }}
        >
          <div className="label-caps text-center">At Sunset</div>
          <div className="flex items-center gap-1.5">
            <Thermometer size={12} style={{ color: "#60a5fa" }} />
            <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              {formatTemp(ssTemp)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wind size={12} style={{ color: "#a78bfa" }} />
            <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              {formatWind(ssWind)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between text-xs pt-1">
        <span style={{ color: "var(--text-muted)" }}>Freezing Level</span>
        <span className="font-bold" style={{ color: "var(--text-primary)" }}>
          {formatElevation(freezeLevel, elevUnit)}
        </span>
      </div>
    </div>
  );
}
