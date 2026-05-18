"use client";

import type { DayData, SearchState } from "@/types";
import { EventColumn } from "./EventColumn";
import { LightningMeter } from "./LightningMeter";
import { HourWindows } from "./HourWindows";
import { MoonCard } from "./MoonCard";
import { TimingSection } from "./TimingSection";
import { SummitConditions } from "./SummitConditions";
import { BestMonths } from "./BestMonths";
import { CompassRose } from "@/components/ui/CompassRose";
import { useSunCalcs } from "@/hooks/useSunCalcs";
import { formatDateLong } from "@/lib/formatting";
import { CloudRain } from "lucide-react";

interface DetailPanelProps {
  day: DayData;
  search: SearchState;
}

export function DetailPanel({ day, search }: DetailPanelProps) {
  const sunCalcs = useSunCalcs(search.lat, search.lng, day.dateStr);
  const showPostStorm = day.postStormSr || day.postStormSs;

  return (
    <div className="space-y-4 mt-4">
      {/* Date heading */}
      <h2 className="text-lg font-black" style={{ color: "var(--text-primary)" }}>
        {formatDateLong(day.dateStr)}
      </h2>

      {/* Post-storm banner */}
      {showPostStorm && (
        <div
          className="flex items-start gap-3 rounded-xl px-4 py-3"
          style={{
            background: "rgba(96,165,250,0.1)",
            border: "1px solid rgba(96,165,250,0.3)",
          }}
        >
          <CloudRain size={16} style={{ color: "#60a5fa", flexShrink: 0, marginTop: 2 }} />
          <div>
            <p className="text-sm font-bold" style={{ color: "#60a5fa" }}>
              Post-storm clearing detected
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
              Recent rain has scrubbed the air clean. Elevated chance of vivid
              colors.
            </p>
          </div>
        </div>
      )}

      {/* Sunrise / Sunset columns */}
      <div className="grid sm:grid-cols-2 gap-4">
        <EventColumn
          label="Sunrise"
          iso={day.sunriseIso}
          weather={day.sunrise}
          score={day.sunriseScore}
        />
        <EventColumn
          label="Sunset"
          iso={day.sunsetIso}
          weather={day.sunset}
          score={day.sunsetScore}
        />
      </div>

      {/* Summit conditions */}
      {search.summitElevM > 0 && (
        <SummitConditions
          sunriseWeather={day.sunrise}
          sunsetWeather={day.sunset}
          modelElevM={search.modelElevM}
          summitElevM={search.summitElevM}
          elevUnit={search.elevUnit}
        />
      )}

      {/* Lightning risk */}
      <LightningMeter maxAfternoonCape={day.maxAfternoonCape} />

      {/* Golden / blue hour */}
      {sunCalcs && (
        <HourWindows
          goldenHour={sunCalcs.goldenHour}
          blueHour={sunCalcs.blueHour}
        />
      )}

      {/* Moon */}
      {sunCalcs && <MoonCard moon={sunCalcs.moon} />}

      {/* Timing + leave-by */}
      <TimingSection day={day} locationName={search.locationName} />

      {/* Sun direction */}
      {sunCalcs && (
        <div
          className="rounded-xl p-4"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
        >
          <div className="label-caps mb-3 text-center">Sun Direction</div>
          <CompassRose
            riseDeg={sunCalcs.azimuth.rise}
            setDeg={sunCalcs.azimuth.set}
          />
        </div>
      )}

      {/* Hiker tips */}
      <div
        className="rounded-xl p-4 space-y-2"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
      >
        <div className="label-caps">Hiker Tips</div>
        <ul className="space-y-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
          <li>• Start early — the best light often lasts only 10–15 minutes around the horizon.</li>
          <li>• Check summit conditions the morning of your hike. Weather can change overnight.</li>
          <li>• High, scattered cirrus clouds produce the most vivid reds and oranges.</li>
          <li>• Post-storm days often produce the best skies — air is scrubbed clean.</li>
          <li>• Be off exposed ridges before afternoon thunderstorm development (12–3 PM in summer).</li>
        </ul>
      </div>

      {/* Best months */}
      <BestMonths lat={search.lat} lng={search.lng} />
    </div>
  );
}
