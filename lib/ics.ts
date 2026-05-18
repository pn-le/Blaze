import type { DayData } from "@/types";
import { formatTime } from "./formatting";

function fmt(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
}

function offset(iso: string, minutes: number): string {
  return new Date(new Date(iso).getTime() + minutes * 60000).toISOString();
}

export function exportIcs(day: DayData, locationName: string): void {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Blaze//GoldenHour//EN",
    "BEGIN:VEVENT",
    `DTSTART:${fmt(offset(day.sunriseIso, -30))}`,
    `DTEND:${fmt(offset(day.sunriseIso, +60))}`,
    `SUMMARY:Sunrise — ${locationName} (${day.sunriseScore}/100)`,
    `DESCRIPTION:Blaze quality: ${day.sunriseScore}/100 at ${formatTime(day.sunriseIso)}`,
    "END:VEVENT",
    "BEGIN:VEVENT",
    `DTSTART:${fmt(offset(day.sunsetIso, -60))}`,
    `DTEND:${fmt(offset(day.sunsetIso, +30))}`,
    `SUMMARY:Sunset — ${locationName} (${day.sunsetScore}/100)`,
    `DESCRIPTION:Blaze quality: ${day.sunsetScore}/100 at ${formatTime(day.sunsetIso)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(blob),
    download: `blaze-${locationName.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.ics`,
  });
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
