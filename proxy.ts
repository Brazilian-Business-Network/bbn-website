import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { defaultLocale, locales } from "@/lib/i18n";

/**
 * Every page lives under /[lang]. Requests without a locale prefix are
 * redirected to the reader's preferred supported language, falling back to
 * Portuguese — the default language of the network.
 *
 * Next.js 16 renamed Middleware to Proxy; the behaviour is unchanged.
 */
function preferredLocale(request: NextRequest) {
  const header = request.headers.get("accept-language");
  if (!header) return defaultLocale;

  // Parse "pt-BR,pt;q=0.9,en;q=0.8" into tags ordered by descending quality.
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return {
        tag: tag.trim().toLowerCase(),
        quality: q ? Number.parseFloat(q.split("=")[1]) || 0 : 1,
      };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    const match = locales.find((locale) => locale === base);
    if (match) return match;
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, API routes, and anything with a file extension
  // (favicon.ico, robots.txt, sitemap.xml, images…).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
