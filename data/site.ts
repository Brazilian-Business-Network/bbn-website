/**
 * Single place for the institutional details.
 *
 * Empty strings mean "not available yet": every link, button, mention and
 * JSON-LD field for that value is hidden while it is empty, and appears
 * automatically once it is filled in here — no component changes needed.
 */

export const site = {
  name: "Brazilian Business Network",
  shortName: "BBN",
  legalName: "Brazilian Business Network",

  /** Where the network is based. Used in copy and schema; no street address. */
  location: {
    label: "Connecticut, USA",
    region: "CT",
    regionName: "Connecticut",
    country: "US",
  },

  /** Empty until there is an official address. */
  email: "" as string,

  /** Digits only, with country code (e.g. "12035550123"). Empty until there is a number. */
  whatsapp: "" as string,

  /** General Leader / President. Empty until announced. */
  president: "" as string,

  /** Official social profiles. */
  social: {
    instagram: "https://www.instagram.com/bbn_usa/",
    instagramHandle: "@bbn_usa",
    facebook: "https://www.facebook.com/profile.php?id=61569167398193",
  },

  /** Annual membership, per person. */
  membership: {
    priceUsd: 150,
    currency: "USD",
  },

  /**
   * The one Formspree form every form on the site posts to. Each form tags its
   * submission with its own _subject ("[BBN] Membresia", …) and an "origem" field.
   */
  formspreeId: process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "",
} as const;

/** True when a site value has actually been filled in. */
export function hasValue(value: string | undefined | null): value is string {
  return typeof value === "string" && value.trim() !== "";
}

/**
 * Absolute site URL. There is no production domain yet, so this always comes
 * from NEXT_PUBLIC_SITE_URL (http://localhost:3000 locally, the real domain on Vercel).
 */
export function siteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  return hasValue(fromEnv) ? fromEnv.replace(/\/$/, "") : "http://localhost:3000";
}

/** wa.me link, or null while there is no number. */
export function whatsappUrl(message?: string): string | null {
  if (!hasValue(site.whatsapp)) return null;
  const digits = site.whatsapp.replace(/\D/g, "");
  if (!digits) return null;
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${query}`;
}

/** mailto link, or null while there is no address. */
export function emailUrl(subject?: string): string | null {
  if (!hasValue(site.email)) return null;
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  return `mailto:${site.email}${query}`;
}

/** Formspree endpoint, or null while no form ID is configured. */
export function formspreeEndpoint(): string | null {
  return hasValue(site.formspreeId)
    ? `https://formspree.io/f/${site.formspreeId}`
    : null;
}
