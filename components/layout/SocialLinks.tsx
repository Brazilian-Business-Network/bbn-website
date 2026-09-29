import { Facebook, Instagram } from "lucide-react";

import { site } from "@/data/site";
import { cn } from "@/lib/utils";

type SocialLinksProps = {
  labels: { instagram: string; facebook: string };
  size?: "sm" | "md";
  className?: string;
};

const iconSize = {
  sm: "size-4",
  md: "size-5",
} as const;

/**
 * The two official BBN profiles. Shared by the header, the mobile sheet, the
 * footer and the Contato page so the URLs and labels live in one place.
 */
export function SocialLinks({ labels, size = "sm", className }: SocialLinksProps) {
  const links = [
    { href: site.social.instagram, label: labels.instagram, Icon: Instagram },
    { href: site.social.facebook, label: labels.facebook, Icon: Facebook },
  ];

  return (
    <ul className={cn("flex items-center gap-1", className)}>
      {links.map(({ href, label, Icon }) => (
        <li key={href}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={cn(
              // 44px touch target while the icon itself stays small.
              "inline-flex size-11 items-center justify-center rounded-sm",
              "text-bbn-muted transition-colors duration-200",
              "hover:text-bbn-gold focus-visible:text-bbn-gold",
            )}
          >
            <Icon aria-hidden="true" className={iconSize[size]} />
          </a>
        </li>
      ))}
    </ul>
  );
}
