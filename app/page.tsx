"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Answers } from "@/lib/assessment";
import { isSectionComplete } from "@/lib/assessment";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionProgress } from "@/components/ui/SectionProgress";
import { Welcome } from "@/components/screens/Welcome";
import {
  SectionA,
  SectionB,
  SectionC,
  SectionD,
} from "@/components/screens/SectionA";
import { Result } from "@/components/screens/Result";
import { Consult } from "@/components/screens/Consult";

// Step model:
//   0 = welcome · 1..4 = section A..D · 5 = result · 6 = consult
type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export default function PharmrooApp() {
  const [step, setStep] = useState<Step>(0);
  const [answers, setAnswers] = useState<Answers>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const setAnswer = useCallback(
    <K extends keyof Answers>(key: K, value: Answers[K]) => {
      setAnswers((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [step]);

  const sectionStep = step >= 1 && step <= 4 ? (step as 1 | 2 | 3 | 4) : null;
  const inSection = sectionStep !== null;
  const canProceed = inSection ? isSectionComplete(sectionStep, answers) : true;

  const goNext = () => {
    if (step >= 1 && step <= 3) setStep((step + 1) as Step);
    else if (step === 4) setStep(5);
  };
  const goBack = () => {
    if (step > 0) setStep((step - 1) as Step);
  };
  const restart = () => {
    setAnswers({});
    setStep(0);
  };

  let body: React.ReactNode = null;
  if (step === 0) body = <Welcome onStart={() => setStep(1)} />;
  else if (step === 1) body = <SectionA answers={answers} setAnswer={setAnswer} />;
  else if (step === 2) body = <SectionB answers={answers} setAnswer={setAnswer} />;
  else if (step === 3) body = <SectionC answers={answers} setAnswer={setAnswer} />;
  else if (step === 4) body = <SectionD answers={answers} setAnswer={setAnswer} />;
  else if (step === 5)
    body = (
      <Result
        answers={answers}
        onConsult={() => setStep(6)}
        onRestart={restart}
      />
    );
  else if (step === 6)
    body = <Consult answers={answers} onBack={() => setStep(5)} />;

  const showHeader = step > 0;
  const showProgress = inSection;
  const showFooter = inSection;

  return (
    <main className="min-h-dvh bg-[--color-bg] flex justify-center">
      <div className="w-full max-w-[420px] min-h-dvh flex flex-col bg-[--color-bg]">
        {showHeader && (
          <div className="sticky top-0 z-10 bg-[--color-bg] border-b border-[--color-line] flex items-center gap-2.5 px-3 py-2">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0}
              aria-label="ย้อนกลับ"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[--color-ink] disabled:opacity-30"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M11.5 3L5.5 9L11.5 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="flex-1 text-center">
              <div className="text-[13px] font-semibold text-[--color-ink] tracking-[-0.005em]">
                Pharmroo
              </div>
              <div className="text-[10.5px] text-[--color-ink-mute] mt-px">
                {step >= 1 && step <= 4 && "แบบประเมินความเสี่ยง"}
                {step === 5 && "ผลประเมิน"}
                {step === 6 && "ปรึกษาผู้เชี่ยวชาญ"}
              </div>
            </div>
            <button
              type="button"
              onClick={restart}
              aria-label="ปิด"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[--color-ink-soft]"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 2L12 12M12 2L2 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        )}

        {showProgress && sectionStep && (
          <div className="px-4 pt-3.5 pb-2 bg-[--color-bg] border-b border-[--color-line]">
            <SectionProgress
              current={sectionStep}
              onJump={(idx) => {
                if (idx <= sectionStep) setStep(idx as Step);
              }}
            />
          </div>
        )}

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto overflow-x-hidden bg-[--color-bg]"
        >
          {step >= 1 && step <= 4 ? <div className="px-5 pt-2 pb-6">{body}</div> : body}
        </div>

        {showFooter && (
          <div
            className="sticky bottom-0 z-10 px-5 pt-3.5 pb-[18px]"
            style={{
              background:
                "linear-gradient(to top, var(--color-bg) 70%, rgba(0,0,0,0))",
            }}
          >
            <PrimaryButton onClick={goNext} disabled={!canProceed}>
              {step === 4 ? "ดูผลประเมิน" : "ถัดไป"}
            </PrimaryButton>
          </div>
        )}
      </div>
    </main>
  );
}
