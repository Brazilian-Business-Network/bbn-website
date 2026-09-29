import { getCldImageUrl } from "next-cloudinary";
import { CameraIcon, PlayIcon } from "lucide-react";

import { CldImage } from "@/components/media/CldImage";
import { interpolate } from "@/dictionaries";
import type { CloudMedia } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

import { LightboxProvider, LightboxTile, type LightboxLabels } from "./Lightbox";

/**
 * Photo (and short clip) grid for one event edition.
 *
 * Server component: the thumbnails are rendered on the server and only the thin
 * `LightboxTile` button around each one ships as client JS.
 *
 * Layout is CSS multi-column — 1 column at 375px, 2 from sm, 3 from lg — so
 * portrait and landscape shots keep their real aspect ratio and pack together
 * without the letterboxing a fixed-ratio grid would force.
 */

export type PhotoGridLabels = {
  /** Alt text template, e.g. "{title} — foto {n}". */
  photoAlt: string;
  /** aria-label for a tile, e.g. "Abrir foto {n} em tela cheia". */
  openPhoto: string;
  /** Shown instead of the grid when there is no media yet. */
  empty: string;
  /** Optional second line under `empty`. */
  emptyHint?: string;
  /** Strings for the full-screen viewer. */
  lightbox: Omit<LightboxLabels, "photoAlt">;
};

const FALLBACK_WIDTH = 1200;
const FALLBACK_HEIGHT = 900;

/** Two columns at sm, three at lg — matches the `columns-*` classes below. */
const SIZES = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw";

export function PhotoGrid({
  media,
  eventTitle,
  labels,
}: {
  media: CloudMedia[];
  eventTitle: string;
  labels: PhotoGridLabels;
}) {
  if (media.length === 0) {
    return <PhotoGridEmpty label={labels.empty} hint={labels.emptyHint} />;
  }

  return (
    <LightboxProvider
      media={media}
      eventTitle={eventTitle}
      labels={{ ...labels.lightbox, photoAlt: labels.photoAlt }}
    >
      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
        {media.map((item, index) => {
          const width = item.width || FALLBACK_WIDTH;
          const height = item.height || FALLBACK_HEIGHT;
          const isVideo = item.resourceType === "video";
          const alt =
            item.alt ??
            interpolate(labels.photoAlt, {
              title: eventTitle,
              n: index + 1,
            });

          return (
            <li key={item.publicId} className="break-inside-avoid">
              <LightboxTile
                index={index}
                label={interpolate(labels.openPhoto, { n: index + 1 })}
                className={cn(
                  "group relative block w-full cursor-pointer overflow-hidden rounded-sm",
                  "border border-bbn-line bg-bbn-card transition-[border-color,box-shadow] duration-300",
                  "hover:border-bbn-gold hover:shadow-[0_0_0_1px_var(--color-bbn-gold),0_10px_40px_-12px_var(--color-bbn-gold-dark)]",
                  "focus-visible:border-bbn-gold",
                )}
              >
                <CldImage
                  src={item.publicId}
                  {...(isVideo ? { assetType: "video", format: "jpg" } : null)}
                  width={width}
                  height={height}
                  sizes={SIZES}
                  alt={alt}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={getCldImageUrl({
                    src: item.publicId,
                    ...(isVideo ? { assetType: "video", format: "jpg" } : null),
                    width: 24,
                    quality: 1,
                  })}
                  className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />

                {/* Gold wash on hover, plus a play badge for the short clips. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gold-gradient opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-15"
                />

                {isVideo && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-2 bottom-2 flex size-8 items-center justify-center rounded-full border border-bbn-gold bg-bbn-black/70 text-bbn-gold-light"
                  >
                    <PlayIcon className="size-3.5" />
                  </span>
                )}
              </LightboxTile>
            </li>
          );
        })}
      </ul>
    </LightboxProvider>
  );
}

/** Deliberate, gold-outlined "no photos yet" state — never a collapsed layout. */
function PhotoGridEmpty({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-sm border border-dashed border-bbn-line-strong bg-bbn-surface/60 px-6 py-16 text-center">
      <CameraIcon className="size-7 text-bbn-gold" aria-hidden="true" />
      <p className="label-caps text-bbn-champagne">{label}</p>
      {hint && <p className="max-w-prose text-sm text-bbn-muted">{hint}</p>}
      <span aria-hidden="true" className="rule-gold-short" />
    </div>
  );
}

export default PhotoGrid;
