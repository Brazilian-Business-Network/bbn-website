import Image from "next/image";

import { cn } from "@/lib/utils";

/** Intrinsic ratio of public/brand/bbn-logo.png (828×749). */
const RATIO = 828 / 749;

/**
 * Sized by height; width follows the logo's ratio. `width`/`height` are the
 * largest rendered size so the 1x/2x srcset stays sharp.
 */
const sizes = {
  sm: { height: 40, className: "h-9 lg:h-10" }, // header, mobile sheet: 36px → 40px
  md: { height: 48, className: "h-12" },
  lg: { height: 96, className: "h-20 sm:h-24" },
  xl: { height: 160, className: "h-28 sm:h-36 lg:h-40" },
} as const;

/**
 * The BBN logo: the crown with the "BBN" lettering built in, so it never needs
 * a separate "BBN" text wordmark beside it. Colours are the logo's own — do not
 * recolour it. Pass `alt=""` only where it's a purely decorative repeat.
 */
export function CrownLogo({
  size = "md",
  alt = "Brazilian Business Network",
  priority = false,
  className,
}: {
  size?: keyof typeof sizes;
  alt?: string;
  priority?: boolean;
  className?: string;
}) {
  const spec = sizes[size];

  return (
    <Image
      src="/brand/bbn-logo.png"
      alt={alt}
      width={Math.round(spec.height * RATIO)}
      height={spec.height}
      priority={priority}
      className={cn("w-auto object-contain", spec.className, className)}
    />
  );
}
