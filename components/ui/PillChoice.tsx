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
          ? "border-[--color-primary] bg-[--color-primary-soft]"
          : "border-[--color-line] bg-[--color-card]"
      }`}
    >
      <div className="text-[14px] font-semibold leading-tight text-[--color-ink]">
        {option.label}
      </div>
      {option.sub && (
        <div className="text-[11px] text-[--color-ink-mute] mt-[3px] leading-tight">
          {option.sub}
        </div>
      )}
    </button>
  );
}
