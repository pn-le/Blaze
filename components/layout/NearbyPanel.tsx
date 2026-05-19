"use client";

import { useState, useEffect } from "react";
import { Mountain, Eye, MapPin } from "lucide-react";
import { useNearbyLocations } from "@/hooks/useNearbyLocations";
import type { NearbyLocation } from "@/hooks/useNearbyLocations";
import type { SearchState } from "@/types";

interface NearbyPanelProps {
  lat: number;
  lng: number;
  startDate: string;
  onSearch: (state: SearchState) => void;
}

function LocationCard({
  loc,
  onSelect,
}: {
  loc: NearbyLocation;
  onSelect: () => void;
}) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const title = loc.wikipedia
        ? loc.wikipedia.replace(/^[a-z]+:/, "").replace(/ /g, "_")
        : loc.name.replace(/ /g, "_");
      try {
        const res = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data.thumbnail?.source) setImgSrc(data.thumbnail.source);
      } catch {
        // gradient fallback
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [loc.wikipedia, loc.name]);

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group w-full text-left rounded-xl overflow-hidden border transition-all hover:border-orange-500/40 hover:scale-[1.01] active:scale-[0.99]"
      style={{ background: "var(--bg-card)", borderColor: "var(--border-default)" }}
    >
      {/* Image */}
      <div
        className="relative h-24 overflow-hidden"
        style={{
          background: imgSrc
            ? undefined
            : "linear-gradient(135deg, rgba(251,146,60,0.12) 0%, rgba(96,165,250,0.08) 60%, rgba(232,121,249,0.08) 100%)",
        }}
      >
        {imgSrc && (
          <img
            src={imgSrc}
            alt={loc.name}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgSrc(null)}
          />
        )}
        {/* Scrim */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)",
          }}
        />
        {/* Type badge */}
        <span
          className="absolute top-2 right-2 flex items-center gap-1 text-[0.58rem] font-bold px-1.5 py-0.5 rounded"
          style={{
            background: "rgba(0,0,0,0.45)",
            color: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(6px)",
          }}
        >
          {loc.type === "peak" ? <Mountain size={8} /> : <Eye size={8} />}
          {loc.type === "peak" ? "Peak" : "Viewpoint"}
        </span>
        {/* Placeholder icon when no image */}
        {!imgSrc && (
          <div className="absolute inset-0 flex items-center justify-center">
            {loc.type === "peak" ? (
              <Mountain size={28} style={{ color: "rgba(251,146,60,0.25)" }} />
            ) : (
              <Eye size={28} style={{ color: "rgba(96,165,250,0.25)" }} />
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-3 py-2">
        <p
          className="text-xs font-bold truncate"
          style={{ color: "var(--text-primary)" }}
        >
          {loc.name}
        </p>
        <div className="flex items-center justify-between mt-0.5">
          <div className="flex items-center gap-1">
            <MapPin size={9} style={{ color: "var(--text-muted)" }} />
            <span className="text-[0.6rem]" style={{ color: "var(--text-muted)" }}>
              {loc.distanceKm < 10
                ? loc.distanceKm.toFixed(1)
                : Math.round(loc.distanceKm)}{" "}
              km away
            </span>
          </div>
          {loc.elevM && (
            <span
              className="text-[0.6rem] font-semibold tabular-nums"
              style={{ color: "var(--text-secondary)" }}
            >
              {Math.round(loc.elevM / 0.3048).toLocaleString()} ft
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export function NearbyPanel({ lat, lng, startDate, onSearch }: NearbyPanelProps) {
  const { data: locations, isLoading, isError } = useNearbyLocations(lat, lng);

  function handleSelect(loc: NearbyLocation) {
    onSearch({
      lat: loc.lat,
      lng: loc.lng,
      locationName: loc.name,
      startDate,
      modelElevM: 0,
      summitElevM: loc.elevM ?? 0,
      elevUnit: "m",
    });
  }

  return (
    <aside className="w-60 shrink-0 hidden lg:block">
      <div className="sticky top-[120px]">
        <p
          className="text-[0.62rem] font-bold uppercase tracking-widest mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          Nearby viewpoints
        </p>

        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-28 rounded-xl" />
            ))}
          </div>
        )}

        {isError && (
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Could not load nearby locations.
          </p>
        )}

        {!isLoading && locations?.length === 0 && (
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            No viewpoints found nearby.
          </p>
        )}

        {!isLoading && locations && locations.length > 0 && (
          <div
            className="space-y-2.5 overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 160px)" }}
          >
            {locations.map((loc) => (
              <LocationCard key={loc.id} loc={loc} onSelect={() => handleSelect(loc)} />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
