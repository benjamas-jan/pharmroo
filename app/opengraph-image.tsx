import { ImageResponse } from "next/og";

export const alt = "Pharmroo · ฟามรู้ — ประเมินความเสี่ยงโรค NCDs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
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
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "#3C5A48",
              color: "#fff",
              fontSize: 30,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            P
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#1F2A24" }}>
              Pharmroo
            </div>
            <div style={{ fontSize: 18, color: "#8A988F", marginTop: 2 }}>
              ฟามรู้
            </div>
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
            gap: 20,
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              color: "#1F2A24",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            ประเมินความเสี่ยง
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              color: "#3C5A48",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            โรค NCDs ใน 2 นาที
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#5C6B63",
              marginTop: 12,
              lineHeight: 1.4,
            }}
          >
            15 คำถาม · เห็นผลทันที · ข้อมูลปลอดภัย
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
