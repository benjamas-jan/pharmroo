"use client";

import { useEffect, useState } from "react";
import { RISK_COLORS, type RiskLevel } from "@/lib/assessment";

function useCountUp(target: number, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

interface RiskGaugeProps {
  score: number;
  riskLevel: RiskLevel;
}

export function RiskGauge({ score, riskLevel }: RiskGaugeProps) {
  const norm = Math.max(0, Math.min(100, score));
  const animated = useCountUp(norm, 900);

  const cx = 130;
  const cy = 130;
  const r = 100;
  const startA = Math.PI * 0.85;
  const endA = Math.PI * 2.15;

  const polar = (a: number) => ({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  const arc = (from: number, to: number) => {
    const s = polar(from);
    const e = polar(to);
    const large = to - from > Math.PI ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  };

  const fillTo = startA + (endA - startA) * (animated / 100);
  const riskColor = RISK_COLORS[riskLevel];

  const bands: { from: number; to: number; color: string }[] = [
    { from: 0, to: 15, color: RISK_COLORS.low },
    { from: 15, to: 35, color: RISK_COLORS.moderate },
    { from: 35, to: 60, color: RISK_COLORS.high },
    { from: 60, to: 100, color: RISK_COLORS.very_high },
  ];

  const bandArc = (from: number, to: number) => {
    const a1 = startA + (endA - startA) * (from / 100);
    const a2 = startA + (endA - startA) * (to / 100);
    return arc(a1, a2);
  };

  const ticks: { v: number; color: string }[] = [
    { v: 15, color: RISK_COLORS.low },
    { v: 35, color: RISK_COLORS.moderate },
    { v: 60, color: RISK_COLORS.high },
  ];

  return (
    <div className="relative w-[260px] h-[200px] mx-auto">
      <svg width="260" height="200" viewBox="0 0 260 200">
        {bands.map((b, i) => (
          <path
            key={i}
            d={bandArc(b.from, b.to)}
            stroke={b.color}
            strokeOpacity="0.35"
            strokeWidth="14"
            fill="none"
            strokeLinecap="butt"
          />
        ))}
        {ticks.map(({ v, color }) => {
          const a = startA + (endA - startA) * (v / 100);
          const inner = { x: cx + (r - 16) * Math.cos(a), y: cy + (r - 16) * Math.sin(a) };
          const outer = { x: cx + (r + 16) * Math.cos(a), y: cy + (r + 16) * Math.sin(a) };
          return (
            <line
              key={v}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke={color}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          );
        })}
        <path
          d={arc(startA, fillTo)}
          stroke={riskColor}
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          style={{ transition: "stroke 320ms" }}
        />
      </svg>

      <div className="absolute left-0 right-0 top-[56px] text-center">
        <div
          className="text-[60px] font-bold leading-none tracking-[-0.04em] font-[var(--font-latin)]"
          style={{ color: riskColor, transition: "color 320ms" }}
        >
          {animated}
        </div>
        <div className="text-[12px] text-[--color-ink-mute] mt-1 tracking-wider">
          คะแนนความเสี่ยง
        </div>
      </div>

      <div className="absolute -bottom-0.5 left-0 right-0 grid grid-cols-4 gap-1 text-[10px] font-bold text-center">
        <span style={{ color: RISK_COLORS.low }}>ต่ำ</span>
        <span style={{ color: RISK_COLORS.moderate }}>ปานกลาง</span>
        <span style={{ color: RISK_COLORS.high }}>สูง</span>
        <span style={{ color: RISK_COLORS.very_high }}>สูงมาก</span>
      </div>
    </div>
  );
}
