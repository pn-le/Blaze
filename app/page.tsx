"use client";

import { useState, useEffect } from "react";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { SearchPanel } from "@/components/layout/SearchPanel";
import { DayGrid } from "@/components/forecast/DayGrid";
import { DetailPanel } from "@/components/forecast/DetailPanel";
import { useWeatherQuery } from "@/hooks/useWeatherQuery";
import { useSavedTrails } from "@/hooks/useSavedTrails";
import { useHashParams, buildShareUrl } from "@/hooks/useShareUrl";
import type { SearchState, DayData } from "@/types";
import { scoreLabel } from "@/lib/scoring";
import { Mountain, Star, Share2, AlertCircle } from "lucide-react";
import { NearbyPanel } from "@/components/layout/NearbyPanel";

const SCORE_LEGEND = [
  { label: "Spectacular", color: "#f59e0b", emoji: "🔥" },
  { label: "Excellent", color: "#22c55e", emoji: "✨" },
  { label: "Good", color: "#84cc16", emoji: "👍" },
  { label: "Fair", color: "#eab308", emoji: "🤔" },
  { label: "Poor", color: "#f97316", emoji: "😐" },
  { label: "Skip it", color: "#ef4444", emoji: "❌" },
];

function BlazeApp() {
  const [search, setSearch] = useState<SearchState | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [initLocation, setInitLocation] = useState<string | undefined>();
  const [initDate, setInitDate] = useState<string | undefined>();
  const [initElev, setInitElev] = useState<string | undefined>();
  const [initUnit, setInitUnit] = useState<"ft" | "m" | undefined>();

  const { trails, save: saveTrail, remove: removeTrail } = useSavedTrails();

  const { data, isLoading, isError, error } = useWeatherQuery(
    search?.lat ?? null,
    search?.lng ?? null,
    search?.startDate ?? null
  );

  // Sync modelElevM from API response
  useEffect(() => {
    if (data?.modelElevM != null) {
      setSearch((prev) =>
        prev ? { ...prev, modelElevM: data.modelElevM } : prev
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.modelElevM]);

  // Parse URL hash on mount
  useHashParams((params) => {
    setInitLocation(params.name);
    setInitDate(params.date);
    setInitElev(params.elev);
    setInitUnit(params.unit as "ft" | "m" | undefined);
    const elevM = params.elev
      ? parseFloat(params.elev) * (params.unit === "m" ? 1 : 0.3048)
      : 0;
    setSearch({
      lat: params.lat,
      lng: params.lng,
      locationName: params.name,
      startDate: params.date,
      modelElevM: 0,
      summitElevM: elevM,
      elevUnit: (params.unit as "ft" | "m") ?? "ft",
    });
  });

  function handleSearch(state: SearchState) {
    setSearch(state);
    setSelectedDay(0);
  }

  function handleSaveTrail() {
    if (!search) return;
    saveTrail({
      name: search.locationName,
      lat: search.lat,
      lng: search.lng,
      elevValue:
        search.summitElevM > 0
          ? (search.elevUnit === "ft"
              ? Math.round(search.summitElevM / 0.3048)
              : Math.round(search.summitElevM)
            ).toString()
          : undefined,
      elevUnit: search.elevUnit,
    });
  }

  function handleShare() {
    if (!search) return;
    const elevVal =
      search.summitElevM > 0
        ? (search.elevUnit === "ft"
            ? Math.round(search.summitElevM / 0.3048)
            : Math.round(search.summitElevM)
          ).toString()
        : undefined;
    const url = buildShareUrl({
      lat: search.lat,
      lng: search.lng,
      name: search.locationName,
      date: search.startDate,
      elev: elevVal,
      unit: elevVal ? search.elevUnit : undefined,
    });
    navigator.clipboard.writeText(url).then(() => {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    });
  }

  const days: DayData[] = data?.days ?? [];
  const bestScore =
    days.length > 0
      ? Math.max(...days.flatMap((d) => [d.sunriseScore, d.sunsetScore]))
      : 0;
  const bestDay = days.find(
    (d) => d.sunriseScore === bestScore || d.sunsetScore === bestScore
  );

  const summitDisplay =
    search && search.summitElevM > 0
      ? search.elevUnit === "ft"
        ? `${Math.round(search.summitElevM / 0.3048).toLocaleString()} ft`
        : `${Math.round(search.summitElevM).toLocaleString()} m`
      : null;

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: "var(--bg-base)" }}>
      {/* Ambient aurora when results are loaded */}
      {days.length > 0 && (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
          <div
            className="aurora-orb absolute rounded-full"
            style={{
              width: "50vw",
              height: "40vh",
              top: "5%",
              left: "-5%",
              background: "radial-gradient(ellipse, rgba(251,146,60,0.06) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            className="aurora-orb absolute rounded-full"
            style={{
              width: "40vw",
              height: "35vh",
              top: "40%",
              right: "-5%",
              background: "radial-gradient(ellipse, rgba(232,121,249,0.05) 0%, transparent 70%)",
              filter: "blur(80px)",
              animationDelay: "-5s",
            }}
          />
          <div
            className="aurora-orb absolute rounded-full"
            style={{
              width: "35vw",
              height: "30vh",
              bottom: "10%",
              left: "30%",
              background: "radial-gradient(ellipse, rgba(96,165,250,0.04) 0%, transparent 70%)",
              filter: "blur(70px)",
              animationDelay: "-9s",
            }}
          />
        </div>
      )}

      <Header />

      <SearchPanel
        onSearch={handleSearch}
        trails={trails}
        onRemoveTrail={removeTrail}
        defaultDate={initDate}
        defaultLocation={initLocation}
        defaultElev={initElev}
        defaultElevUnit={initUnit}
      />

      <main className="relative max-w-6xl mx-auto px-4 py-6" style={{ zIndex: 1 }}>
        <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0">
        {/* Empty state */}
        {!search && !isLoading && (
          <div className="relative flex flex-col items-center justify-center py-24 text-center overflow-hidden">
            {/* Aurora radial glow */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse 60% 50% at 50% 80%, rgba(251,146,60,0.10) 0%, rgba(245,158,11,0.06) 40%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <Mountain
              size={52}
              className="mb-5 relative"
              style={{ color: "var(--border-active)" }}
            />
            <h2
              className="text-2xl font-black mb-2 relative"
              style={{ color: "var(--text-primary)" }}
            >
              Is the summit worth it?
            </h2>
            <p
              className="text-sm max-w-sm relative"
              style={{ color: "var(--text-muted)" }}
            >
              Search any trail, peak, or city to get a 7-day sunrise and sunset
              quality forecast — with a full explanation of why.
            </p>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="space-y-4">
            <div className="skeleton h-7 w-40" />
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              }}
            >
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="skeleton h-32 rounded-xl" />
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div
            className="flex items-start gap-3 rounded-xl px-4 py-3"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
            }}
          >
            <AlertCircle
              size={16}
              style={{ color: "#ef4444", flexShrink: 0, marginTop: 2 }}
            />
            <div>
              <p className="text-sm font-bold" style={{ color: "#ef4444" }}>
                Could not load forecast
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--text-secondary)" }}
              >
                {error instanceof Error ? error.message : "Please try again."}
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {!isLoading && days.length > 0 && search && (
          <div className="space-y-4">
            {/* Location header + actions */}
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2
                  className="text-2xl font-black tracking-tight leading-none"
                  style={{ color: "var(--text-primary)" }}
                >
                  {search.locationName}
                </h2>
                <p className="text-xs mt-1.5 font-medium" style={{ color: "var(--text-muted)" }}>
                  7-day forecast · starts {search.startDate}
                  {summitDisplay ? ` · ${summitDisplay} summit` : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveTrail}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-all hover:bg-white/5 cursor-pointer"
                  style={{
                    color: "var(--text-secondary)",
                    borderColor: "var(--border-default)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <Star size={12} />
                  Save Trail
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-all hover:bg-white/5 cursor-pointer"
                  style={{
                    color: shareSuccess ? "#22c55e" : "var(--text-secondary)",
                    borderColor: shareSuccess ? "rgba(34,197,94,0.4)" : "var(--border-default)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <Share2 size={12} />
                  {shareSuccess ? "Copied!" : "Share"}
                </button>
              </div>
            </div>

            {/* Best window banner */}
            {bestScore >= 54 && bestDay && (
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-2.5"
                style={{
                  background: "rgba(251,146,60,0.08)",
                  border: "1px solid rgba(251,146,60,0.2)",
                }}
              >
                <span className="text-sm">🏔️</span>
                <p
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span
                    className="font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Best window:
                  </span>{" "}
                  {bestDay.dateStr} scores {bestScore}/100 —{" "}
                  {scoreLabel(bestScore).label.toLowerCase()}
                </p>
              </div>
            )}

            {/* Score legend */}
            <div className="flex flex-wrap gap-3">
              {SCORE_LEGEND.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-1 text-[0.65rem] font-semibold"
                  style={{ color: item.color }}
                >
                  {item.emoji} {item.label}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <DayGrid
              days={days}
              selectedIndex={selectedDay}
              onSelect={setSelectedDay}
            />

            {/* Detail panel */}
            {days[selectedDay] && (
              <DetailPanel day={days[selectedDay]} search={search} />
            )}
          </div>
        )}
        </div>
          {search && (
            <NearbyPanel
              lat={search.lat}
              lng={search.lng}
              startDate={search.startDate}
              onSearch={handleSearch}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Providers>
      <BlazeApp />
    </Providers>
  );
}
