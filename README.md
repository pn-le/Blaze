# Blaze

**Is the summit worth it?**

Blaze is a 7-day sunrise and sunset quality forecaster for hikers, trail runners, and peak baggers. Search any trail, mountain, or city and instantly get a scored forecast explaining exactly why the light will — or won't — be worth the climb.

---

## What it does

Blaze pulls hourly weather data and calculates a 0–100 quality score for every sunrise and sunset over the next 7 days. The score accounts for:

- **Cloud cover by altitude** — high wispy clouds scatter light beautifully; thick low clouds block it entirely
- **Visibility** — haze and fog dramatically reduce color saturation at the horizon
- **Precipitation probability** — rain chance at event time
- **Humidity** — affects atmospheric diffusion and color intensity
- **Wind speed** — a light breeze is ideal; high winds signal instability
- **Aerosol optical depth** — dust and smoke in the atmosphere
- **Barometric pressure trend** — rising pressure after a storm = golden light

Scores are labeled: **Spectacular / Excellent / Good / Fair / Poor / Skip it**

---

## Features

- 7-day grid of sunrise and sunset scores with color-coded rings
- Detailed breakdown panel showing each scoring factor with a visual bar
- Lightning risk assessment based on afternoon atmospheric instability (CAPE)
- Summit conditions — temperature, wind, and feels-like at elevation
- Best timing windows — optimal hour-by-hour window for the event
- Moon phase display
- Best months view for long-trip planning
- Save trails locally for quick re-access
- Share any forecast via URL (all state encoded in the hash)
- PWA — installable, works offline for cached data

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| Data fetching | TanStack Query v5 |
| Charts | Recharts |
| State | Zustand |
| Weather API | Open-Meteo (free, no API key needed) |
| Testing | Vitest |

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm test          # run unit tests
npm run build     # production build
```

No environment variables required — Blaze uses the free [Open-Meteo API](https://open-meteo.com) with no key.

---

## Project structure

```
app/               Next.js App Router pages
components/
  forecast/        DayGrid, DayCard, DetailPanel, scoring UI
  layout/          Header, SearchPanel, MyTrails
  ui/              ScoreRing, ScoreBadge, CompassRose
lib/               scoring, weather, astronomy, elevation, geo, ics
hooks/             useWeatherQuery, useSunCalcs, useSavedTrails, useShareUrl
types/             shared TypeScript types
tests/             Vitest unit tests
```
