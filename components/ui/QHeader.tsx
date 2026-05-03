interface QHeaderProps {
  num: string;
  title: string;
  hint?: string;
}

export function QHeader({ num, title, hint }: QHeaderProps) {
  return (
    <div className="mb-3">
      <div className="text-[11px] font-semibold text-[--color-primary] tracking-[0.08em] uppercase mb-1.5 font-[var(--font-latin)]">
        {num}
      </div>
      <div className="text-[18px] font-semibold text-[--color-ink] leading-snug tracking-[-0.01em]">
        {title}
      </div>
      {hint && (
        <div className="text-[13px] text-[--color-ink-soft] mt-1 leading-snug">{hint}</div>
      )}
    </div>
  );
}
