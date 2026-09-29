import { CldImage } from "@/components/media/CldImage";
import type { Photo } from "@/data/media";
import { cn } from "@/lib/utils";

/**
 * Cloudinary crop sizes per ratio. The crop is done server-side with g_auto
 * (subject-aware), then next/image scales it through the srcset; the box
 * reserves the ratio up front so nothing shifts while it loads.
 */
const ratios = {
  "3/2": { width: 1500, height: 1000, className: "aspect-3/2" },
  "4/3": { width: 1400, height: 1050, className: "aspect-4/3" },
  "4/5": { width: 1040, height: 1300, className: "aspect-4/5" },
  "1/2": { width: 800, height: 1600, className: "aspect-1/2" },
  "1/1": { width: 1100, height: 1100, className: "aspect-square" },
  "21/9": { width: 2520, height: 1080, className: "aspect-21/9" },
  "3/1": { width: 2400, height: 800, className: "aspect-3/1" },
} as const;

export type PhotoRatio = keyof typeof ratios;

/**
 * An event photo in the brand treatment: 4px radius, hairline gold border and a
 * soft dark gradient from the bottom so it sits in the black/gold palette.
 * Always lazy — only the home hero's first slide is fetched eagerly.
 *
 * `framed={false}` drops the border and radius for photos that sit inside an
 * already-bordered card (the photo header on the home pillar cards).
 */
export function BrandPhoto({
  photo,
  ratio = "3/2",
  sizes,
  framed = true,
  className,
}: {
  photo: Photo;
  ratio?: PhotoRatio;
  /** Rendered width hint, e.g. "(min-width: 1024px) 40vw, 92vw". */
  sizes: string;
  framed?: boolean;
  className?: string;
}) {
  const spec = ratios[ratio];

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-bbn-card",
        framed && "rounded-sm border border-bbn-line-strong",
        spec.className,
        className,
      )}
    >
      <CldImage
        src={photo.publicId}
        width={spec.width}
        height={spec.height}
        crop="fill"
        gravity="auto"
        sizes={sizes}
        alt={photo.alt}
        loading="lazy"
        className="size-full object-cover"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-bbn-black/45 via-bbn-black/5 to-transparent"
      />
    </div>
  );
}
