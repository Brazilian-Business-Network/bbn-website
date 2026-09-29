import type { Locale } from "@/lib/i18n";

/**
 * Member testimonials, shown on Início and Membresia.
 *
 * The array is intentionally empty: the section renders nothing at all until a
 * real entry exists. Only add quotes the member has approved for publication.
 *
 * Example entry:
 *   {
 *     name: "Nome Sobrenome",
 *     business: "Empresa · Ramo",
 *     photo: "bbn/depoimentos/nome-sobrenome", // optional Cloudinary public ID
 *     quote: { pt: "…", en: "…" },
 *   }
 */
export type Testimonial = {
  name: string;
  business: string;
  /** Optional Cloudinary public ID. Without it, a gold monogram is shown. */
  photo?: string;
  quote: Record<Locale, string>;
};

export const testimonials: Testimonial[] = [];
