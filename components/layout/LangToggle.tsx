"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { locales, switchLocalePath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type LangToggleProps = {
  current: Locale;
  labels: { toggle: string; pt: string; en: string };
  className?: string;
};

/**
 * PT / EN switch. Swaps only the locale segment, so the reader stays on the same
 * page. Rendered as two real links rather than a select — crawlable, and it
 * works without JavaScript.
 */
export function LangToggle({ current, labels, className }: LangToggleProps) {
  const pathname = usePathname() || `/${current}`;

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="group"
      aria-label={labels.toggle}
    >
      {locales.map((locale, index) => {
        const isCurrent = locale === current;

        return (
          <span key={locale} className="flex items-center">
            {index > 0 ? (
              <span aria-hidden="true" className="mr-1 text-bbn-line-strong">
                /
              </span>
            ) : null}
            <Link
              href={switchLocalePath(pathname, locale)}
              hrefLang={locale}
              aria-current={isCurrent ? "true" : undefined}
              title={locale === "pt" ? labels.pt : labels.en}
              className={cn(
                "label-caps rounded-sm px-1.5 py-2 transition-colors duration-200",
                isCurrent
                  ? "text-bbn-gold"
                  : "text-bbn-muted hover:text-bbn-champagne",
              )}
            >
              {locale.toUpperCase()}
              <span className="sr-only">
                {" "}
                — {locale === "pt" ? labels.pt : labels.en}
              </span>
            </Link>
          </span>
        );
      })}
    </div>
  );
}
