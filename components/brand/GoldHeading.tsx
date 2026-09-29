import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Level = "h1" | "h2" | "h3" | "h4";

type GoldHeadingProps = {
  children: ReactNode;
  /** Semantic level. Pick by document outline, then set `size` for appearance. */
  as?: Level;
  /**
   * Champagne for most headings, gradient for the key ones (hero, section
   * openers, pull quotes). There is deliberately no white option — headings on
   * this site are never plain white, per the brand identity in the PDF.
   */
  variant?: "champagne" | "gradient";
  size?: "display" | "xl" | "lg" | "md" | "sm";
  id?: string;
  className?: string;
};

const sizes = {
  display: "text-4xl leading-[1.08] sm:text-5xl lg:text-6xl",
  xl: "text-3xl leading-[1.12] sm:text-4xl lg:text-5xl",
  lg: "text-2xl leading-[1.18] sm:text-3xl lg:text-4xl",
  md: "text-xl leading-tight sm:text-2xl",
  sm: "text-lg leading-[1.3]",
} as const;

/**
 * The only heading component on the site. It cannot render white text, which is
 * what keeps every page on-brand without relying on review discipline.
 */
export function GoldHeading({
  children,
  as: Tag = "h2",
  variant = "champagne",
  size = "lg",
  id,
  className,
}: GoldHeadingProps) {
  const isGradient = variant === "gradient";

  return (
    <Tag
      id={id}
      className={cn(
        "font-serif font-semibold tracking-tight",
        sizes[size],
        // `text-gold-gradient` carries its own champagne fallback, so it must not
        // be combined with `text-bbn-champagne` — utility order would decide the
        // winner and that is not something to depend on.
        isGradient ? "text-gold-gradient" : "text-bbn-champagne",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
