"use client";

import { PrimaryButton } from "@/components/ui/PrimaryButton";

interface WelcomeProps {
  onStart: () => void;
}

export function Welcome({ onStart }: WelcomeProps) {
  const features: [string, string][] = [
    ["15 คำถาม", "4 หมวด · ใช้เวลาประมาณ 2 นาที"],
    ["เห็นผลทันที", "รู้ระดับความเสี่ยงและคะแนนแต่ละด้าน"],
    ["ข้อมูลของคุณเป็นส่วนตัว", "ใช้ติดต่อกลับเท่านั้น"],
  ];

  return (
    <div className="px-5 pt-6 pb-8 flex flex-col min-h-full">
      {/* Brand */}
      <div className="flex items-center gap-2 mb-7">
        <div className="w-8 h-8 rounded-[10px] bg-[--color-primary] text-[--color-primary-ink] font-bold text-[14px] flex items-center justify-center font-[var(--font-latin)]">
          P
        </div>
        <div className="text-[16px] font-semibold text-[--color-ink] tracking-[-0.01em]">
          Pharmroo
        </div>
        <div className="text-[11px] text-[--color-ink-mute] ml-auto tracking-wider">
          ฟามรู้
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-[180px] mb-6 rounded-3xl overflow-hidden bg-[--color-primary-soft]">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 320 180"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0"
        >
          <defs>
            <pattern
              id="dots"
              x="0"
              y="0"
              width="14"
              height="14"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="#3C5A48" fillOpacity="0.18" />
            </pattern>
          </defs>
          <rect width="320" height="180" fill="url(#dots)" />
          <circle cx="80" cy="100" r="60" fill="#3C5A48" fillOpacity="0.18" />
          <circle cx="220" cy="70" r="42" fill="#C7B89E" fillOpacity="0.55" />
          <circle cx="240" cy="130" r="28" fill="#3C5A48" fillOpacity="0.30" />
        </svg>
        <div className="absolute left-5 bottom-4 bg-white px-2.5 py-1.5 rounded-full text-[11px] text-[--color-ink-soft] font-semibold shadow-sm">
          ⏱ ใช้เวลา 2 นาที
        </div>
      </div>

      <h1 className="text-[28px] font-bold text-[--color-ink] tracking-[-0.025em] leading-[1.15] m-0">
        เช็กความเสี่ยง
        <br />
        โรค NCDs ของคุณ
      </h1>
      <p className="text-[15px] text-[--color-ink-soft] leading-relaxed mt-3 mb-6">
        ตอบคำถาม 15 ข้อ เกี่ยวกับร่างกาย เครื่องดื่ม อาหาร และไลฟ์สไตล์
        เพื่อรู้ระดับความเสี่ยงและจุดที่ควรปรับ
      </p>

      <div className="flex flex-col gap-2.5 mb-7">
        {features.map(([t, sub], i) => (
          <div
            key={i}
            className="flex gap-3 items-start p-3 bg-[--color-card] border border-[--color-line] rounded-xl"
          >
            <div className="w-7 h-7 rounded-lg bg-[--color-primary-soft] text-[--color-primary] font-bold text-[13px] flex items-center justify-center shrink-0 font-[var(--font-latin)]">
              {i + 1}
            </div>
            <div>
              <div className="text-[14px] font-semibold text-[--color-ink]">{t}</div>
              <div className="text-[12.5px] text-[--color-ink-mute] mt-0.5">{sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto">
        <PrimaryButton onClick={onStart}>เริ่มทำแบบประเมิน</PrimaryButton>
        <div className="text-[11px] text-[--color-ink-mute] text-center mt-3 leading-relaxed">
          แบบประเมินนี้เป็นเพียงแนวทางเบื้องต้น
          <br />
          ไม่ใช่การวินิจฉัยทางการแพทย์
        </div>
      </div>
    </div>
  );
}
