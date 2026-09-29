import type { MetadataRoute } from "next";

import { getPastEvents } from "@/data/events";
import { siteUrl } from "@/data/site";
import {
  allNavItems,
  htmlLang,
  legalNavItems,
  localizedPath,
  locales,
} from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();

  const routePaths = [
    ...[...allNavItems, ...legalNavItems].map((item) => item.route),
    ...getPastEvents().map((event) => `eventos/${event.slug}`),
  ];

  return routePaths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${base}${localizedPath(locale, path)}`,
      lastModified: now,
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((alt) => [
            htmlLang[alt],
            `${base}${localizedPath(alt, path)}`,
          ]),
        ),
      },
    })),
  );
}
