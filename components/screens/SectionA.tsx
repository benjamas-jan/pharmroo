"use client";

import { OPT, SECTIONS, bmiLabel, bmiValue, type Answers } from "@/lib/assessment";
import { ChoiceCard } from "@/components/ui/ChoiceCard";
import { NumberField } from "@/components/ui/NumberField";
import { PillChoice } from "@/components/ui/PillChoice";
import { QHeader } from "@/components/ui/QHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface SectionProps {
  answers: Answers;
  setAnswer: <K extends keyof Answers>(key: K, value: Answers[K]) => void;
}

export function SectionA({ answers, setAnswer }: SectionProps) {
  const bmi = bmiValue(answers.weight, answers.height);
  const waistCutoff =
    answers.gender === "male" ? 90 : answers.gender === "female" ? 80 : null;

  return (
    <>
      <SectionHeader section={SECTIONS[0]} />

      <QHeader
        num="คำถามที่ 1"
        title="เพศของคุณ?"
        hint="เกณฑ์เสี่ยงเอวต่างกันตามเพศ (Thai CPG)"
      />
      <div className="flex gap-2">
        {OPT.gender.map((o) => (
          <PillChoice
            key={o.id}
            option={o}
            selected={answers.gender === o.id}
            onSelect={(v) => setAnswer("gender", v)}
          />
        ))}
      </div>

      <div className="h-5" />
      <QHeader num="คำถามที่ 2" title="น้ำหนักของคุณเท่าไหร่?" />
      <NumberField
        label="น้ำหนัก"
        unit="กิโลกรัม"
        value={answers.weight}
        onChange={(v) => setAnswer("weight", v)}
        min={30}
        max={200}
        suggestion="30–200 kg"
      />

      <div className="h-4" />
      <QHeader num="คำถามที่ 3" title="ส่วนสูงของคุณ?" />
      <NumberField
        label="ส่วนสูง"
        unit="เซนติเมตร"
        value={answers.height}
        onChange={(v) => setAnswer("height", v)}
        min={130}
        max={220}
        suggestion="130–220 cm"
      />
      {bmi && (
        <div className="mt-2.5 px-3.5 py-2.5 bg-[var(--color-primary-soft)] rounded-xl flex justify-between items-center">
          <span className="text-[12px] text-[var(--color-ink-soft)]">BMI (เกณฑ์ไทย)</span>
          <span className="text-[14px] font-bold text-[var(--color-primary)] font-[var(--font-latin)]">
            {bmi.toFixed(1)}
            <span className="font-medium text-[12px] text-[var(--color-ink-soft)] ml-1">
              {bmiLabel(bmi)}
            </span>
          </span>
        </div>
      )}

      <div className="h-4" />
      <QHeader
        num="คำถามที่ 4"
        title="รอบเอวของคุณ?"
        hint={
          answers.waistUnknown
            ? "จะประเมินจาก BMI แทน"
            : waistCutoff
            ? `เกณฑ์เอเชีย: ${
                answers.gender === "male" ? "ชาย ≥90 ซม." : "หญิง ≥80 ซม."
              } = เสี่ยงอ้วนลงพุง`
            : "วัดที่ระดับสะดือ"
        }
      />
      <div
        className={`transition-opacity duration-200 ${
          answers.waistUnknown ? "opacity-40 pointer-events-none" : ""
        }`}
      >
        <NumberField
          label="รอบเอว"
          unit="เซนติเมตร"
          value={answers.waist}
          onChange={(v) => setAnswer("waist", v)}
          min={50}
          max={150}
          suggestion="50–150 cm"
        />
      </div>
      <button
        type="button"
        onClick={() => {
          const next = !answers.waistUnknown;
          setAnswer("waistUnknown", next);
          if (next) setAnswer("waist", undefined);
        }}
        className={`mt-2 px-3 py-2.5 w-full rounded-xl border border-dashed flex items-center justify-between text-[13px] font-medium transition-colors ${
          answers.waistUnknown
            ? "bg-[var(--color-primary-soft)] border-[var(--color-primary)] text-[var(--color-primary)]"
            : "bg-transparent border-[var(--color-line)] text-[var(--color-ink-soft)]"
        }`}
      >
        <span>ไม่ทราบรอบเอว — ประเมินจาก BMI แทน</span>
        <span
          className={`w-[18px] h-[18px] rounded-[5px] border-[1.5px] flex items-center justify-center text-[11px] font-bold ${
            answers.waistUnknown
              ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
              : "bg-transparent border-[var(--color-line)] text-transparent"
          }`}
        >
          ✓
        </span>
      </button>

      <div className="h-4" />
      <QHeader num="คำถามที่ 5" title="อายุของคุณ?" />
      <NumberField
        label="อายุ"
        unit="ปี"
        value={answers.age}
        onChange={(v) => setAnswer("age", v)}
        min={18}
        max={100}
        suggestion="18–100 ปี"
      />
    </>
  );
}

export function SectionB({ answers, setAnswer }: SectionProps) {
  const showLevel = (answers.sweetCount ?? 0) >= 1;
  return (
    <>
      <SectionHeader section={SECTIONS[1]} />

      <QHeader num="คำถามที่ 6" title="ดื่มน้ำเปล่ากี่แก้วต่อวัน?" hint="1 แก้ว ≈ 240 มล." />
      <div className="flex flex-col gap-2">
        {OPT.water.map((o) => (
          <ChoiceCard
            key={o.id}
            option={o}
            selected={answers.water === o.id}
            onSelect={(v) => setAnswer("water", v)}
          />
        ))}
      </div>

      <div className="h-6" />
      <QHeader
        num="คำถามที่ 7"
        title="ดื่มเครื่องดื่มหวานกี่แก้วต่อวัน?"
        hint="ชา กาแฟ น้ำหวาน น้ำอัดลม"
      />
      <div className="flex flex-col gap-2">
        {OPT.sweetCount.map((o) => (
          <ChoiceCard
            key={o.id}
            option={o}
            selected={answers.sweetCount === o.id}
            onSelect={(v) => {
              setAnswer("sweetCount", v);
              if (v === 0) setAnswer("sweetLevel", undefined);
            }}
          />
        ))}
      </div>

      <div
        className="overflow-hidden transition-all"
        style={{
          maxHeight: showLevel ? 200 : 0,
          opacity: showLevel ? 1 : 0,
          transitionDuration: "320ms",
          transitionTimingFunction: "cubic-bezier(.2,.7,.2,1)",
        }}
      >
        <div className="pt-3.5">
          <div className="text-[13px] font-semibold text-[var(--color-ink-soft)] mb-2 flex items-center gap-2">
            <span className="w-3.5 h-[1.5px] bg-[var(--color-primary)] rounded-sm" />
            ระดับความหวาน
          </div>
          <div className="flex gap-2">
            {OPT.sweetLevel.map((o) => (
              <PillChoice
                key={o.id}
                option={o}
                selected={answers.sweetLevel === o.id}
                onSelect={(v) => setAnswer("sweetLevel", v)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="h-6" />
      <QHeader
        num="คำถามที่ 8"
        title="ดื่มเครื่องดื่มไม่หวานกี่แก้วต่อวัน?"
        hint="ชา/กาแฟดำ น้ำสมุนไพรไม่หวาน"
      />
      <div className="flex flex-col gap-2">
        {OPT.unsweet.map((o) => (
          <ChoiceCard
            key={o.id}
            option={o}
            selected={answers.unsweet === o.id}
            onSelect={(v) => setAnswer("unsweet", v)}
          />
        ))}
      </div>

      <div className="h-6" />
      <QHeader num="คำถามที่ 9" title="ดื่มแอลกอฮอล์บ่อยแค่ไหน?" />
      <div className="flex flex-col gap-2">
        {OPT.alcohol.map((o) => (
          <ChoiceCard
            key={o.id}
            option={o}
            selected={answers.alcohol === o.id}
            onSelect={(v) => setAnswer("alcohol", v)}
          />
        ))}
      </div>
    </>
  );
}

export function SectionC({ answers, setAnswer }: SectionProps) {
  return (
    <>
      <SectionHeader section={SECTIONS[2]} />

      <QHeader num="คำถามที่ 10" title="กินข้าวเช้าบ่อยแค่ไหน?" />
      <div className="flex flex-col gap-2">
        {OPT.breakfast.map((o) => (
          <ChoiceCard
            key={o.id}
            option={o}
            selected={answers.breakfast === o.id}
            onSelect={(v) => setAnswer("breakfast", v)}
          />
        ))}
      </div>

      <div className="h-6" />
      <QHeader
        num="คำถามที่ 11"
        title="ในมื้ออาหาร มีผัก/ผลไม้ประมาณเท่าไหร่?"
        hint="คิดเป็นสัดส่วนของจาน"
      />
      <div className="flex flex-col gap-2">
        {OPT.vegetable.map((o) => (
          <ChoiceCard
            key={o.id}
            option={o}
            selected={answers.vegetable === o.id}
            onSelect={(v) => setAnswer("vegetable", v)}
          />
        ))}
      </div>

      <div className="h-6" />
      <QHeader
        num="คำถามที่ 12"
        title="กินอาหารเสริมเป็นประจำไหม?"
        hint="วิตามิน, แร่ธาตุ, สมุนไพร, น้ำมันปลา ฯลฯ"
      />
      <div className="flex gap-2">
        {OPT.supplement.map((o) => (
          <PillChoice
            key={o.id}
            option={o}
            selected={answers.supplement === o.id}
            onSelect={(v) => setAnswer("supplement", v)}
          />
        ))}
      </div>
    </>
  );
}

export function SectionD({ answers, setAnswer }: SectionProps) {
  return (
    <>
      <SectionHeader section={SECTIONS[3]} />

      <QHeader
        num="คำถามที่ 13"
        title="ออกกำลังกายต่อสัปดาห์?"
        hint="รวมเดินเร็ว วิ่ง ปั่นจักรยาน ฯลฯ"
      />
      <div className="flex flex-col gap-2">
        {OPT.exercise.map((o) => (
          <ChoiceCard
            key={o.id}
            option={o}
            selected={answers.exercise === o.id}
            onSelect={(v) => setAnswer("exercise", v)}
          />
        ))}
      </div>

      <div className="h-6" />
      <QHeader num="คำถามที่ 14" title="ปกติคุณนอนกี่ชั่วโมงต่อคืน?" />
      <div className="flex flex-col gap-2">
        {OPT.sleep.map((o) => (
          <ChoiceCard
            key={o.id}
            option={o}
            selected={answers.sleep === o.id}
            onSelect={(v) => setAnswer("sleep", v)}
          />
        ))}
      </div>

      <div className="h-6" />
      <QHeader num="คำถามที่ 15" title="ระดับความเครียดในช่วงนี้?" />
      <div className="flex flex-col gap-2">
        {OPT.stress.map((o) => (
          <ChoiceCard
            key={o.id}
            option={o}
            selected={answers.stress === o.id}
            onSelect={(v) => setAnswer("stress", v)}
          />
        ))}
      </div>
    </>
  );
}
