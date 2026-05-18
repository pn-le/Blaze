import type { GeoResult } from "@/types";

const NOMINATIM = "https://nominatim.openstreetmap.org";

export async function geocode(query: string): Promise<GeoResult> {
  const url = new URL(`${NOMINATIM}/search`);
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  const res = await fetch(url.toString(), {
    headers: { "Accept-Language": "en" },
  });

  if (!res.ok) throw new Error("Geocoding request failed");

  const data = await res.json();
  if (!data || data.length === 0) {
    throw new Error(`Could not find "${query}". Try a different peak or city name.`);
  }

  const item = data[0];
  const parts = (item.display_name as string).split(", ");
  const displayName = parts.slice(0, 2).join(", ");

  return {
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
    displayName,
  };
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string> {
  const url = new URL(`${NOMINATIM}/reverse`);
  url.searchParams.set("lat", lat.toString());
  url.searchParams.set("lon", lng.toString());
  url.searchParams.set("format", "json");

  const res = await fetch(url.toString(), {
    headers: { "Accept-Language": "en" },
  });

  if (!res.ok) throw new Error("Reverse geocoding failed");

  const data = await res.json();
  const parts = (data.display_name as string).split(", ");
  return parts.slice(0, 2).join(", ");
}

export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 10000,
    });
  });
}
