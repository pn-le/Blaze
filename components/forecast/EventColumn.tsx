"use client";

import type { EventWeather } from "@/types";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { FactorBar } from "./FactorBar";
import {
  scoreCloudAlt,
  scoreVisibility,
  scorePrecip,
  scoreHumidity,
  scoreWind,
  scoreAerosol,
} from "@/lib/scoring";
import { formatTime, formatWind } from "@/lib/formatting";

interface EventColumnProps {
  label: "Sunrise" | "Sunset";
  iso: string;
  weather: EventWeather;
  score: number;
}

export function EventColumn({ label, iso, weather, score }: EventColumnProps) {
  const cloudScore = scoreCloudAlt(
    weather.cloudLow,
    weather.cloudMid,
    weather.cloudHigh
  );
  const visScore = scoreVisibility(weather.visibility / 1000);
  const precipScore = scorePrecip(weather.precip);
  const humScore = scoreHumidity(weather.humidity);
  const windScore = scoreWind(weather.wind);

  const emoji = label === "Sunrise" ? "🌅" : "🌇";

  return (
    <div
      className="rounded-xl p-4 space-y-4"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
            {emoji} {label}
          </div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>
            {formatTime(iso)}
          </div>
        </div>
        <ScoreBadge score={score} size="md" showLabel={true} />
      </div>

      <div className="space-y-3">
        <FactorBar
          label="Clouds"
          value={cloudScore}
          rawLabel={`${weather.cloudLow}% low / ${weather.cloudHigh}% high`}
          color="var(--bar-cloud)"
        />
        <FactorBar
          label="Visibility"
          value={visScore}
          rawLabel={`${(weather.visibility / 1000).toFixed(0)} km`}
          color="var(--bar-vis)"
        />
        <FactorBar
          label="Precipitation"
          value={precipScore}
          rawLabel={`${weather.precip}%`}
          color="var(--bar-precip)"
        />
        <FactorBar
          label="Humidity"
          value={humScore}
          rawLabel={`${weather.humidity}%`}
          color="var(--bar-humidity)"
        />
        <FactorBar
          label="Wind"
          value={windScore}
          rawLabel={formatWind(weather.wind)}
          color="var(--bar-wind)"
        />
        {weather.aod !== null && (
          <FactorBar
            label="Aerosol"
            value={scoreAerosol(weather.aod)}
            rawLabel={`AOD ${weather.aod.toFixed(2)}`}
            color="var(--bar-aerosol)"
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <div
          className="rounded-lg p-2 text-center"
          style={{ background: "var(--bg-surface)" }}
        >
          <div className="label-caps">Temp</div>
          <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
            {Math.round(weather.temp)}°C
          </div>
        </div>
        <div
          className="rounded-lg p-2 text-center"
          style={{ background: "var(--bg-surface)" }}
        >
          <div className="label-caps">Gusts</div>
          <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
            {formatWind(weather.gusts)}
          </div>
        </div>
      </div>
    </div>
  );
}
