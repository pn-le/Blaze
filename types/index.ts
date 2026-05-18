export interface EventWeather {
  cloudLow: number;
  cloudMid: number;
  cloudHigh: number;
  cloud: number;
  wind: number;
  gusts: number;
  temp: number;
  visibility: number; // meters
  precip: number; // probability %
  rain: number; // mm actual
  humidity: number;
  cape: number;
  freezeLevel: number; // meters
  pressure: number; // hPa
  aod: number | null; // aerosol optical depth
}

export interface DayData {
  dateStr: string; // 'YYYY-MM-DD'
  sunriseIso: string;
  sunsetIso: string;
  sunrise: EventWeather;
  sunset: EventWeather;
  sunriseScore: number; // 0-100
  sunsetScore: number;
  srPressChange: number; // hPa over 6h
  ssPressChange: number;
  postStormSr: boolean;
  postStormSs: boolean;
  maxAfternoonCape: number;
}

export interface SearchState {
  lat: number;
  lng: number;
  locationName: string;
  startDate: string;
  modelElevM: number;
  summitElevM: number;
  elevUnit: "ft" | "m";
}

export interface SavedTrail {
  name: string;
  lat: number;
  lng: number;
  elevValue?: string;
  elevUnit?: "ft" | "m";
  savedAt: number;
}

export type ScoreLabel =
  | "Spectacular"
  | "Excellent"
  | "Good"
  | "Fair"
  | "Poor"
  | "Skip it";

export type LightningLevel = 0 | 1 | 2 | 3 | 4;

export interface LightningRisk {
  level: LightningLevel;
  label: string;
  desc: string;
  color: string;
}

export interface SunTimes {
  rise: number; // minutes from midnight
  set: number;
}

export interface GoldenHourDuration {
  sunrise: number; // minutes
  sunset: number;
}

export interface BlueHourWindow {
  dawnStart: number;
  dawnEnd: number;
  duskStart: number;
  duskEnd: number;
  dawnDuration: number;
  duskDuration: number;
}

export interface SunAzimuth {
  rise: number; // degrees
  set: number;
}

export interface MoonPhaseResult {
  pct: number;
  phase: number;
  name: string;
  emoji: string;
  illum: number;
  daysToFull: number;
}

export interface MonthlyStats {
  month: number; // 0-11
  avgCloud: number;
  avgPrecipMm: number;
  score: number;
}

export interface GeoResult {
  lat: number;
  lng: number;
  displayName: string;
}
