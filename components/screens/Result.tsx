"use client";

import { useEffect, useState } from "react";
import {
  RISK_COLORS,
  RISK_META,
  SECTION_META,
  classifyRisk,
  computeScore,
  pickInsights,
  type Answers,
} from "@/lib/assessment";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { RiskGauge } from "@/components/ui/RiskGauge";

interface ResultProps {
  answers: Answers;
  onConsult: () => void;
  onRestart: () => void;
}

interface SectionBarProps {
  id: "A" | "B" | "C" | "D";
  score: number;
  max: number;
}

function SectionBar({ id, score, max }: SectionBarProps) {
  const meta = SECTION_META[id];
  const display = Math.max(0, score);
  const pct = Math.min(100, (display / max) * 100);
  const ratio = display / max;

  const fillColor =
    ratio < 0.25
      ? RISK_COLORS.low
      : ratio < 0.5
      ? RISK_COLORS.moderate
      : ratio < 0.75
      ? RISK_COLORS.high
      : RISK_COLORS.very_high;
  const riskLabel =
    ratio < 0.25 ? "ต่ำ" : ratio < 0.5 ? "ปานกลาง" : ratio < 0.75 ? "สูง" : "สูงมาก";

  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(pct), 200);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="px-3.5 py-3 bg-[var(--color-card)] border border-[var(--color-line)] rounded-xl">
      <div className="flex justify-between items-baseline mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[var(--color-primary)] tracking-[0.08em] bg-[var(--color-primary-soft)] px-1.5 py-0.5 rounded font-[var(--font-latin)]">
            {id}
          </span>
          <span className="text-[16px] font-bold text-[var(--color-ink)]">{meta.name}</span>
        </div>
        <div
          className="text-[12px] font-bold px-2.5 py-0.5 rounded-full"
          style={{ color: fillColor, backgroundColor: `${fillColor}1A` }}
        >
          {riskLabel}
        </div>
      </div>
      <div className="h-1.5 bg-[var(--color-line)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${w}%`,
            background: fillColor,
            transition: "width 700ms cubic-bezier(.2,.7,.2,1)",
          }}
        />
      </div>
    </div>
  );
}

export function Result({ answers, onConsult, onRestart }: ResultProps) {
  const score = computeScore(answers);
  const riskLevel = classifyRisk(score.total);
  const meta = RISK_META[riskLevel];
  const tips = pickInsights(answers, score);
  const riskColor = RISK_COLORS[riskLevel];

  const [downloading, setDownloading] = useState(false);
  const [shareToast, setShareToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setShareToast(msg);
    setTimeout(() => setShareToast(null), 2400);
  };

  const shareUrl =
    typeof window !== "undefined" ? window.location.origin : "https://pharmroo.com";
  const shareText = `ฉันเพิ่งทำแบบประเมินความเสี่ยง NCDs ที่ Pharmroo · ${meta.label} (${score.total} คะแนน) ลองทำดู`;

  const shareToLine = () => {
    const text = encodeURIComponent(`${shareText}\n${shareUrl}`);
    window.open(`https://line.me/R/msg/text/?${text}`, "_blank");
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(shareUrl);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
      "noopener,width=600,height=600"
    );
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast("คัดลอกลิงก์แล้ว");
    } catch {
      showToast("คัดลอกไม่สำเร็จ");
    }
  };

  const downloadImage = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const res = await fetch(
        `/api/share-image?score=${score.total}&risk=${riskLevel}`
      );
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pharmroo-result-${score.total}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast("บันทึกรูปแล้ว · เอาไปโพสต์ใน IG/FB ได้เลย");
    } catch {
      showToast("บันทึกรูปไม่สำเร็จ");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="px-5 pt-5 pb-8">
      <div className="flex justify-center items-center gap-1.5 text-[13px] font-bold text-[var(--color-ink-mute)] tracking-[0.18em] mb-2">
        <span className="w-[18px] h-px bg-[var(--color-line)]" />
        ผลประเมินของคุณ
        <span className="w-[18px] h-px bg-[var(--color-line)]" />
      </div>

      <div
        className="mt-2 px-4 pt-5 pb-5 rounded-[20px] relative"
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
        <RiskGauge score={score.total} riskLevel={riskLevel} />
        <div className="text-center mt-3 text-[28px] font-bold text-[var(--color-ink)] tracking-[-0.02em] leading-tight">
          {meta.headline}
        </div>
        <div className="text-center text-[15px] text-[var(--color-ink-soft)] mt-2.5 leading-relaxed px-1">
          {meta.body}
        </div>
      </div>

      <div className="mt-7 mb-3 text-[18px] font-bold text-[var(--color-ink)] tracking-[-0.01em]">
        ความเสี่ยงแต่ละด้าน
      </div>
      <div className="flex flex-col gap-2">
        {(["A", "B", "C", "D"] as const).map((id) => (
          <SectionBar
            key={id}
            id={id}
            score={score.sections[id].score}
            max={SECTION_META[id].max}
          />
        ))}
      </div>

      <div className="mt-7 mb-3 text-[18px] font-bold text-[var(--color-ink)] tracking-[-0.01em]">
        คำแนะนำสำหรับคุณ
      </div>
      <div className="flex flex-col gap-2">
        {tips.map((tip, i) => (
          <div
            key={i}
            className="flex gap-3 p-3.5 bg-[var(--color-card)] border border-[var(--color-line)] rounded-xl items-start"
          >
            <div className="w-9 h-9 rounded-[10px] bg-[var(--color-primary-soft)] flex items-center justify-center text-[18px] shrink-0">
              {tip.icon}
            </div>
            <div>
              <div className="text-[15px] font-bold text-[var(--color-ink)] mb-1">
                {tip.title}
              </div>
              <div className="text-[14px] text-[var(--color-ink-soft)] leading-relaxed">
                {tip.body}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-2.5">
        <PrimaryButton onClick={onConsult}>ปรึกษาผู้เชี่ยวชาญ →</PrimaryButton>
        <PrimaryButton variant="ghost" onClick={onRestart}>
          ทำแบบประเมินใหม่
        </PrimaryButton>
      </div>

      <div className="mt-7">
        <div className="text-[13px] font-semibold text-[var(--color-ink-soft)] mb-3 text-center">
          แชร์ให้เพื่อน
        </div>
        <div className="grid grid-cols-4 gap-2">
          <button
            type="button"
            onClick={shareToLine}
            className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-[var(--color-card)] border border-[var(--color-line)] hover:border-[var(--color-primary)] transition-colors"
          >
            <span className="w-9 h-9 rounded-full bg-[#06C755] text-white flex items-center justify-center text-[16px] font-bold font-[var(--font-latin)]">
              L
            </span>
            <span className="text-[11px] font-semibold text-[var(--color-ink)]">
              LINE
            </span>
          </button>
          <button
            type="button"
            onClick={shareToFacebook}
            className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-[var(--color-card)] border border-[var(--color-line)] hover:border-[var(--color-primary)] transition-colors"
          >
            <span className="w-9 h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-[18px] font-bold font-[var(--font-latin)]">
              f
            </span>
            <span className="text-[11px] font-semibold text-[var(--color-ink)]">
              Facebook
            </span>
          </button>
          <button
            type="button"
            onClick={downloadImage}
            disabled={downloading}
            className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-[var(--color-card)] border border-[var(--color-line)] hover:border-[var(--color-primary)] transition-colors disabled:opacity-50"
          >
            <span className="w-9 h-9 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1.5V11M8 11L4 7M8 11L12 7M2 13.5h12"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-[11px] font-semibold text-[var(--color-ink)]">
              บันทึกรูป
            </span>
          </button>
          <button
            type="button"
            onClick={copyLink}
            className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-[var(--color-card)] border border-[var(--color-line)] hover:border-[var(--color-primary)] transition-colors"
          >
            <span className="w-9 h-9 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6.5 9.5L9.5 6.5M5 11l-.5.5a2.5 2.5 0 01-3.5-3.5L4 5M11 5l.5-.5a2.5 2.5 0 013.5 3.5L12 11"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="text-[11px] font-semibold text-[var(--color-ink)]">
              คัดลอกลิงก์
            </span>
          </button>
        </div>
      </div>

      {shareToast && (
        <div className="mt-3 px-3 py-2 text-center text-[12px] text-[var(--color-ink-soft)] bg-[var(--color-primary-soft)] rounded-[10px]">
          {shareToast}
        </div>
      )}

      <div className="mt-4 text-[12px] text-[var(--color-ink-mute)] text-center leading-relaxed">
        ผลลัพธ์นี้เป็นเพียงแนวทางเบื้องต้น
        <br />
        หากกังวลควรพบแพทย์เพื่อตรวจสุขภาพ
      </div>
    </div>
  );
}
