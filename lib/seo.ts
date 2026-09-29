import type { Metadata } from "next";

import { hasValue, site, siteUrl } from "@/data/site";
import type { PastEvent } from "@/data/events";
import {
  htmlLang,
  localizedPath,
  locales,
  ogLocale,
  defaultLocale,
  type Locale,
} from "@/lib/i18n";

type BuildMetadataArgs = {
  locale: Locale;
  title: string;
  description: string;
  /** Route without the locale prefix, e.g. "sobre" or "eventos/2026-03-x". */
  path?: string;
  /** Absolute or root-relative image URL. Falls back to the default OG card. */
  image?: string;
};

/** Logo on #0A0A0A, 1200×630 — used when a page has no image of its own. */
const DEFAULT_OG_IMAGE = "/brand/og-default.png";

export function buildMetadata({
  locale,
  title,
  description,
  path = "",
  image,
}: BuildMetadataArgs): Metadata {
  const base = siteUrl();
  const canonical = localizedPath(locale, path);

  // hreflang for every locale, with Portuguese as x-default.
  const languages: Record<string, string> = {};
  for (const alt of locales) {
    languages[htmlLang[alt]] = localizedPath(alt, path);
  }
  languages["x-default"] = localizedPath(defaultLocale, path);

  return {
    metadataBase: new URL(base),
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: ogLocale[locale],
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => ogLocale[l]),
      url: canonical,
      title,
      description,
      images: [
        image
          ? { url: image, alt: title }
          : { url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: site.name },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image ?? DEFAULT_OG_IMAGE],
    },
  };
}

/* ==========================================================================
   JSON-LD
   ========================================================================== */

/** Social profiles that belong in `sameAs`. */
function sameAs(): string[] {
  return [site.social.instagram, site.social.facebook];
}

export function organizationJsonLd(locale: Locale) {
  const base = siteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${base}/#organization`,
    name: site.name,
    alternateName: site.shortName,
    url: `${base}${localizedPath(locale)}`,
    logo: {
      "@type": "ImageObject",
      url: `${base}/brand/bbn-logo.png`,
      width: 828,
      height: 749,
    },
    sameAs: sameAs(),
    // Region-level only: there is no street address to publish.
    address: {
      "@type": "PostalAddress",
      addressRegion: site.location.region,
      addressCountry: site.location.country,
    },
    areaServed: {
      "@type": "State",
      name: site.location.regionName,
    },
    // Emitted only once there is an address; see data/site.ts.
    ...(hasValue(site.email) ? { email: site.email } : {}),
  };
}

export function websiteJsonLd(locale: Locale) {
  const base = siteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base}/#website`,
    name: site.name,
    url: `${base}${localizedPath(locale)}`,
    inLanguage: htmlLang[locale],
    publisher: { "@id": `${base}/#organization` },
  };
}

/** 1200×630 cover rendition for schema and Open Graph, or null without Cloudinary. */
export function eventCoverUrl(event: PastEvent): string | null {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!hasValue(cloud) || !hasValue(event.coverPublicId)) return null;
  return `https://res.cloudinary.com/${cloud}/image/upload/c_fill,g_auto,w_1200,h_630,q_auto,f_jpg/${event.coverPublicId}`;
}

/**
 * Event schema for a dated edition. Only entries with a real `startDate` get
 * one — an announced-but-unscheduled event would produce invalid schema.
 */
export function eventJsonLd(event: PastEvent, locale: Locale) {
  const base = siteUrl();
  const copy = event.i18n[locale];
  const url = `${base}${localizedPath(locale, `eventos/${event.slug}`)}`;

  // "Danbury, CT" -> locality "Danbury", region "CT". The venue is optional and
  // is left out entirely when absent.
  const [locality, region] = event.city.split(",").map((part) => part.trim());
  const cover = eventCoverUrl(event);

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": `${url}#event`,
    name: copy.title,
    description: copy.description,
    url,
    startDate: event.startDate,
    ...(event.endDate ? { endDate: event.endDate } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    inLanguage: htmlLang[locale],
    organizer: { "@id": `${base}/#organization` },
    ...(cover ? { image: [cover] } : {}),
    location: {
      "@type": "Place",
      name: hasValue(event.venue) ? event.venue : event.city,
      address: {
        "@type": "PostalAddress",
        addressLocality: locality,
        ...(region ? { addressRegion: region } : {}),
        addressCountry: site.location.country,
      },
    },
  };
}

/** Annual membership as an Offer, used on the Membresia page. */
export function membershipOfferJsonLd(locale: Locale) {
  const base = siteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: site.name,
    url: `${base}${localizedPath(locale, "membresia")}`,
    price: site.membership.priceUsd,
    priceCurrency: site.membership.currency,
    availability: "https://schema.org/LimitedAvailability",
    offeredBy: { "@id": `${base}/#organization` },
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function breadcrumbJsonLd(
  locale: Locale,
  trail: { name: string; path: string }[],
) {
  const base = siteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${base}${localizedPath(locale, crumb.path)}`,
    })),
  };
}
