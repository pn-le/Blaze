import { describe, it, expect } from "vitest";
import {
  scoreCloudAlt,
  overallScore,
  lightningRisk,
  isPostStorm,
} from "@/lib/scoring";
import { moonPhase, goldenHourDuration } from "@/lib/astronomy";

describe("scoreCloudAlt", () => {
  it("ideal high clouds → 98", () => {
    expect(scoreCloudAlt(0, 0, 20)).toBe(98);
  });
  it("heavy low clouds → ≤ 20", () => {
    expect(scoreCloudAlt(80, 0, 0)).toBeLessThanOrEqual(20);
  });
  it("moderate mid clouds → ≥ 75", () => {
    expect(scoreCloudAlt(0, 30, 0)).toBeGreaterThanOrEqual(75);
  });
});

describe("overallScore", () => {
  it("perfect conditions → ≥ 85", () => {
    const score = overallScore({
      cloudLow: 0,
      cloudMid: 0,
      cloudHigh: 25,
      visibilityM: 50000,
      precipPct: 0,
      humidity: 40,
      windKmh: 15,
      aod: 0.1,
      pressureBonus: 8,
    });
    expect(score).toBeGreaterThanOrEqual(85);
  });

  it("all bad conditions → ≤ 20", () => {
    const score = overallScore({
      cloudLow: 90,
      cloudMid: 80,
      cloudHigh: 90,
      visibilityM: 500,
      precipPct: 90,
      humidity: 95,
      windKmh: 80,
      aod: 0.9,
      pressureBonus: -8,
    });
    expect(score).toBeLessThanOrEqual(20);
  });
});

describe("moonPhase", () => {
  it("2000-01-07 → New Moon (new moon was Jan 6 at 18:14 UTC)", () => {
    const result = moonPhase("2000-01-07");
    expect(result.name).toBe("New Moon");
  });

  it("2000-01-20 → ~Full Moon", () => {
    const result = moonPhase("2000-01-20");
    expect(["Full Moon", "Waxing Gibbous"]).toContain(result.name);
    expect(result.illum).toBeGreaterThan(70);
  });
});

describe("lightningRisk", () => {
  it("cape=0 → Minimal", () => {
    expect(lightningRisk(0).label).toBe("Minimal");
  });
  it("cape=3000 → Extreme", () => {
    expect(lightningRisk(3000).label).toBe("Extreme");
  });
  it("cape=1000 → Moderate", () => {
    expect(lightningRisk(1000).label).toBe("Moderate");
  });
});

describe("isPostStorm", () => {
  it("rain then clear → true", () => {
    const precip = [0, 0, 0.5, 1.2, 0.3, 0, 0];
    expect(isPostStorm(precip, 6)).toBe(true);
  });
  it("no rain → false", () => {
    const precip = [0, 0, 0, 0, 0, 0, 0];
    expect(isPostStorm(precip, 6)).toBe(false);
  });
  it("still raining → false", () => {
    const precip = [0, 0.5, 1.2, 0.8, 0.5, 0.3, 0.2];
    expect(isPostStorm(precip, 6)).toBe(false);
  });
});

describe("goldenHourDuration", () => {
  it("higher latitude has longer golden hour in summer", () => {
    const low = goldenHourDuration(35, -112, "2024-06-21");
    const high = goldenHourDuration(60, -112, "2024-06-21");
    expect(high.sunrise).toBeGreaterThan(low.sunrise);
  });
});
