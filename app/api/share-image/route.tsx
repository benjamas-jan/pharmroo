import { ImageResponse } from "next/og";
import { RISK_COLORS, RISK_META, type RiskLevel } from "@/lib/assessment";

export const runtime = "edge";

const isRisk = (v: string | null): v is RiskLevel =>
  v === "low" || v === "moderate" || v === "high" || v === "very_high";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const scoreParam = parseInt(searchParams.get("score") ?? "0", 10);
  const riskParam = searchParams.get("risk");

  const score = Number.isFinite(scoreParam)
    ? Math.max(0, Math.min(999, scoreParam))
    : 0;
  const risk: RiskLevel = isRisk(riskParam) ? riskParam : "low";

  const meta = RISK_META[risk];
  const riskColor = RISK_COLORS[risk];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#F6F4EE",
          padding: 80,
          fontFamily: "system-ui",
        }}
      >
        {/* Brand mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "#3C5A48",
              color: "#fff",
              fontSize: 36,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            P
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: "#1F2A24" }}>
              Pharmroo
            </div>
            <div style={{ fontSize: 20, color: "#8A988F", marginTop: 2 }}>
              ฟามรู้ · ผลประเมิน NCDs
            </div>
          </div>
        </div>

        {/* Risk hero card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "auto 0",
            padding: "60px 40px",
            borderRadius: 40,
            background: `${riskColor}14`,
            border: `4px solid ${riskColor}`,
          }}
        >
          <div
            style={{
              padding: "8px 22px",
              borderRadius: 999,
              background: riskColor,
              color: "#fff",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "0.04em",
              marginBottom: 24,
            }}
          >
            {meta.label}
          </div>

          <div
            style={{
              fontSize: 220,
              fontWeight: 700,
              color: riskColor,
              lineHeight: 1,
              letterSpacing: "-0.05em",
            }}
          >
            {score}
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#8A988F",
              marginTop: 8,
              letterSpacing: "0.08em",
            }}
          >
            คะแนนความเสี่ยง
          </div>

          <div
            style={{
              fontSize: 44,
              fontWeight: 700,
              color: "#1F2A24",
              marginTop: 36,
              textAlign: "center",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            {meta.headline}
          </div>
        </div>

        {/* Footer CTA */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div style={{ fontSize: 26, color: "#5C6B63", textAlign: "center" }}>
            ประเมินความเสี่ยง NCDs ของคุณใน 2 นาที
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#3C5A48",
              letterSpacing: "0.02em",
            }}
          >
            pharmroo.com
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1350 }
  );
}
