"use client";

import type { ReactNode } from "react";

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "ghost";
  type?: "button" | "submit";
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  variant = "primary",
  type = "button",
}: PrimaryButtonProps) {
  const isPrimary = variant === "primary";

  const base =
    "w-full h-[52px] rounded-[14px] text-[16px] font-semibold tracking-[-0.005em] transition-all duration-150 disabled:cursor-not-allowed";
  const styled = isPrimary
    ? "bg-[--color-primary] text-[--color-primary-ink] shadow-[0_8px_20px_rgba(60,90,72,0.2)] disabled:bg-[--color-line] disabled:shadow-none disabled:text-[--color-ink-mute]"
    : "bg-[--color-card] text-[--color-ink] border-[1.5px] border-[--color-line]";

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styled}`}>
      {children}
    </button>
  );
}
