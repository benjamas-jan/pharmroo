import { ImageResponse } from "next/og";
import { RISK_COLORS, RISK_META, type RiskLevel } from "@/lib/assessment";

export const runtime = "edge";

const isRisk = (v: string | null): v is RiskLevel =>
  v === "low" || v === "moderate" || v === "high" || v === "very_high";

// ── Gauge geometry (mirrors components/ui/RiskGauge.tsx) ──────────────────
const cx = 130;
const cy = 130;
const r = 100;
const startA = Math.PI * 0.85;
const endA = Math.PI * 2.15;

function polar(a: number) {
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function arcPath(from: number, to: number) {
  const s = polar(from);
  const e = polar(to);
  const large = to - from > Math.PI ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

function bandArc(from: number, to: number) {
  const a1 = startA + (endA - startA) * (from / 100);
  const a2 = startA + (endA - startA) * (to / 100);
  return arcPath(a1, a2);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const scoreParam = parseInt(searchParams.get("score") ?? "0", 10);
    const riskParam = searchParams.get("risk");

    const score = Number.isFinite(scoreParam)
      ? Math.max(0, Math.min(999, scoreParam))
      : 0;
    const risk: RiskLevel = isRisk(riskParam) ? riskParam : "low";

    const meta = RISK_META[risk];
    const riskColor = RISK_COLORS[risk];

    const bands = [
      { from: 0, to: 15, color: RISK_COLORS.low },
      { from: 15, to: 35, color: RISK_COLORS.moderate },
      { from: 35, to: 60, color: RISK_COLORS.high },
      { from: 60, to: 100, color: RISK_COLORS.very_high },
    ];

    const ticks = [
      { v: 15, color: RISK_COLORS.low },
      { v: 35, color: RISK_COLORS.moderate },
      { v: 60, color: RISK_COLORS.high },
    ];

    const norm = Math.max(0, Math.min(100, score));
    const fillToA = startA + (endA - startA) * (norm / 100);

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: "#F6F4EE",
            fontFamily: "system-ui",
          }}
        >
          {/* Brand bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "32px 50px 0",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "#3C5A48",
                color: "#fff",
                fontSize: 28,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              P
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 26, fontWeight: 700, color: "#1F2A24" }}>
                Pharmroo
              </div>
              <div style={{ display: "flex", fontSize: 16, color: "#8A988F", marginTop: 1 }}>
                ฟามรู้ · ผลประเมิน NCDs
              </div>
            </div>
          </div>

          {/* Main two-column area */}
          <div style={{ display: "flex", flex: 1, padding: "10px 50px 30px" }}>
            {/* Left: gauge */}
            <div
              style={{
                width: 520,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <svg width="520" height="400" viewBox="0 0 260 200">
                {/* Background bands */}
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
                {/* Tick marks */}
                {ticks.map(({ v, color }) => {
                  const a = startA + (endA - startA) * (v / 100);
                  const inner = {
                    x: cx + (r - 16) * Math.cos(a),
                    y: cy + (r - 16) * Math.sin(a),
                  };
                  const outer = {
                    x: cx + (r + 16) * Math.cos(a),
                    y: cy + (r + 16) * Math.sin(a),
                  };
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
                {/* Active arc */}
                <path
                  d={arcPath(startA, fillToA)}
                  stroke={riskColor}
                  strokeWidth="14"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>

              {/* Score overlay */}
              <div
                style={{
                  position: "absolute",
                  top: 110,
                  left: 0,
                  right: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: 130,
                    fontWeight: 700,
                    color: riskColor,
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {score}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: 16,
                    color: "#8A988F",
                    marginTop: 6,
                    letterSpacing: "0.08em",
                  }}
                >
                  คะแนนความเสี่ยง
                </div>
              </div>

              {/* Band legend below gauge */}
              <div
                style={{
                  position: "absolute",
                  bottom: 70,
                  left: 0,
                  right: 0,
                  display: "flex",
                  justifyContent: "space-around",
                  paddingLeft: 30,
                  paddingRight: 30,
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                <span style={{ display: "flex", color: RISK_COLORS.low }}>ต่ำ</span>
                <span style={{ display: "flex", color: RISK_COLORS.moderate }}>ปานกลาง</span>
                <span style={{ display: "flex", color: RISK_COLORS.high }}>สูง</span>
                <span style={{ display: "flex", color: RISK_COLORS.very_high }}>สูงมาก</span>
              </div>
            </div>

            {/* Right: risk label + headline + CTA */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingLeft: 40,
                gap: 14,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignSelf: "flex-start",
                  padding: "8px 20px",
                  borderRadius: 999,
                  background: riskColor,
                  color: "#fff",
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                }}
              >
                {meta.label}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 50,
                  fontWeight: 700,
                  color: "#1F2A24",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                }}
              >
                {meta.headline}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 20,
                  color: "#5C6B63",
                  marginTop: 4,
                  lineHeight: 1.45,
                }}
              >
                ทำแบบประเมินของคุณ · pharmroo.com
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "cache-control": "public, max-age=300, s-maxage=300",
        },
      }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    console.error("[share-image] render failed:", e);
    return new Response(`Image generation failed: ${msg}`, {
      status: 500,
      headers: { "content-type": "text/plain" },
    });
  }
}
