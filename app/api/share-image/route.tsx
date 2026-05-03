import { ImageResponse } from "next/og";
import { RISK_COLORS, RISK_META, type RiskLevel } from "@/lib/assessment";

export const runtime = "edge";

const isRisk = (v: string | null): v is RiskLevel =>
  v === "low" || v === "moderate" || v === "high" || v === "very_high";

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

    // Every <div> below has display:flex set explicitly — required by @vercel/og.
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            background: "#F6F4EE",
            fontFamily: "system-ui",
          }}
        >
          {/* Left column: brand + CTA */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "60px 50px",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  background: "#3C5A48",
                  color: "#fff",
                  fontSize: 32,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                P
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#1F2A24" }}>
                  Pharmroo
                </div>
                <div style={{ display: "flex", fontSize: 18, color: "#8A988F", marginTop: 2 }}>
                  ฟามรู้ · ผลประเมิน NCDs
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  fontSize: 44,
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
                  fontSize: 22,
                  color: "#5C6B63",
                  marginTop: 16,
                  lineHeight: 1.4,
                }}
              >
                ทำแบบประเมินของคุณ · pharmroo.com
              </div>
            </div>
          </div>

          {/* Right column: score panel */}
          <div
            style={{
              width: 520,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: `${riskColor}26`,
              borderLeft: `4px solid ${riskColor}`,
              padding: 40,
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "8px 22px",
                borderRadius: 999,
                background: riskColor,
                color: "#fff",
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "0.04em",
                marginBottom: 20,
              }}
            >
              {meta.label}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 240,
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
                display: "flex",
                fontSize: 22,
                color: "#5C6B63",
                marginTop: 8,
                letterSpacing: "0.06em",
              }}
            >
              คะแนนความเสี่ยง
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
