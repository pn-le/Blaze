"use client";

import { useState, useRef } from "react";
import { MapPin, Search, Navigation } from "lucide-react";
import { geocode, getCurrentPosition, reverseGeocode } from "@/lib/geo";
import type { SearchState } from "@/types";
import { MyTrails } from "./MyTrails";
import type { SavedTrail } from "@/types";

interface SearchPanelProps {
  onSearch: (state: SearchState) => void;
  trails: SavedTrail[];
  onRemoveTrail: (lat: number, lng: number) => void;
  defaultDate?: string;
  defaultLocation?: string;
  defaultElev?: string;
  defaultElevUnit?: "ft" | "m";
}

export function SearchPanel({
  onSearch,
  trails,
  onRemoveTrail,
  defaultDate,
  defaultLocation = "",
  defaultElev = "",
  defaultElevUnit = "ft",
}: SearchPanelProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [location, setLocation] = useState(defaultLocation);
  const [date, setDate] = useState(defaultDate ?? today);
  const [elev, setElev] = useState(defaultElev);
  const [elevUnit, setElevUnit] = useState<"ft" | "m">(defaultElevUnit);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!location.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const result = await geocode(location.trim());
      let summitElevM = 0;
      if (elev) {
        const elevNum = parseFloat(elev);
        summitElevM = elevUnit === "ft" ? elevNum * 0.3048 : elevNum;
      }
      onSearch({
        lat: result.lat,
        lng: result.lng,
        locationName: result.displayName,
        startDate: date,
        modelElevM: 0,
        summitElevM,
        elevUnit,
      });
      setLocation(result.displayName);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGeolocate() {
    setGeoLoading(true);
    setError(null);
    try {
      const pos = await getCurrentPosition();
      const { latitude: lat, longitude: lng } = pos.coords;
      const name = await reverseGeocode(lat, lng);
      setLocation(name);
      let summitElevM = 0;
      if (elev) {
        const elevNum = parseFloat(elev);
        summitElevM = elevUnit === "ft" ? elevNum * 0.3048 : elevNum;
      }
      onSearch({
        lat,
        lng,
        locationName: name,
        startDate: date,
        modelElevM: 0,
        summitElevM,
        elevUnit,
      });
    } catch {
      setError("Could not get your location. Check browser permissions.");
    } finally {
      setGeoLoading(false);
    }
  }

  function handleTrailSelect(trail: SavedTrail) {
    setLocation(trail.name);
    if (trail.elevValue) setElev(trail.elevValue);
    if (trail.elevUnit) setElevUnit(trail.elevUnit);
    let summitElevM = 0;
    if (trail.elevValue) {
      const elevNum = parseFloat(trail.elevValue);
      summitElevM =
        (trail.elevUnit ?? "ft") === "ft" ? elevNum * 0.3048 : elevNum;
    }
    onSearch({
      lat: trail.lat,
      lng: trail.lng,
      locationName: trail.name,
      startDate: date,
      modelElevM: 0,
      summitElevM,
      elevUnit: trail.elevUnit ?? "ft",
    });
  }

  return (
    <div
      className="sticky top-[57px] z-40 glass"
      style={{
        borderBottom: "1px solid rgba(45,63,87,0.4)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-3.5">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          {/* Location input */}
          <div className="relative flex-1">
            <MapPin
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              ref={inputRef}
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Trail name, peak, or city..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none border transition-all"
              style={{
                background: "var(--bg-input)",
                color: "var(--text-primary)",
                borderColor: "var(--border-default)",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--border-active)";
                e.target.style.boxShadow = "inset 0 1px 3px rgba(0,0,0,0.2), 0 0 0 3px rgba(249,115,22,0.12)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border-default)";
                e.target.style.boxShadow = "inset 0 1px 3px rgba(0,0,0,0.2)";
              }}
            />
          </div>

          {/* Date */}
          <input
            type="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2.5 rounded-xl text-sm outline-none border transition-colors"
            style={{
              background: "var(--bg-input)",
              color: "var(--text-primary)",
              borderColor: "var(--border-default)",
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)",
            }}
          />

          {/* Elevation */}
          <div
            className="flex rounded-xl overflow-hidden border"
            style={{
              borderColor: "var(--border-default)",
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)",
            }}
          >
            <input
              type="number"
              value={elev}
              onChange={(e) => setElev(e.target.value)}
              placeholder="Summit elev."
              className="w-28 px-3 py-2.5 text-sm outline-none"
              style={{
                background: "var(--bg-input)",
                color: "var(--text-primary)",
              }}
            />
            <button
              type="button"
              onClick={() => setElevUnit(elevUnit === "ft" ? "m" : "ft")}
              className="px-2.5 text-xs font-bold border-l cursor-pointer transition-colors hover:bg-white/5"
              style={{
                background: "var(--bg-input)",
                color: "var(--text-secondary)",
                borderColor: "var(--border-default)",
              }}
            >
              {elevUnit}
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleGeolocate}
              disabled={geoLoading}
              aria-label="Use my location"
              className="p-2.5 rounded-xl border transition-all disabled:opacity-50 cursor-pointer hover:bg-white/5"
              style={{
                background: "var(--bg-input)",
                borderColor: "var(--border-default)",
                color: "var(--text-secondary)",
              }}
            >
              <Navigation size={16} />
            </button>

            <button
              type="submit"
              disabled={loading || !location.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)",
                color: "#fff",
                boxShadow: "0 2px 12px rgba(249,115,22,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 4px 20px rgba(249,115,22,0.5), inset 0 1px 0 rgba(255,255,255,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 2px 12px rgba(249,115,22,0.35), inset 0 1px 0 rgba(255,255,255,0.15)";
              }}
            >
              <Search size={14} />
              {loading ? "Searching..." : "Forecast"}
            </button>
          </div>
        </form>

        {error && (
          <p className="mt-2 text-xs" style={{ color: "#ef4444" }}>
            {error}
          </p>
        )}

        {trails.length > 0 && (
          <MyTrails
            trails={trails}
            onSelect={handleTrailSelect}
            onRemove={onRemoveTrail}
          />
        )}
      </div>
    </div>
  );
}
