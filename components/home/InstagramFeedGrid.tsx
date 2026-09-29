import Image from "next/image";
import { Instagram } from "lucide-react";

import { GoldHeading } from "@/components/brand/GoldHeading";
import { SectionLabel } from "@/components/brand/SectionLabel";
import { CldImage } from "@/components/media/CldImage";
import { Button } from "@/components/ui/button";
import type { Photo } from "@/data/media";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Home page "Acompanhe nossos eventos" strip: six curated event photos (see
 * `placements.home.feed` in data/media.ts, chosen so none repeats the hero
 * carousel or other photos on the page), plus a link to the profile.
 *
 * Without Cloudinary configured the list is empty, so the grid falls back to
 * six gold-outlined crown plates. That
 * state is intentional and finished-looking — it reads as brand pattern, not as
 * six broken images.
 */

const PHOTO_COUNT = 6;

export type InstagramFeedGridLabels = {
  /** Uppercase label above the heading, e.g. "Instagram". */
  eyebrow?: string;
  /** Section heading, e.g. "Acompanhe nossos eventos". */
  heading: string;
  /** Supporting line under the heading. */
  description?: string;
  /** Button text, e.g. "Ver no Instagram". */
  cta: string;
  /** aria-label for the button, e.g. "Abrir o Instagram do BBN em uma nova aba". */
  ctaLabel: string;
};

export function InstagramFeedGrid({
  photos,
  labels,
  className,
}: {
  photos: Photo[];
  labels: InstagramFeedGridLabels;
  className?: string;
}) {

  return (
    <section className={cn("flex flex-col gap-10", className)}>
      <div className="flex max-w-3xl flex-col gap-5">
        {labels.eyebrow && <SectionLabel>{labels.eyebrow}</SectionLabel>}
        <GoldHeading as="h2" size="xl">
          {labels.heading}
        </GoldHeading>
        {labels.description && (
          <p className="text-pretty leading-relaxed text-bbn-muted">
            {labels.description}
          </p>
        )}
      </div>

      <ul
        aria-hidden={photos.length === 0 ? true : undefined}
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3"
      >
        {photos.length > 0
          ? photos.map((photo) => (
              <li
                key={photo.publicId}
                className="relative aspect-square overflow-hidden rounded-sm border border-bbn-line bg-bbn-card"
              >
                <CldImage
                  src={photo.publicId}
                  width={800}
                  height={800}
                  crop="fill"
                  gravity="auto"
                  sizes="(min-width: 1024px) 30vw, 46vw"
                  alt={photo.alt}
                  loading="lazy"
                  className="size-full object-cover"
                />
              </li>
            ))
          : Array.from({ length: PHOTO_COUNT }, (_, index) => (
              <PlaceholderTile key={index} />
            ))}
      </ul>

      <div>
        <Button
          variant="outline"
          size="lg"
          nativeButton={false}
          render={
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={labels.ctaLabel}
            />
          }
          className="label-caps gap-2 border-bbn-gold bg-transparent px-6 text-bbn-champagne hover:bg-bbn-gold hover:text-bbn-black"
        >
          <Instagram aria-hidden="true" className="size-4" />
          {labels.cta}
        </Button>
      </div>
    </section>
  );
}

/** Gold-outlined crown plate used until there are photos to show. */
function PlaceholderTile() {
  return (
    <li
      className="flex aspect-square items-center justify-center rounded-sm border border-dashed border-bbn-line-strong bg-bbn-surface/60"
    >
      <Image
        src="/brand/bbn-logo.png"
        alt=""
        width={53}
        height={48}
        className="h-10 w-auto opacity-40 sm:h-12"
      />
    </li>
  );
}

export default InstagramFeedGrid;
