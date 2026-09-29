import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionProps = {
  children: ReactNode;
  /** Background treatment. `surface` and `card` alternate the black tones. */
  tone?: "black" | "surface" | "card";
  /** Adds the soft gold vignette used on hero and CTA bands. */
  vignette?: boolean;
  /** Thin gold rule along the top edge. */
  topRule?: boolean;
  id?: string;
  className?: string;
  /** Renders as <section> by default; pass "div" when nesting. */
  as?: "section" | "div";
};

const tones = {
  black: "bg-bbn-black",
  surface: "bg-bbn-surface",
  card: "bg-bbn-card",
} as const;

/**
 * Vertical rhythm for every band on the site: py-16 mobile / py-24 desktop,
 * per the spacing rule in CLAUDE.md. Pages compose this rather than setting
 * their own padding, so the rhythm stays identical everywhere.
 */
export function Section({
  children,
  tone = "black",
  vignette = false,
  topRule = false,
  id,
  className,
  as: Tag = "section",
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "relative py-section lg:py-section-lg",
        tones[tone],
        vignette && "bbn-vignette",
        className,
      )}
    >
      {topRule ? (
        <span aria-hidden="true" className="rule-gold absolute inset-x-0 top-0" />
      ) : null}
      {children}
    </Tag>
  );
}
