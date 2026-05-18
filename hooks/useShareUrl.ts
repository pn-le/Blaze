"use client";

import { useEffect } from "react";

export interface ShareParams {
  lat: number;
  lng: number;
  name: string;
  date: string;
  elev?: string;
  unit?: string;
}

export function buildShareUrl(params: ShareParams): string {
  const p = new URLSearchParams({
    lat: params.lat.toFixed(4),
    lng: params.lng.toFixed(4),
    name: params.name,
    date: params.date,
    ...(params.elev ? { elev: params.elev, unit: params.unit ?? "ft" } : {}),
  });
  return `${window.location.href.split("#")[0]}#${p.toString()}`;
}

export function parseShareHash(): ShareParams | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.slice(1);
  if (!hash) return null;
  try {
    const p = new URLSearchParams(hash);
    const lat = parseFloat(p.get("lat") ?? "");
    const lng = parseFloat(p.get("lng") ?? "");
    const name = p.get("name");
    const date = p.get("date");
    if (isNaN(lat) || isNaN(lng) || !name || !date) return null;
    return {
      lat,
      lng,
      name,
      date,
      elev: p.get("elev") ?? undefined,
      unit: p.get("unit") ?? undefined,
    };
  } catch {
    return null;
  }
}

export function useHashParams(
  onParsed: (params: ShareParams) => void
) {
  useEffect(() => {
    const params = parseShareHash();
    if (params) onParsed(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
