"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { fetchHistoricalArchive } from "@/lib/weather";
import { monthlyScore, scoreColor } from "@/lib/scoring";
import { MONTH_ABBREVS } from "@/lib/formatting";
import { BarChart2 } from "lucide-react";

interface BestMonthsProps {
  lat: number;
  lng: number;
}

export function BestMonths({ lat, lng }: BestMonthsProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ month: string; score: number }[] | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (data) { setOpen(true); return; }
    setOpen(true);
    setLoading(true);
    setError(null);
    try {
      const archive = await fetchHistoricalArchive(lat, lng);
      const chartData = archive.map((a) => ({
        month: MONTH_ABBREVS[a.month],
        score: monthlyScore(a.avgCloud, a.avgPrecipMm),
      }));
      setData(chartData);
    } catch {
      setError("Could not load historical data.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="rounded-xl overflow-hidden border"
      style={{ borderColor: "var(--border-subtle)" }}
    >
      <button
        type="button"
        onClick={open ? () => setOpen(false) : load}
        className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-white/5"
        style={{ background: "var(--bg-elevated)" }}
      >
        <div className="flex items-center gap-2">
          <BarChart2 size={14} style={{ color: "var(--text-secondary)" }} />
          <span className="label-caps">Best Months</span>
        </div>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {open ? "Hide" : "Load historical data"}
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-2" style={{ background: "var(--bg-elevated)" }}>
          {loading && (
            <div className="h-32 flex items-center justify-center text-xs" style={{ color: "var(--text-muted)" }}>
              Loading 2 years of data...
            </div>
          )}
          {error && (
            <p className="text-xs py-4 text-center" style={{ color: "#ef4444" }}>
              {error}
            </p>
          )}
          {data && (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: -20 }}>
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "var(--text-primary)",
                  }}
                  formatter={(val) => [`${val}/100`, "Score"]}
                />
                <Bar dataKey="score" radius={[3, 3, 0, 0]}>
                  {data.map((entry) => (
                    <Cell key={entry.month} fill={scoreColor(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
          {data && (
            <p className="text-[0.65rem] mt-2 text-center" style={{ color: "var(--text-muted)" }}>
              Based on 2 years of historical cloud cover and precipitation data
            </p>
          )}
        </div>
      )}
    </div>
  );
}
