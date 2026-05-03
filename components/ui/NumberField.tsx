"use client";

interface NumberFieldProps {
  label: string;
  unit: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  min: number;
  max: number;
  suggestion?: string;
}

export function NumberField({
  label,
  unit,
  value,
  onChange,
  min,
  max,
  suggestion,
}: NumberFieldProps) {
  const handle = (delta: number) => {
    const cur = value ?? min;
    const next = Math.max(min, Math.min(max, cur + delta));
    onChange(next);
  };

  return (
    <div className="bg-[var(--color-card)] border-[1.5px] border-[var(--color-line)] rounded-[16px] p-4">
      <div className="flex justify-between items-baseline mb-2.5 gap-3">
        <span className="text-[14px] font-semibold text-[var(--color-ink)] whitespace-nowrap">
          {label}
        </span>
        {suggestion && (
          <span className="text-[12px] text-[var(--color-ink-mute)] whitespace-nowrap">
            {suggestion}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => handle(-1)}
          aria-label="ลด"
          className="w-10 h-10 rounded-full border-[1.5px] border-[var(--color-line)] bg-[var(--color-card)] text-[var(--color-ink)] text-[22px] leading-none flex items-center justify-center"
        >
          −
        </button>
        <div className="flex-1 text-center">
          <input
            type="number"
            inputMode="numeric"
            value={value ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "") return onChange(undefined);
              const n = parseInt(v, 10);
              if (!isNaN(n)) onChange(n);
            }}
            placeholder="—"
            className="w-full bg-transparent border-0 outline-0 text-center font-bold text-[32px] tracking-[-0.02em] text-[var(--color-ink)] p-0"
          />
          <div className="text-[12px] text-[var(--color-ink-mute)] -mt-0.5">{unit}</div>
        </div>
        <button
          type="button"
          onClick={() => handle(+1)}
          aria-label="เพิ่ม"
          className="w-10 h-10 rounded-full border-[1.5px] border-[var(--color-line)] bg-[var(--color-card)] text-[var(--color-ink)] text-[22px] leading-none flex items-center justify-center"
        >
          +
        </button>
      </div>
    </div>
  );
}
