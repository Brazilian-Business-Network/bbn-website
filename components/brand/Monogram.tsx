import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const sizes = {
  sm: "size-11 text-sm",
  md: "size-14 text-lg",
  lg: "size-20 text-2xl",
} as const;

/** "Vinícius" -> "V", "Ana Paula Souza" -> "AS". */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toLocaleUpperCase("pt-BR");
}

/**
 * Gold-ringed monogram — the permanent stand-in for a portrait. Leaders have no
 * photos by design, and testimonials fall back to it when no photo is given.
 * Decorative: the name is always rendered as text beside it.
 */
export function Monogram({
  name,
  icon,
  size = "md",
  className,
}: {
  name?: string;
  /** Shown instead of initials, e.g. a crown for an unnamed role. */
  icon?: ReactNode;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border border-bbn-gold bg-bbn-black font-serif font-semibold",
        sizes[size],
        className,
      )}
    >
      {icon ? (
        <span className="text-bbn-gold">{icon}</span>
      ) : (
        <span className="text-gold-gradient leading-none">{initials(name ?? "")}</span>
      )}
    </span>
  );
}
