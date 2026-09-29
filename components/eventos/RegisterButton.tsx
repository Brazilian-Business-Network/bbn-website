import { Ticket } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Gold "Garantir minha vaga" button for an upcoming event with a registration
 * link. Callers render it only when `registrationUrl()` returns a URL; without
 * one, the event keeps its "data e local em breve" state.
 */
export function RegisterButton({
  href,
  label,
  ariaLabel,
  size = "lg",
  className,
}: {
  href: string;
  label: string;
  /** Includes "(abre em nova aba)" — the registration page is external. */
  ariaLabel: string;
  size?: "default" | "lg";
  className?: string;
}) {
  return (
    <Button
      render={
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} />
      }
      nativeButton={false}
      size={size}
      className={cn("bg-gold-gradient text-bbn-black hover:opacity-90", className)}
    >
      <Ticket aria-hidden="true" className="size-4" />
      {label}
    </Button>
  );
}
