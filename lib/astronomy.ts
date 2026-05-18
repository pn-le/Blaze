import type {
  SunTimes,
  GoldenHourDuration,
  BlueHourWindow,
  SunAzimuth,
  MoonPhaseResult,
} from "@/types";

function getDayOfYear(dateStr: string): number {
  const date = new Date(dateStr + "T12:00:00Z");
  const start = new Date(date.getFullYear() + "-01-01T00:00:00Z");
  return (
    Math.floor((date.getTime() - start.getTime()) / 86400000) + 1
  );
}

export function sunTimes(
  lat: number,
  lng: number,
  dateStr: string,
  elevationDeg: number
): SunTimes | null {
  const doy = getDayOfYear(dateStr);
  const B = (2 * Math.PI) / 365 * (doy - 81);
  const dec = (23.45 * Math.PI) / 180 * Math.sin(B);
  const EqT =
    9.87 * Math.sin(2 * B) -
    7.53 * Math.cos(B) -
    1.5 * Math.sin(B);
  const solarNoon = 720 - 4 * lng - EqT;

  const latR = (lat * Math.PI) / 180;
  const sinAlt = Math.sin((elevationDeg * Math.PI) / 180);
  const cosH =
    (sinAlt - Math.sin(latR) * Math.sin(dec)) /
    (Math.cos(latR) * Math.cos(dec));

  if (Math.abs(cosH) > 1) return null;

  const H = (Math.acos(cosH) * 180) / Math.PI;
  return { rise: solarNoon - 4 * H, set: solarNoon + 4 * H };
}

export function goldenHourDuration(
  lat: number,
  lng: number,
  dateStr: string
): GoldenHourDuration {
  const horizon = sunTimes(lat, lng, dateStr, -0.833);
  const golden = sunTimes(lat, lng, dateStr, 6);
  if (!horizon || !golden) return { sunrise: 0, sunset: 0 };
  return {
    sunrise: Math.round(golden.rise - horizon.rise),
    sunset: Math.round(horizon.set - golden.set),
  };
}

export function blueHourWindow(
  lat: number,
  lng: number,
  dateStr: string
): BlueHourWindow | null {
  const horizon = sunTimes(lat, lng, dateStr, -0.833);
  const civil = sunTimes(lat, lng, dateStr, -6);
  if (!horizon || !civil) return null;
  return {
    dawnStart: civil.rise,
    dawnEnd: horizon.rise,
    duskStart: horizon.set,
    duskEnd: civil.set,
    dawnDuration: Math.round(horizon.rise - civil.rise),
    duskDuration: Math.round(civil.set - horizon.set),
  };
}

export function sunAzimuth(lat: number, dateStr: string): SunAzimuth {
  const doy = getDayOfYear(dateStr);
  const B = (2 * Math.PI) / 365 * (doy - 81);
  const dec = (23.45 * Math.PI) / 180 * Math.sin(B);
  const cosAz = Math.sin(dec) / Math.cos((lat * Math.PI) / 180);
  const az = (Math.acos(Math.max(-1, Math.min(1, cosAz))) * 180) / Math.PI;
  return { rise: Math.round(az), set: Math.round(360 - az) };
}

export function compassDirection(deg: number): string {
  const dirs = [
    "N","NNE","NE","ENE","E","ESE","SE","SSE",
    "S","SSW","SW","WSW","W","WNW","NW","NNW",
  ];
  return dirs[Math.round(deg / 22.5) % 16];
}

export function moonPhase(dateStr: string): MoonPhaseResult {
  const date = new Date(dateStr + "T12:00:00Z");
  const knownNew = new Date("2000-01-06T18:14:00Z");
  const cycle = 29.53059;
  const days = (date.getTime() - knownNew.getTime()) / 86400000;
  const phase = ((days % cycle) + cycle) % cycle;
  const pct = phase / cycle;
  const illum = Math.round(((1 - Math.cos(pct * 2 * Math.PI)) / 2) * 100);
  const daysToFull = Math.round(((0.5 - pct + 1) % 1) * cycle);

  const phases = [
    { max: 0.033, name: "New Moon", emoji: "🌑" },
    { max: 0.25, name: "Waxing Crescent", emoji: "🌒" },
    { max: 0.283, name: "First Quarter", emoji: "🌓" },
    { max: 0.467, name: "Waxing Gibbous", emoji: "🌔" },
    { max: 0.533, name: "Full Moon", emoji: "🌕" },
    { max: 0.717, name: "Waning Gibbous", emoji: "🌖" },
    { max: 0.75, name: "Last Quarter", emoji: "🌗" },
    { max: 1.0, name: "Waning Crescent", emoji: "🌘" },
  ];

  const { name, emoji } =
    phases.find((p) => pct < p.max) ?? phases[7];
  return { pct, phase, name, emoji, illum, daysToFull };
}

/** Convert minutes-from-midnight to HH:MM format (local timezone via ISO) */
export function minutesToTime(minutesUtc: number, dateStr: string): string {
  const totalMs =
    new Date(dateStr + "T00:00:00Z").getTime() + minutesUtc * 60000;
  return new Date(totalMs).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
