"use client";

import type { Option } from "@/lib/assessment";

interface ChoiceCardProps<T extends string | number> {
  option: Option<T>;
  selected: boolean;
  onSelect: (id: T) => void;
}

export function ChoiceCard<T extends string | number>({
  option,
  selected,
  onSelect,
}: ChoiceCardProps<T>) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.id)}
      className={`w-full text-left flex items-center gap-3 p-4 rounded-[14px] border-[1.5px] transition-all duration-150 ease-out ${
        selected
          ? "border-[--color-primary] bg-[--color-primary-soft] shadow-[0_6px_16px_rgba(60,90,72,0.12)]"
          : "border-[--color-line] bg-[--color-card]"
      }`}
    >
      <span
        className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          selected ? "border-[--color-primary] bg-[--color-primary]" : "border-[--color-line]"
        }`}
      >
        {selected && (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path
              d="M1 4.5L4 7.5L10 1.5"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[16px] font-semibold leading-tight tracking-[-0.005em] text-[--color-ink]">
          {option.label}
        </span>
        {option.sub && (
          <span className="block text-[12.5px] text-[--color-ink-mute] mt-0.5 leading-tight">
            {option.sub}
          </span>
        )}
      </span>
    </button>
  );
}
