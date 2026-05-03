import type { Section } from "@/lib/assessment";

interface SectionHeaderProps {
  section: Section;
}

export function SectionHeader({ section }: SectionHeaderProps) {
  return (
    <div className="pt-1 pb-4">
      <div className="text-[11px] font-semibold text-[--color-primary] tracking-[0.12em] font-[var(--font-latin)]">
        SECTION {section.id}
      </div>
      <div className="text-[26px] font-bold text-[--color-ink] tracking-[-0.02em] mt-1 leading-tight">
        {section.title}
      </div>
      <div className="text-[14px] text-[--color-ink-soft] mt-1.5">{section.subtitle}</div>
    </div>
  );
}
