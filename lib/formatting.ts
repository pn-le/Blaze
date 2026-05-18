export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatDateLong(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTemp(c: number, unit: "C" | "F" = "F"): string {
  if (unit === "F") return `${Math.round((c * 9) / 5 + 32)}°F`;
  return `${Math.round(c)}°C`;
}

export function formatElevation(m: number, unit: "ft" | "m"): string {
  if (unit === "ft") return `${Math.round(m / 0.3048).toLocaleString()} ft`;
  return `${Math.round(m).toLocaleString()} m`;
}

export function formatWind(kmh: number): string {
  return `${Math.round(kmh)} km/h`;
}

export function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function leaveByTime(
  eventIso: string,
  distanceMiles: number,
  paceMph: number
): Date {
  const bufferMinutes = 20;
  const hikeMinutes = (distanceMiles / paceMph) * 60 + bufferMinutes;
  return new Date(new Date(eventIso).getTime() - hikeMinutes * 60000);
}

export const MONTH_ABBREVS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];
