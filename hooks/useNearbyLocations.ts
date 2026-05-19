"use client";

import { useQuery } from "@tanstack/react-query";

export interface NearbyLocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type: "peak" | "viewpoint";
  elevM?: number;
  wikipedia?: string;
  distanceKm: number;
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function fetchNearby(lat: number, lng: number): Promise<NearbyLocation[]> {
  const query = `[out:json][timeout:15];(node["natural"="peak"](around:80000,${lat},${lng});node["tourism"="viewpoint"](around:80000,${lat},${lng}););out body 40;`;
  const res = await fetch(
    `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
  );
  if (!res.ok) throw new Error("Could not load nearby locations");
  const data = await res.json();

  const seen = new Set<string>();
  const results: NearbyLocation[] = [];

  for (const el of data.elements) {
    const name: string | undefined = el.tags?.name;
    if (!name) continue;
    const key = name.toLowerCase().replace(/\s/g, "");
    if (seen.has(key)) continue;
    seen.add(key);

    results.push({
      id: el.id,
      name,
      lat: el.lat,
      lng: el.lon,
      type: el.tags?.natural === "peak" ? "peak" : "viewpoint",
      elevM: el.tags?.ele ? parseFloat(el.tags.ele) : undefined,
      wikipedia: el.tags?.wikipedia,
      distanceKm: haversine(lat, lng, el.lat, el.lon),
    });
  }

  return results
    .sort((a, b) => {
      if (a.elevM && b.elevM) return b.elevM - a.elevM;
      if (a.elevM) return -1;
      if (b.elevM) return 1;
      return a.distanceKm - b.distanceKm;
    })
    .slice(0, 5);
}

export function useNearbyLocations(lat: number | null, lng: number | null) {
  return useQuery({
    queryKey: ["nearby", lat?.toFixed(3), lng?.toFixed(3)],
    queryFn: () => fetchNearby(lat!, lng!),
    enabled: lat !== null && lng !== null,
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });
}
