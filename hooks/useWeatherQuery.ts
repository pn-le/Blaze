"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchForecast, type ForecastResult } from "@/lib/weather";

export function useWeatherQuery(
  lat: number | null,
  lng: number | null,
  startDate: string | null
) {
  return useQuery<ForecastResult>({
    queryKey: ["forecast", lat, lng, startDate],
    queryFn: () => fetchForecast(lat!, lng!, startDate!),
    enabled: lat != null && lng != null && startDate != null,
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 1,
  });
}
