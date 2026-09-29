import { cn } from "@/lib/utils";

/** Thin gold rule that fades at both ends. Decorative only. */
export function GoldDivider({ className }: { className?: string }) {
  return <hr aria-hidden="true" className={cn("rule-gold my-0 border-0", className)} />;
}
