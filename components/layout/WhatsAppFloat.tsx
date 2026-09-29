import { MessageCircle } from "lucide-react";

import { whatsappUrl } from "@/data/site";

/**
 * Floating WhatsApp button, bottom-right on every page.
 *
 * Renders nothing while data/site.ts has no WhatsApp number, and appears on its
 * own once one is filled in. Offset by the safe-area inset so it clears the
 * iPhone home indicator. (lucide has no WhatsApp brand glyph; the chat bubble
 * plus the accessible label carry the meaning.)
 */
export function WhatsAppFloat({ label }: { label: string }) {
  const href = whatsappUrl();
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="bg-gold-gradient fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex size-14 items-center justify-center rounded-full text-bbn-black shadow-lg shadow-black/60 transition-transform duration-200 hover:scale-105 focus-visible:scale-105"
    >
      <MessageCircle aria-hidden="true" className="size-7" />
    </a>
  );
}
