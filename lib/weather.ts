import type { DayData, EventWeather } from "@/types";
import { overallScore, isPostStorm, pressureTrendBonus } from "./scoring";

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";
const ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive";

function closestHourIndex(times: string[], target: string): number {
  const t = new Date(target).getTime();
  return times.reduce((best, ts, i) => {
    const diff = Math.abs(new Date(ts).getTime() - t);
    return diff < Math.abs(new Date(times[best]).getTime() - t) ? i : best;
  }, 0);
}

export interface ForecastResult {
  days: DayData[];
  modelElevM: number;
}

export async function fetchForecast(
  lat: number,
  lng: number,
  startDate: string
): Promise<ForecastResult> {
  const endDate = new Date(
    new Date(startDate).getTime() + 6 * 86400000
  )
    .toISOString()
    .slice(0, 10);

  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    hourly: [
      "cloudcover_low",
      "cloudcover_mid",
      "cloudcover_high",
      "cloudcover",
      "windspeed_10m",
      "windgusts_10m",
      "temperature_2m",
      "visibility",
      "precipitation_probability",
      "precipitation",
      "relativehumidity_2m",
      "cape",
      "freezinglevel_height",
      "surface_pressure",
    ].join(","),
    daily: "sunrise,sunset",
    timezone: "auto",
    start_date: startDate,
    end_date: endDate,
  });

  const [wxRes, aqRes] = await Promise.all([
    fetch(`${FORECAST_URL}?${params}`),
    fetchAirQuality(lat, lng, startDate, endDate).catch(() => null),
  ]);

  if (!wxRes.ok) throw new Error("Weather forecast request failed");
  const wx = await wxRes.json();

  const h = wx.hourly;
  const d = wx.daily;
  const times: string[] = h.time;
  const modelElevM: number = wx.elevation ?? 0;

  const days: DayData[] = d.time.map((dateStr: string, dayIdx: number) => {
    const sunriseIso: string = d.sunrise[dayIdx];
    const sunsetIso: string = d.sunset[dayIdx];

    const srIdx = closestHourIndex(times, sunriseIso);
    const ssIdx = closestHourIndex(times, sunsetIso);

    const srPressBonus = pressureTrendBonus(h.surface_pressure, srIdx);
    const ssPressBonus = pressureTrendBonus(h.surface_pressure, ssIdx);

    const srAod = aqRes?.hourly?.aerosol_optical_depth?.[srIdx] ?? null;
    const ssAod = aqRes?.hourly?.aerosol_optical_depth?.[ssIdx] ?? null;

    const srScore = overallScore({
      cloudLow: h.cloudcover_low[srIdx],
      cloudMid: h.cloudcover_mid[srIdx],
      cloudHigh: h.cloudcover_high[srIdx],
      visibilityM: h.visibility[srIdx],
      precipPct: h.precipitation_probability[srIdx],
      humidity: h.relativehumidity_2m[srIdx],
      windKmh: h.windspeed_10m[srIdx],
      aod: srAod,
      pressureBonus: srPressBonus,
    });

    const ssScore = overallScore({
      cloudLow: h.cloudcover_low[ssIdx],
      cloudMid: h.cloudcover_mid[ssIdx],
      cloudHigh: h.cloudcover_high[ssIdx],
      visibilityM: h.visibility[ssIdx],
      precipPct: h.precipitation_probability[ssIdx],
      humidity: h.relativehumidity_2m[ssIdx],
      windKmh: h.windspeed_10m[ssIdx],
      aod: ssAod,
      pressureBonus: ssPressBonus,
    });

    // Max afternoon CAPE (12:00–18:00 local)
    const dayHours = times
      .map((t, i) => ({ t, i }))
      .filter(({ t }) => t.startsWith(dateStr));
    const afternoonIndices = dayHours
      .filter(({ t }) => {
        const hour = new Date(t).getHours();
        return hour >= 12 && hour <= 18;
      })
      .map(({ i }) => i);
    const maxAfternoonCape =
      afternoonIndices.length > 0
        ? Math.max(...afternoonIndices.map((i) => h.cape[i] ?? 0))
        : 0;

    const buildEvent = (idx: number, aod: number | null): EventWeather => ({
      cloudLow: h.cloudcover_low[idx],
      cloudMid: h.cloudcover_mid[idx],
      cloudHigh: h.cloudcover_high[idx],
      cloud: h.cloudcover[idx],
      wind: h.windspeed_10m[idx],
      gusts: h.windgusts_10m[idx],
      temp: h.temperature_2m[idx],
      visibility: h.visibility[idx],
      precip: h.precipitation_probability[idx],
      rain: h.precipitation[idx],
      humidity: h.relativehumidity_2m[idx],
      cape: h.cape[idx],
      freezeLevel: h.freezinglevel_height[idx],
      pressure: h.surface_pressure[idx],
      aod,
    });

    return {
      dateStr,
      sunriseIso,
      sunsetIso,
      sunrise: buildEvent(srIdx, srAod),
      sunset: buildEvent(ssIdx, ssAod),
      sunriseScore: srScore,
      sunsetScore: ssScore,
      srPressChange: h.surface_pressure[srIdx] - h.surface_pressure[Math.max(0, srIdx - 6)],
      ssPressChange: h.surface_pressure[ssIdx] - h.surface_pressure[Math.max(0, ssIdx - 6)],
      postStormSr: isPostStorm(h.precipitation, srIdx),
      postStormSs: isPostStorm(h.precipitation, ssIdx),
      maxAfternoonCape,
    };
  });

  return { days, modelElevM };
}

async function fetchAirQuality(
  lat: number,
  lng: number,
  startDate: string,
  endDate: string
) {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    hourly: "aerosol_optical_depth,dust,pm10",
    timezone: "auto",
    start_date: startDate,
    end_date: endDate,
  });

  const res = await fetch(`${AIR_QUALITY_URL}?${params}`);
  if (!res.ok) throw new Error("Air quality request failed");
  return res.json();
}

export interface MonthlyArchive {
  month: number; // 0-11
  avgCloud: number;
  avgPrecipMm: number;
}

export async function fetchHistoricalArchive(
  lat: number,
  lng: number
): Promise<MonthlyArchive[]> {
  const today = new Date();
  const endDate = today.toISOString().slice(0, 10);
  const startDate = new Date(today.getTime() - 730 * 86400000)
    .toISOString()
    .slice(0, 10);

  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    daily: "cloudcover_mean,precipitation_sum",
    timezone: "auto",
    start_date: startDate,
    end_date: endDate,
  });

  const res = await fetch(`${ARCHIVE_URL}?${params}`);
  if (!res.ok) throw new Error("Archive request failed");
  const data = await res.json();

  // Group by month
  const monthBuckets: { cloud: number[]; precip: number[] }[] = Array.from(
    { length: 12 },
    () => ({ cloud: [], precip: [] })
  );

  (data.daily.time as string[]).forEach((dateStr: string, i: number) => {
    const month = new Date(dateStr + "T00:00:00").getMonth();
    const cloud = data.daily.cloudcover_mean[i];
    const precip = data.daily.precipitation_sum[i];
    if (cloud != null) monthBuckets[month].cloud.push(cloud);
    if (precip != null) monthBuckets[month].precip.push(precip);
  });

  return monthBuckets.map((bucket, month) => ({
    month,
    avgCloud:
      bucket.cloud.length > 0
        ? bucket.cloud.reduce((a, b) => a + b, 0) / bucket.cloud.length
        : 50,
    avgPrecipMm:
      bucket.precip.length > 0
        ? bucket.precip.reduce((a, b) => a + b, 0) / bucket.precip.length
        : 2,
  }));
}
