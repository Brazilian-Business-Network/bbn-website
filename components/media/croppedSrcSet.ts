import { getCldImageUrl } from "next-cloudinary";

/**
 * A srcset of subject-aware (g_auto) Cloudinary crops at a fixed aspect ratio,
 * for a phone-only <source> inside <picture>. Lets full-bleed photos art-direct
 * a portrait crop on phones instead of centre-cutting the desktop one.
 */
export function croppedSrcSet(
  publicId: string,
  ratio: [width: number, height: number],
  widths: readonly number[] = [640, 828, 1080],
): string {
  return widths
    .map((width) => {
      const url = getCldImageUrl({
        src: publicId,
        width,
        height: Math.round((width * ratio[1]) / ratio[0]),
        crop: "fill",
        gravity: "auto",
      });
      return `${url} ${width}w`;
    })
    .join(", ");
}
