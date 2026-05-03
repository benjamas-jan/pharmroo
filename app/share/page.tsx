import type { Metadata } from "next";
import Link from "next/link";
import { RISK_COLORS, RISK_META, type RiskLevel } from "@/lib/assessment";

interface PageProps {
  searchParams: Promise<{ score?: string; risk?: string }>;
}

const isRisk = (v: string | undefined): v is RiskLevel =>
  v === "low" || v === "moderate" || v === "high" || v === "very_high";

function parseParams(score?: string, risk?: string) {
  const s = parseInt(score ?? "0", 10);
  const safeScore = Number.isFinite(s) ? Math.max(0, Math.min(999, s)) : 0;
  const safeRisk: RiskLevel = isRisk(risk) ? risk : "low";
  return { score: safeScore, risk: safeRisk };
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const { score, risk } = parseParams(params.score, params.risk);
  const meta = RISK_META[risk];
  const ogImage = `/api/share-image?score=${score}&risk=${risk}`;

  return {
    title: `${meta.label} · ${score} คะแนน — Pharmroo`,
    description: meta.headline,
    openGraph: {
      title: `ผลประเมินสุขภาพ NCDs · ${meta.label}`,
      description: meta.headline,
      images: [{ url: ogImage, width: 1080, height: 1350 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `ผลประเมินสุขภาพ NCDs · ${meta.label}`,
      images: [ogImage],
    },
  };
}

export default async function SharePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { score, risk } = parseParams(params.score, params.risk);
  const meta = RISK_META[risk];
  const riskColor = RISK_COLORS[risk];

  return (
    <main className="min-h-dvh bg-[var(--color-bg)] flex justify-center">
      <div className="w-full max-w-[420px] min-h-dvh flex flex-col px-5 pt-6 pb-8">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-[10px] bg-[var(--color-primary)] text-white font-bold text-[14px] flex items-center justify-center font-[var(--font-latin)]">
            P
          </div>
          <div className="text-[16px] font-semibold text-[var(--color-ink)] tracking-[-0.01em]">
            Pharmroo
          </div>
          <div className="text-[11px] text-[var(--color-ink-mute)] ml-auto tracking-wider">
            ฟามรู้
          </div>
        </div>

        <div className="text-center text-[13px] font-bold text-[var(--color-ink-mute)] tracking-[0.18em] mb-2">
          มีคนแชร์ผลประเมินให้คุณ
        </div>

        <div
          className="px-4 pt-7 pb-6 rounded-[20px] relative text-center"
          style={{
            backgroundColor: `${riskColor}0D`,
            border: `2px solid ${riskColor}`,
          }}
        >
          <div
            className="absolute top-[-10px] left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider whitespace-nowrap text-white"
            style={{ background: riskColor }}
          >
            {meta.label}
          </div>
          <div
            className="text-[80px] font-bold leading-none tracking-[-0.04em] font-[var(--font-latin)]"
            style={{ color: riskColor }}
          >
            {score}
          </div>
          <div className="text-[12px] text-[var(--color-ink-mute)] mt-2 tracking-wider">
            คะแนนความเสี่ยง
          </div>
          <div className="mt-5 text-[24px] font-bold text-[var(--color-ink)] tracking-[-0.02em] leading-tight">
            {meta.headline}
          </div>
          <div className="text-[14px] text-[var(--color-ink-soft)] mt-2 leading-relaxed">
            {meta.body}
          </div>
        </div>

        <div className="mt-8 mb-3 text-center text-[18px] font-bold text-[var(--color-ink)] tracking-[-0.01em]">
          อยากรู้คะแนนของคุณบ้างไหม?
        </div>
        <div className="text-center text-[14px] text-[var(--color-ink-soft)] leading-relaxed mb-6">
          ตอบคำถาม 15 ข้อ ใช้เวลา 2 นาที
          <br />
          รู้ระดับความเสี่ยงและจุดที่ควรปรับ
        </div>

        <Link
          href="/"
          className="block w-full h-[52px] rounded-[14px] bg-[var(--color-primary)] text-white text-[16px] font-semibold flex items-center justify-center shadow-[0_8px_20px_rgba(60,90,72,0.2)]"
        >
          เริ่มทำแบบประเมินของคุณ
        </Link>

        <div className="mt-auto pt-8 text-[11px] text-[var(--color-ink-mute)] text-center leading-relaxed">
          ผลประเมินเป็นเพียงแนวทางเบื้องต้น
          <br />
          ไม่ใช่การวินิจฉัยทางการแพทย์
        </div>
      </div>
    </main>
  );
}
