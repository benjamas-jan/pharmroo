"use client";

import Image from "next/image";
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
        <div className="w-8 h-8 rounded-[10px] bg-[var(--color-primary)] text-[var(--color-primary-ink)] font-bold text-[14px] flex items-center justify-center font-[var(--font-latin)]">
          P
        </div>
        <div className="text-[16px] font-semibold text-[var(--color-ink)] tracking-[-0.01em]">
          Pharmroo
        </div>
        <div className="text-[11px] text-[var(--color-ink-mute)] ml-auto tracking-wider">
          ฟามรู้
        </div>
      </div>

      {/* Hero */}
      <div className="relative aspect-[3/2] mb-6 rounded-3xl overflow-hidden bg-[var(--color-primary-soft)]">
        <Image
          src="/hero.png"
          alt="ประเมินความเสี่ยง NCDs"
          fill
          priority
          sizes="(max-width: 420px) 100vw, 420px"
          className="object-cover"
        />
        <div className="absolute left-4 bottom-4 bg-white px-2.5 py-1.5 rounded-full text-[11px] text-[var(--color-ink-soft)] font-semibold shadow-sm">
          ⏱ ใช้เวลา 2 นาที
        </div>
      </div>

      <h1 className="text-[28px] font-bold text-[var(--color-ink)] tracking-[-0.025em] leading-[1.15] m-0">
        เช็กความเสี่ยง
        <br />
        โรค NCDs ของคุณ
      </h1>
      <p className="text-[15px] text-[var(--color-ink-soft)] leading-relaxed mt-3 mb-6">
        ตอบคำถาม 15 ข้อ เกี่ยวกับร่างกาย เครื่องดื่ม อาหาร และไลฟ์สไตล์
        เพื่อรู้ระดับความเสี่ยงและจุดที่ควรปรับ
      </p>

      <div className="flex flex-col gap-2.5 mb-7">
        {features.map(([t, sub], i) => (
          <div
            key={i}
            className="flex gap-3 items-start p-3 bg-[var(--color-card)] border border-[var(--color-line)] rounded-xl"
          >
            <div className="w-7 h-7 rounded-lg bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-bold text-[13px] flex items-center justify-center shrink-0 font-[var(--font-latin)]">
              {i + 1}
            </div>
            <div>
              <div className="text-[14px] font-semibold text-[var(--color-ink)]">{t}</div>
              <div className="text-[12.5px] text-[var(--color-ink-mute)] mt-0.5">{sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto">
        <PrimaryButton onClick={onStart}>เริ่มทำแบบประเมิน</PrimaryButton>
        <div className="text-[11px] text-[var(--color-ink-mute)] text-center mt-3 leading-relaxed">
          แบบประเมินนี้เป็นเพียงแนวทางเบื้องต้น
          <br />
          ไม่ใช่การวินิจฉัยทางการแพทย์
        </div>
      </div>
    </div>
  );
}
