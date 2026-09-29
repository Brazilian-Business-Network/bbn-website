import { Instagram } from "lucide-react";

import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * The line printed under every gallery: "as fotos mais recentes saem primeiro
 * no @bbn_usa". The copy comes from the dictionary key `eventos.instagramNote`
 * and may contain a `{handle}` token marking where the link goes — if the token
 * is absent the link is appended, so a translation can never lose it.
 */

export function InstagramNote({
  text,
  handle = site.social.instagramHandle,
  href = site.social.instagram,
  linkLabel,
  className,
}: {
  /** Dictionary copy, optionally containing `{handle}`. */
  text: string;
  /** Visible handle, defaults to the official one. */
  handle?: string;
  /** Profile URL, defaults to the official one. */
  href?: string;
  /** aria-label for the link, e.g. "Abrir o Instagram do BBN em uma nova aba". */
  linkLabel: string;
  className?: string;
}) {
  const [before, after] = text.includes("{handle}")
    ? text.split("{handle}")
    : [`${text} `, ""];

  const link = (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={linkLabel}
      className="inline-flex items-center gap-1.5 font-medium text-bbn-champagne underline decoration-bbn-line underline-offset-4 transition-colors hover:text-bbn-gold hover:decoration-bbn-gold"
    >
      <Instagram aria-hidden="true" className="size-3.5 shrink-0" />
      {handle}
    </a>
  );

  return (
    <p className={cn("text-sm text-bbn-muted", className)}>
      {before}
      {link}
      {after}
    </p>
  );
}

export default InstagramNote;
