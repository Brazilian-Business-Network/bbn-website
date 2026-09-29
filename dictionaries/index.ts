import type { Locale } from "@/lib/i18n";

/**
 * Portuguese is the shape of record: the Dictionary type is derived from pt.json,
 * so en.json missing a key — or drifting in structure — is a build-time type
 * error rather than a blank string in production.
 */
export type Dictionary = typeof import("./pt.json");

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  pt: () => import("./pt.json").then((m) => m.default as Dictionary),
  en: () => import("./en.json").then((m) => m.default as Dictionary),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return loaders[locale]();
}

/**
 * Fill {token} placeholders in a dictionary string.
 * interpolate("{current} de {total}", { current: 3, total: 12 }) -> "3 de 12"
 */
export function interpolate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
