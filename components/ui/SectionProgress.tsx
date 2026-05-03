"use client";

import { Fragment } from "react";
import { SECTIONS } from "@/lib/assessment";

interface SectionProgressProps {
  current: 1 | 2 | 3 | 4;
  onJump?: (idx: 1 | 2 | 3 | 4) => void;
}

export function SectionProgress({ current, onJump }: SectionProgressProps) {
  return (
    <div className="flex gap-1.5 items-center justify-center">
      {SECTIONS.map((s, i) => {
        const idx = (i + 1) as 1 | 2 | 3 | 4;
        const state = idx < current ? "done" : idx === current ? "active" : "pending";

        return (
          <Fragment key={s.id}>
            <button
              type="button"
              onClick={() => onJump?.(idx)}
              className={`min-w-[28px] h-7 rounded-full border-[1.5px] flex items-center justify-center gap-1.5 text-[12px] font-semibold transition-all duration-200 ease-out ${
                state === "active"
                  ? "px-3 bg-[--color-primary] border-[--color-primary] text-[--color-primary-ink]"
                  : state === "done"
                  ? "w-7 px-0 bg-[--color-primary] border-[--color-primary] text-[--color-primary-ink]"
                  : "w-7 px-0 bg-transparent border-[--color-line] text-[--color-ink-mute]"
              }`}
            >
              {state === "done" ? (
                <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                  <path
                    d="M1 4.5L4 7.5L10 1.5"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                s.id
              )}
              {state === "active" && (
                <span className="text-[12px] font-semibold">{s.title}</span>
              )}
            </button>
            {i < SECTIONS.length - 1 && (
              <div
                className={`w-3.5 h-[1.5px] rounded transition-colors duration-200 ${
                  idx < current ? "bg-[--color-primary]" : "bg-[--color-line]"
                }`}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
