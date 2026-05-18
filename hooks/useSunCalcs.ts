"use client";

import { useMemo } from "react";
import {
  goldenHourDuration,
  blueHourWindow,
  sunAzimuth,
  moonPhase,
} from "@/lib/astronomy";

export function useSunCalcs(
  lat: number | null,
  lng: number | null,
  dateStr: string | null
) {
  return useMemo(() => {
    if (!lat || !lng || !dateStr) return null;
    return {
      goldenHour: goldenHourDuration(lat, lng, dateStr),
      blueHour: blueHourWindow(lat, lng, dateStr),
      azimuth: sunAzimuth(lat, dateStr),
      moon: moonPhase(dateStr),
    };
  }, [lat, lng, dateStr]);
}
