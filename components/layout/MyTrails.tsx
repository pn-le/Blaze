"use client";

import type { SavedTrail } from "@/types";
import { X, MapPin } from "lucide-react";

interface MyTrailsProps {
  trails: SavedTrail[];
  onSelect: (trail: SavedTrail) => void;
  onRemove: (lat: number, lng: number) => void;
}

export function MyTrails({ trails, onSelect, onRemove }: MyTrailsProps) {
  if (trails.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {trails.map((trail) => (
        <div
          key={`${trail.lat},${trail.lng}`}
          className="flex items-center gap-1 rounded-full border pl-2 pr-1 py-0.5 text-xs cursor-pointer transition-colors"
          style={{
            borderColor: "var(--border-default)",
            background: "var(--bg-elevated)",
            color: "var(--text-secondary)",
          }}
        >
          <MapPin size={10} />
          <button
            type="button"
            onClick={() => onSelect(trail)}
            className="hover:text-text-primary transition-colors"
          >
            {trail.name}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(trail.lat, trail.lng);
            }}
            aria-label={`Remove ${trail.name}`}
            className="p-0.5 rounded-full hover:bg-white/10 transition-colors ml-0.5"
            style={{ color: "var(--text-muted)" }}
          >
            <X size={10} />
          </button>
        </div>
      ))}
    </div>
  );
}
