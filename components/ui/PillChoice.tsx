"use client";

import type { Option } from "@/lib/assessment";

interface PillChoiceProps<T extends string | number> {
  option: Option<T>;
  selected: boolean;
  onSelect: (id: T) => void;
}

export function PillChoice<T extends string | number>({
  option,
  selected,
  onSelect,
}: PillChoiceProps<T>) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.id)}
      className={`flex-1 px-2 py-3 rounded-[12px] border-[1.5px] text-center transition-all duration-150 ease-out ${
        selected
          ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
          : "border-[var(--color-line)] bg-[var(--color-card)]"
      }`}
    >
      <div className="text-[14px] font-semibold leading-tight text-[var(--color-ink)]">
        {option.label}
      </div>
      {option.sub && (
        <div className="text-[11px] text-[var(--color-ink-mute)] mt-[3px] leading-tight">
          {option.sub}
        </div>
      )}
    </button>
  );
}
