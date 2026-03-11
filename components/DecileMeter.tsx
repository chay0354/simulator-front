"use client";

import { motion } from "framer-motion";

interface DecileMeterProps {
  decile: number;
  compact?: boolean;
}

const labels: Record<number, string> = {
  1: "עשירון 1",
  2: "עשירון 2",
  3: "עשירון 3",
  4: "עשירון 4",
  5: "עשירון 5",
  6: "עשירון 6",
  7: "עשירון 7",
  8: "עשירון 8",
  9: "עשירון 9",
  10: "עשירון 10",
};

// Semicircle: 0° = left (decile 1), 180° = right (decile 10). We draw from right to left in RTL.
const MIN_ANGLE = 0;   // decile 1 (right side in RTL)
const MAX_ANGLE = 180; // decile 10 (left side in RTL)
const angleForDecile = (d: number) => MIN_ANGLE + ((d - 1) / 9) * (MAX_ANGLE - MIN_ANGLE);

const size = 200;
const strokeWidth = 12;
const radius = (size - strokeWidth) / 2 - 8;
const center = size / 2;

// SVG arc from angle A to angle B (degrees, 0 = right, 180 = left for semicircle top)
function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = polarToCartesian(cx, cy, r, startDeg);
  const end = polarToCartesian(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}
function polarToCartesian(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 180) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function DecileMeter({ decile, compact }: DecileMeterProps) {
  const angle = angleForDecile(decile);
  const arcEnd = angle; // arc from 0 to angle (decile 1 to current decile)

  return (
    <div className={`mt-4 flex flex-col items-center ${compact ? "scale-90 origin-center" : ""}`}>
      <div
        className="relative rounded-b-full overflow-visible"
        style={{
          width: size,
          height: size / 2 + 24,
        }}
      >
        {/* Bezel / outer ring */}
        <svg
          width={size}
          height={size / 2 + 24}
          viewBox={`0 0 ${size} ${size / 2 + 24}`}
          className="drop-shadow-lg"
        >
          <defs>
            <linearGradient id="gauge-track" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="40%" stopColor="#a78bfa" />
              <stop offset="70%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
            <linearGradient id="gauge-glow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
            </linearGradient>
            <filter id="needle-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.8" />
            </filter>
            <filter id="inner-glow">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Background arc track (full semicircle) */}
          <path
            d={describeArc(center, center, radius, 0, 180)}
            fill="none"
            stroke="rgba(30,41,59,0.9)"
            strokeWidth={strokeWidth + 4}
            strokeLinecap="round"
          />
          <path
            d={describeArc(center, center, radius, 0, 180)}
            fill="none"
            stroke="url(#gauge-track)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            opacity={0.9}
          />
          {/* Filled arc from 0 to current decile */}
          <motion.path
            d={describeArc(center, center, radius, 0, 180)}
            fill="none"
            stroke="url(#gauge-track)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={radius * Math.PI}
            initial={{ strokeDashoffset: radius * Math.PI }}
            animate={{ strokeDashoffset: radius * Math.PI * (1 - decile / 10) }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ transform: "rotate(0deg)", transformOrigin: `${center}px ${center}px` }}
          />
          {/* Tick marks */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => {
            const a = angleForDecile(d);
            const rad = ((a - 180) * Math.PI) / 180;
            const innerR = radius - strokeWidth / 2 - 6;
            const outerR = radius + strokeWidth / 2 + 2;
            const x1 = center + innerR * Math.cos(rad);
            const y1 = center + innerR * Math.sin(rad);
            const x2 = center + outerR * Math.cos(rad);
            const y2 = center + outerR * Math.sin(rad);
            const isMajor = d === 1 || d === 5 || d === 10;
            return (
              <line
                key={d}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(248,250,252,0.5)"
                strokeWidth={isMajor ? 2.5 : 1.5}
                strokeLinecap="round"
              />
            );
          })}
          {/* Numbers along the arc */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => {
            const a = angleForDecile(d);
            const rad = ((a - 180) * Math.PI) / 180;
            const labelR = radius - strokeWidth - 18;
            const x = center + labelR * Math.cos(rad);
            const y = center + labelR * Math.sin(rad);
            return (
              <text
                key={d}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-slate-300 text-[10px] font-bold tabular-nums"
                style={{ fontFamily: "var(--font-heebo), system-ui, sans-serif" }}
              >
                {d}
              </text>
            );
          })}
          {/* Red zone (decile 9-10) like a tach */}
          <path
            d={describeArc(center, center, radius, 162, 180)}
            fill="none"
            stroke="rgba(239,68,68,0.5)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Needle */}
          <g filter="url(#needle-shadow)">
            <motion.line
              x1={center}
              y1={center}
              x2={
                center +
                (radius - strokeWidth - 10) * Math.cos(((angle - 180) * Math.PI) / 180)
              }
              y2={
                center +
                (radius - strokeWidth - 10) * Math.sin(((angle - 180) * Math.PI) / 180)
              }
              stroke="url(#needle-gradient)"
              strokeWidth={3}
              strokeLinecap="round"
            />
          </g>
          <defs>
            <linearGradient id="needle-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#f8fafc" />
            </linearGradient>
          </defs>
          {/* Center cap */}
          <circle
            cx={center}
            cy={center}
            r={10}
            fill="rgba(30,41,59,0.95)"
            stroke="rgba(148,163,184,0.5)"
            strokeWidth={1.5}
          />
          <circle cx={center} cy={center} r={6} fill="rgba(248,250,252,0.2)" />
        </svg>
      </div>
      {!compact && (
        <p className="text-center text-transparent bg-clip-text bg-gradient-to-l from-violet-200 to-fuchsia-200 font-semibold mt-1 text-sm tracking-wide">
          {labels[decile]}
        </p>
      )}
    </div>
  );
}
