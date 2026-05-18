"use client";

import type { DayData } from "@/types";
import { DayCard } from "./DayCard";

interface DayGridProps {
  days: DayData[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function DayGrid({ days, selectedIndex, onSelect }: DayGridProps) {
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
      {days.map((day, i) => (
        <DayCard
          key={day.dateStr}
          day={day}
          selected={i === selectedIndex}
          onClick={() => onSelect(i)}
        />
      ))}
    </div>
  );
}
