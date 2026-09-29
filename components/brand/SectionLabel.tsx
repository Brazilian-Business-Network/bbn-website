import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Uppercase letter-spaced label with a short gold rule, straight from the
 * institutional PDF. Sits above section headings.
 */
export function SectionLabel({
  children,
  className,
  align = "left",
}: {
  children: ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <p
      className={cn(
        "label-caps flex items-center gap-3 text-bbn-gold",
        align === "center" && "justify-center",
        className,
      )}
    >
      <span aria-hidden="true" className="rule-gold-short w-8 shrink-0" />
      {children}
    </p>
  );
}
