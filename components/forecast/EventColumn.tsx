"use client";

import type { EventWeather } from "@/types";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { FactorBar } from "./FactorBar";
import {
  scoreCloudAlt,
  scoreVisibility,
  scorePrecip,
  scoreHumidity,
  scoreWind,
  scoreAerosol,
  scoreColor,
} from "@/lib/scoring";
import { formatTime, formatWind } from "@/lib/formatting";

interface EventColumnProps {
  label: "Sunrise" | "Sunset";
  iso: string;
  weather: EventWeather;
  score: number;
}

export function EventColumn({ label, iso, weather, score }: EventColumnProps) {
  const cloudScore = scoreCloudAlt(weather.cloudLow, weather.cloudMid, weather.cloudHigh);
  const visScore = scoreVisibility(weather.visibility / 1000);
  const precipScore = scorePrecip(weather.precip);
  const humScore = scoreHumidity(weather.humidity);
  const windScore = scoreWind(weather.wind);
  const accent = scoreColor(score);
  const emoji = label === "Sunrise" ? "🌅" : "🌇";

  return (
    <div
      className="rounded-2xl p-px"
      style={{
        background: `linear-gradient(145deg, ${accent}28 0%, rgba(255,255,255,0.04) 50%, transparent 100%)`,
      }}
    >
      <div
        className="rounded-[calc(1rem-1px)] p-4 space-y-4"
        style={{
          background: "var(--bg-elevated)",
          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.06), inset 0 -1px 1px rgba(0,0,0,0.2)",
        }}
      >
        {/* Header: label + ring */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-base font-bold flex items-center gap-1.5" style={{ color: "var(--text-primary)" }}>
              <span aria-hidden="true">{emoji}</span>
              <span>{label}</span>
            </div>
            <div className="text-xs tabular-nums mt-0.5" style={{ color: "var(--text-muted)" }}>
              {formatTime(iso)}
            </div>
          </div>
          <ScoreRing score={score} size="md" showLabel />
        </div>

        {/* Factor bars */}
        <div className="space-y-3">
          <FactorBar label="Clouds" value={cloudScore}
            rawLabel={`${weather.cloudLow}% low · ${weather.cloudHigh}% high`}
            color="var(--bar-cloud)" />
          <FactorBar label="Visibility" value={visScore}
            rawLabel={`${(weather.visibility / 1000).toFixed(0)} km`}
            color="var(--bar-vis)" />
          <FactorBar label="Precipitation" value={precipScore}
            rawLabel={`${weather.precip}%`}
            color="var(--bar-precip)" />
          <FactorBar label="Humidity" value={humScore}
            rawLabel={`${weather.humidity}%`}
            color="var(--bar-humidity)" />
          <FactorBar label="Wind" value={windScore}
            rawLabel={formatWind(weather.wind)}
            color="var(--bar-wind)" />
          {weather.aod !== null && (
            <FactorBar label="Aerosol" value={scoreAerosol(weather.aod)}
              rawLabel={`AOD ${weather.aod.toFixed(2)}`}
              color="var(--bar-aerosol)" />
          )}
        </div>

        {/* Temp / gusts */}
        <div
          className="rounded-xl p-px"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 100%)",
          }}
        >
          <div className="grid grid-cols-2 gap-px">
            {[
              { label: "Temp", value: `${Math.round(weather.temp)}°C` },
              { label: "Gusts", value: formatWind(weather.gusts) },
            ].map(({ label: l, value }) => (
              <div
                key={l}
                className="rounded-[calc(0.75rem-1px)] p-2.5 text-center"
                style={{ background: "var(--bg-surface)", boxShadow: "inset 0 1px 1px rgba(255,255,255,0.04)" }}
              >
                <div className="label-caps">{l}</div>
                <div className="text-sm font-bold mt-0.5 tabular-nums" style={{ color: "var(--text-primary)" }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
