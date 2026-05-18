"use client";

import { compassDirection } from "@/lib/astronomy";

interface CompassRoseProps {
  riseDeg: number;
  setDeg: number;
}

export function CompassRose({ riseDeg, setDeg }: CompassRoseProps) {
  return (
    <div className="flex gap-6 justify-center">
      <div className="flex flex-col items-center gap-2">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          aria-label={`Sun rises at ${riseDeg}° ${compassDirection(riseDeg)}`}
        >
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="#2d3f57"
            strokeWidth="1.5"
          />
          {["N", "E", "S", "W"].map((dir, i) => {
            const angle = i * 90;
            const rad = (angle - 90) * (Math.PI / 180);
            const x = 40 + 28 * Math.cos(rad);
            const y = 40 + 28 * Math.sin(rad);
            return (
              <text
                key={dir}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#64748b"
                fontSize="9"
                fontWeight="700"
              >
                {dir}
              </text>
            );
          })}
          {/* Rise arrow */}
          <g
            transform={`rotate(${riseDeg}, 40, 40)`}
            aria-label={`Sunrise direction ${riseDeg}°`}
          >
            <line
              x1="40"
              y1="40"
              x2="40"
              y2="14"
              stroke="#fb923c"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <polygon points="40,8 36,16 44,16" fill="#fb923c" />
          </g>
        </svg>
        <div className="text-center">
          <div className="label-caps">Sunrise</div>
          <div className="text-text-primary text-sm font-bold">
            {riseDeg}° {compassDirection(riseDeg)}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          aria-label={`Sun sets at ${setDeg}° ${compassDirection(setDeg)}`}
        >
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="#2d3f57"
            strokeWidth="1.5"
          />
          {["N", "E", "S", "W"].map((dir, i) => {
            const angle = i * 90;
            const rad = (angle - 90) * (Math.PI / 180);
            const x = 40 + 28 * Math.cos(rad);
            const y = 40 + 28 * Math.sin(rad);
            return (
              <text
                key={dir}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#64748b"
                fontSize="9"
                fontWeight="700"
              >
                {dir}
              </text>
            );
          })}
          {/* Set arrow */}
          <g transform={`rotate(${setDeg}, 40, 40)`}>
            <line
              x1="40"
              y1="40"
              x2="40"
              y2="14"
              stroke="#a78bfa"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <polygon points="40,8 36,16 44,16" fill="#a78bfa" />
          </g>
        </svg>
        <div className="text-center">
          <div className="label-caps">Sunset</div>
          <div className="text-text-primary text-sm font-bold">
            {setDeg}° {compassDirection(setDeg)}
          </div>
        </div>
      </div>
    </div>
  );
}
