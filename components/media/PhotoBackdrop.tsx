import { CldImage } from "@/components/media/CldImage";
import { croppedSrcSet } from "@/components/media/croppedSrcSet";
import type { PhotoId } from "@/data/media";
import { cn } from "@/lib/utils";

/**
 * A decorative, full-bleed event photo behind a band of text (page banners, the
 * membership CTA). Always `alt=""` — the text over it carries the meaning.
 *
 * The overlays are tuned so every text colour on top keeps WCAG AA even over a
 * pure-white pixel (muted body copy needs ~86% black beneath it):
 * - `banner`: text sits left, so the overlay is darkest on the left and eases
 *   right (≥87% under the text column at every width).
 * - `center`: text is centred, so a flat overlay plus a centre scrim.
 *
 * Place inside a `relative` parent; content above needs `relative z-10`.
 */
export function PhotoBackdrop({
  publicId,
  variant = "banner",
  className,
}: {
  publicId: PhotoId;
  variant?: "banner" | "center";
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={cn("absolute inset-0 overflow-hidden", className)}>
      {/* Phones get a portrait g_auto crop instead of a centre-cut of the wide one. */}
      <picture className="block size-full">
        <source
          media="(max-width: 767px)"
          srcSet={croppedSrcSet(publicId, [4, 5])}
          sizes="100vw"
        />
        <CldImage
          src={publicId}
          width={2560}
          height={1000}
          crop="fill"
          gravity="auto"
          sizes="100vw"
          alt=""
          loading="lazy"
          className="size-full object-cover"
        />
      </picture>
      {variant === "banner" ? (
        <>
          {/* Below 1280px the text column spans most of the width, so the flat
              layer stays at 85%; from xl the column ends near 72% across. */}
          <span className="absolute inset-0 bg-bbn-black/85 xl:bg-bbn-black/72" />
          <span className="absolute inset-0 bg-linear-to-r from-bbn-black/95 via-bbn-black/65 via-65% to-bbn-black/20" />
        </>
      ) : (
        <>
          <span className="absolute inset-0 bg-bbn-black/87 lg:bg-bbn-black/78" />
          <span className="bbn-scrim-center absolute inset-0" />
        </>
      )}
      {/* Fade into the band below so the photo never ends on a hard edge. */}
      <span className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-bbn-black to-transparent" />
    </div>
  );
}
