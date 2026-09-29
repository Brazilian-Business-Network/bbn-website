import Image from "next/image";
import Link from "next/link";
import { getCldImageUrl } from "next-cloudinary";
import { ArrowRightIcon, MapPinIcon } from "lucide-react";

import { GoldHeading } from "@/components/brand/GoldHeading";
import { CldImage } from "@/components/media/CldImage";
import { formatEventDate, type PastEvent } from "@/data/events";
import { hasValue } from "@/data/site";
import { interpolate } from "@/dictionaries";
import { getEventMedia } from "@/lib/cloudinary";
import { localizedPath, routes, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * One past edition, linking to /[lang]/eventos/[slug].
 *
 * Cover resolution, in order: the curated `coverPublicId`, the first photo in
 * the event's Cloudinary folder, then a gold-outlined crown placeholder. The
 * whole card is a single <Link> — no nested interactive elements, so one Tab
 * stop and one obvious target on touch.
 */

export type EventCardLabels = {
  /** Call to action inside the card, e.g. "Ver galeria". */
  viewGallery: string;
  /** Alt text template for the cover, e.g. "Capa do evento {title}". */
  coverAlt: string;
};

export async function EventCard({
  event,
  locale,
  labels,
  className,
}: {
  event: PastEvent;
  locale: Locale;
  labels: EventCardLabels;
  className?: string;
}) {
  const copy = event.i18n[locale];
  const cover = await resolveCover(event);
  const href = `${localizedPath(locale, routes.eventos)}/${event.slug}`;
  const coverAlt = interpolate(labels.coverAlt, { title: copy.title });

  // Venue is optional; when absent the line is just the city.
  const location =
    [event.venue, event.city].filter((part) => hasValue(part)).join(" — ") || null;

  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col overflow-hidden rounded-sm border border-bbn-line bg-bbn-card",
        "transition-[border-color,box-shadow] duration-300",
        "hover:border-bbn-gold hover:shadow-[0_10px_40px_-14px_var(--color-bbn-gold-dark)]",
        "focus-visible:border-bbn-gold",
        className,
      )}
    >
      <div className="relative aspect-4/3 w-full overflow-hidden bg-bbn-surface">
        {cover ? (
          <CldImage
            src={cover}
            width={1200}
            height={900}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
            alt={coverAlt}
            loading="lazy"
            placeholder="blur"
            blurDataURL={getCldImageUrl({ src: cover, width: 24, quality: 1 })}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <CrownPlaceholder />
        )}

      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="label-caps text-bbn-gold">
          {formatEventDate(event, locale)}
        </p>

        <GoldHeading
          as="h3"
          size="md"
          className="transition-colors duration-300 group-hover:text-bbn-gold-light"
        >
          {copy.title}
        </GoldHeading>

        {location ? (
          <p className="flex items-center gap-2 text-sm text-bbn-muted">
            <MapPinIcon className="size-3.5 shrink-0 text-bbn-gold" aria-hidden="true" />
            <span>{location}</span>
          </p>
        ) : null}

        <span className="label-caps mt-auto flex items-center gap-2 pt-2 text-bbn-champagne transition-colors duration-300 group-hover:text-bbn-gold-light">
          {labels.viewGallery}
          <ArrowRightIcon
            className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}

/** Curated cover, else the first photo in the folder, else null. */
async function resolveCover(event: PastEvent): Promise<string | null> {
  if (event.coverPublicId) return event.coverPublicId;

  const media = await getEventMedia(event.cloudinaryFolder);
  const firstPhoto = media.find((item) => item.resourceType === "image");
  return firstPhoto?.publicId ?? null;
}

/** Brand-safe fallback: the crown on a gold-outlined plate. */
function CrownPlaceholder() {
  return (
    <div className="flex size-full items-center justify-center border-b border-dashed border-bbn-line-strong bg-bbn-surface">
      <Image
        src="/brand/bbn-logo.png"
        alt=""
        width={80}
        height={72}
        className="h-14 w-auto opacity-50"
      />
    </div>
  );
}

export default EventCard;
