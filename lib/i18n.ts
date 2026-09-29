export const locales = ["pt", "en"] as const;
export type Locale = (typeof locales)[number];

/** Portuguese is the default language of the network. */
export const defaultLocale: Locale = "pt";

/** BCP-47 tags for <html lang> and hreflang. */
export const htmlLang: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en",
};

/** Open Graph locale tags. */
export const ogLocale: Record<Locale, string> = {
  pt: "pt_BR",
  en: "en_US",
};

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (locales as readonly string[]).includes(value);
}

/**
 * Route slugs stay Portuguese in both languages — one route tree, so `/en/sobre`
 * rather than `/en/about`. This keeps a single source of truth for paths and
 * means the language toggle is a pure segment swap.
 */
export const routes = {
  home: "",
  sobre: "sobre",
  comoFunciona: "como-funciona",
  membresia: "membresia",
  eventos: "eventos",
  parceiros: "parceiros",
  lideranca: "lideranca",
  contato: "contato",
  privacidade: "privacidade",
} as const;

export type RouteKey = keyof typeof routes;

/** Build a locale-prefixed href, e.g. localizedPath("pt", "sobre") -> "/pt/sobre". */
export function localizedPath(locale: Locale, path: string = ""): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}

/**
 * Swap the locale segment of the current pathname, preserving the rest of the
 * path so the language toggle keeps the reader on the same page.
 */
export function switchLocalePath(pathname: string, target: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return `/${target}`;
  if (isLocale(segments[0])) {
    segments[0] = target;
  } else {
    segments.unshift(target);
  }
  return `/${segments.join("/")}`;
}

/* ==========================================================================
   Navigation
   ==========================================================================
   Single source of truth for the header, the mobile sheet, the footer and the
   sitemap, so the desktop and mobile navs can never drift apart.

   Desktop shows five items: Início, Sobre (with a dropdown), Eventos,
   Membresia, Parceiros — eight top-level links is too crowded. Contato sits
   beside the "Seja membro" CTA as a plain text link. The mobile sheet lists
   every page flat.
   ========================================================================== */

export type NavNode = {
  /** Key into the `nav` object of the dictionaries. */
  key: RouteKey;
  route: string;
  children?: NavNode[];
};

export const navTree: NavNode[] = [
  { key: "home", route: routes.home },
  {
    key: "sobre",
    route: routes.sobre,
    children: [
      { key: "sobre", route: routes.sobre },
      { key: "comoFunciona", route: routes.comoFunciona },
      { key: "lideranca", route: routes.lideranca },
    ],
  },
  { key: "eventos", route: routes.eventos },
  { key: "membresia", route: routes.membresia },
  { key: "parceiros", route: routes.parceiros },
];

/** Shown next to the CTA on desktop, and inside the sheet on mobile. */
export const utilityNav: NavNode[] = [{ key: "contato", route: routes.contato }];

/** Every page, flattened — used by the mobile sheet, the footer and the sitemap. */
export const allNavItems: NavNode[] = [
  { key: "home", route: routes.home },
  { key: "sobre", route: routes.sobre },
  { key: "comoFunciona", route: routes.comoFunciona },
  { key: "membresia", route: routes.membresia },
  { key: "eventos", route: routes.eventos },
  { key: "parceiros", route: routes.parceiros },
  { key: "lideranca", route: routes.lideranca },
  { key: "contato", route: routes.contato },
];

/** Legal pages — linked from the footer and listed in the sitemap, not the nav. */
export const legalNavItems: NavNode[] = [
  { key: "privacidade", route: routes.privacidade },
];

/**
 * True when `href` is the active page, or — for a dropdown trigger — when any
 * of its children is active.
 */
export function isActivePath(
  pathname: string,
  locale: Locale,
  route: string,
): boolean {
  const target = localizedPath(locale, route);
  if (route === routes.home) return pathname === target;
  return pathname === target || pathname.startsWith(`${target}/`);
}
