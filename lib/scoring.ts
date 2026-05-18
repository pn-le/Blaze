import type { LightningRisk, LightningLevel } from "@/types";

export function scoreCloudAlt(low: number, mid: number, high: number): number {
  let base = 65;

  if (high >= 10 && high <= 50) base = 98;
  else if (high > 50 && high <= 70) base = 84;
  else if (high > 70) base = 62;

  if (mid >= 15 && mid <= 45) base = Math.max(base, 80);
  else if (mid > 60) base *= 0.88;

  if (low > 70) base *= 0.3;
  else if (low > 50) base *= 0.52;
  else if (low > 30) base *= 0.72;
  else if (low > 15) base *= 0.88;

  return Math.round(Math.min(100, Math.max(5, base)));
}

export function scoreVisibility(km: number): number {
  if (km >= 30) return 100;
  if (km >= 20) return 90;
  if (km >= 10) return 75;
  if (km >= 5) return 52;
  if (km >= 2) return 28;
  return 10;
}

export function scorePrecip(pct: number): number {
  if (pct <= 5) return 100;
  if (pct <= 15) return 87;
  if (pct <= 30) return 68;
  if (pct <= 45) return 46;
  if (pct <= 65) return 22;
  if (pct <= 80) return 10;
  return 4;
}

export function scoreHumidity(pct: number): number {
  if (pct < 20) return 70;
  if (pct <= 50) return 100;
  if (pct <= 68) return 84;
  if (pct <= 80) return 65;
  if (pct <= 90) return 48;
  return 32;
}

export function scoreWind(kmh: number): number {
  if (kmh >= 8 && kmh <= 28) return 92;
  if (kmh < 8) return 68;
  if (kmh <= 45) return 76;
  if (kmh <= 65) return 50;
  return 28;
}

export function scoreAerosol(aod: number): number {
  if (aod <= 0.05) return 82;
  if (aod <= 0.15) return 100;
  if (aod <= 0.3) return 90;
  if (aod <= 0.5) return 65;
  if (aod <= 0.8) return 35;
  return 14;
}

export function pressureTrendBonus(
  pressures: number[],
  eventIdx: number
): number {
  const current = pressures[eventIdx];
  const past = pressures[Math.max(0, eventIdx - 6)];
  const change = current - past;

  if (change > 3) return 8;
  if (change > 1) return 4;
  if (change > -1) return 0;
  if (change > -3) return -4;
  return -8;
}

export function overallScore(params: {
  cloudLow: number;
  cloudMid: number;
  cloudHigh: number;
  visibilityM: number;
  precipPct: number;
  humidity: number;
  windKmh: number;
  aod: number | null;
  pressureBonus: number;
}): number {
  const c = scoreCloudAlt(params.cloudLow, params.cloudMid, params.cloudHigh);
  const v = scoreVisibility(params.visibilityM / 1000);
  const p = scorePrecip(params.precipPct);
  const h = scoreHumidity(params.humidity);
  const w = scoreWind(params.windKmh);

  let base: number;

  if (params.aod !== null) {
    const a = scoreAerosol(params.aod);
    base = Math.round(0.32 * c + 0.19 * v + 0.18 * p + 0.12 * w + 0.08 * h + 0.11 * a);
  } else {
    base = Math.round(0.36 * c + 0.22 * v + 0.2 * p + 0.13 * w + 0.09 * h);
  }

  return Math.min(100, Math.max(0, base + params.pressureBonus));
}

export function isPostStorm(
  precipitation: number[],
  eventIdx: number
): boolean {
  const lookbackHours = 6;
  const start = Math.max(0, eventIdx - lookbackHours);
  const hadRain = precipitation.slice(start, eventIdx).some((mm) => mm > 0.1);
  const clearNow = precipitation[eventIdx] < 0.1;
  return hadRain && clearNow;
}

export function lightningRisk(maxAfternoonCape: number): LightningRisk {
  if (maxAfternoonCape < 200)
    return {
      level: 0 as LightningLevel,
      label: "Minimal",
      color: "#22c55e",
      desc: "Atmosphere stable. Low storm risk on exposed terrain.",
    };
  if (maxAfternoonCape < 600)
    return {
      level: 1 as LightningLevel,
      label: "Low",
      color: "#84cc16",
      desc: "Some instability. Watch afternoon buildups on exposed ridges.",
    };
  if (maxAfternoonCape < 1200)
    return {
      level: 2 as LightningLevel,
      label: "Moderate",
      color: "#eab308",
      desc: "Moderate instability. Be off exposed ridges by early afternoon.",
    };
  if (maxAfternoonCape < 2500)
    return {
      level: 3 as LightningLevel,
      label: "High",
      color: "#f97316",
      desc: "Significant storm risk. Avoid summits and exposed terrain.",
    };
  return {
    level: 4 as LightningLevel,
    label: "Extreme",
    color: "#ef4444",
    desc: "Dangerous. Do not summit exposed peaks today.",
  };
}

export function scoreColor(score: number): string {
  if (score >= 82) return "#f59e0b";
  if (score >= 68) return "#22c55e";
  if (score >= 54) return "#84cc16";
  if (score >= 40) return "#eab308";
  if (score >= 25) return "#f97316";
  return "#ef4444";
}

export function scoreLabel(
  score: number
): { label: string; emoji: string } {
  if (score >= 82) return { label: "Spectacular", emoji: "🔥" };
  if (score >= 68) return { label: "Excellent", emoji: "✨" };
  if (score >= 54) return { label: "Good", emoji: "👍" };
  if (score >= 40) return { label: "Fair", emoji: "🤔" };
  if (score >= 25) return { label: "Poor", emoji: "😐" };
  return { label: "Skip it", emoji: "❌" };
}

export function monthlyScore(
  avgCloud: number,
  avgPrecipMm: number
): number {
  const c = scoreCloudAlt(
    avgCloud * 0.25,
    avgCloud * 0.35,
    avgCloud * 0.4
  );
  const p = scorePrecip(Math.min(100, avgPrecipMm * 25));
  return Math.round(0.55 * c + 0.45 * p);
}
