"use client";

import { useState, useTransition } from "react";
import { submitLead } from "@/app/actions/submit-lead";
import { classifyRisk, computeScore, type Answers } from "@/lib/assessment";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

interface ConsultProps {
  answers: Answers;
  onBack: () => void;
}

export function Consult({ answers, onBack }: ConsultProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [concern, setConcern] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const valid = name.trim().length >= 2 && phone.replace(/\D/g, "").length >= 9;

  const onSubmit = () => {
    if (!valid || isPending) return;
    setError(null);
    const score = computeScore(answers);
    const riskLevel = classifyRisk(score.total);

    startTransition(async () => {
      const result = await submitLead({
        name,
        phone,
        concern,
        riskLevel,
        totalScore: score.total,
      });
      if (result.ok) {
        setSubmitted(true);
      } else {
        setError(result.error ?? "ไม่สามารถส่งข้อมูลได้");
      }
    });
  };

  if (submitted) {
    return (
      <div className="px-6 py-6 h-full flex flex-col items-center justify-center text-center">
        <div className="w-[72px] h-[72px] rounded-full bg-[--color-primary-soft] flex items-center justify-center mb-[18px]">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M6 16L13 23L26 9"
              stroke="#3C5A48"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="text-[22px] font-bold text-[--color-ink] tracking-[-0.02em]">
          ส่งคำขอเรียบร้อย
        </div>
        <div className="text-[14px] text-[--color-ink-soft] mt-2.5 leading-relaxed max-w-[260px]">
          ทีมงานจะติดต่อกลับภายใน 24 ชม.
          <br />
          ขอบคุณที่ใส่ใจสุขภาพของตัวเองนะ 💚
        </div>
        <div className="mt-7 w-full max-w-[280px]">
          <PrimaryButton variant="ghost" onClick={onBack}>
            กลับหน้าผลลัพธ์
          </PrimaryButton>
        </div>
      </div>
    );
  }

  const fieldClass =
    "w-full px-4 py-3.5 border-[1.5px] border-[--color-line] rounded-xl bg-[--color-card] text-[--color-ink] text-[15px] outline-none box-border focus:border-[--color-primary] transition-colors";
  const labelClass = "text-[13px] font-semibold text-[--color-ink] mb-1.5 block";

  return (
    <div className="px-5 pt-5 pb-8">
      <button
        type="button"
        onClick={onBack}
        className="bg-transparent border-0 p-0 text-[--color-ink-soft] text-[13px] flex items-center gap-1 mb-4"
      >
        ← กลับ
      </button>

      <div className="text-[26px] font-bold text-[--color-ink] tracking-[-0.02em] leading-tight">
        ปรึกษากับเรา
      </div>
      <div className="text-[14px] text-[--color-ink-soft] mt-2 leading-snug mb-6">
        กรอกข้อมูลเพื่อให้ทีมงานติดต่อกลับ พร้อมคำแนะนำที่เหมาะกับคุณ
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className={labelClass}>
            ชื่อเล่น
            <span style={{ color: "#C26A3D" }} className="ml-1">
              *
            </span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="เช่น ก้อย"
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>
            เบอร์โทรศัพท์
            <span style={{ color: "#C26A3D" }} className="ml-1">
              *
            </span>
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            placeholder="08X-XXX-XXXX"
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>เรื่องที่อยากปรึกษา</label>
          <textarea
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            rows={4}
            placeholder="เช่น อยากลดน้ำตาลในเลือด นอนไม่หลับ..."
            className={`${fieldClass} resize-none leading-snug`}
          />
        </div>
        <div className="p-3 bg-[--color-primary-soft] rounded-[10px] text-[12px] text-[--color-ink-soft] leading-snug">
          🔒 ข้อมูลของคุณจะใช้สำหรับการติดต่อกลับเท่านั้น และเก็บเป็นความลับ
        </div>
        {error && (
          <div className="px-3 py-2.5 bg-[--color-risk-high]/10 text-[--color-risk-high] text-[13px] rounded-[10px] border border-[--color-risk-high]/20">
            {error}
          </div>
        )}
      </div>

      <div className="mt-6">
        <PrimaryButton onClick={onSubmit} disabled={!valid || isPending}>
          {isPending ? "กำลังส่ง..." : "ส่งคำขอปรึกษา"}
        </PrimaryButton>
      </div>
    </div>
  );
}
