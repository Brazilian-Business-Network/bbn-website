import Link from "next/link";
import { Mail, MapPin, MessageCircle } from "lucide-react";

import { CrownLogo } from "@/components/brand/CrownLogo";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { emailUrl, site, whatsappUrl } from "@/data/site";
import { allNavItems, legalNavItems, localizedPath, type Locale } from "@/lib/i18n";

type FooterProps = {
  locale: Locale;
  labels: {
    tagline: string;
    navLabel: string;
    contactLabel: string;
    followLabel: string;
    rights: string;
    navLabels: Record<string, string>;
    instagram: string;
    facebook: string;
    handle: string;
  };
};

/**
 * Footer. Lists all eight pages, so every page stays reachable even though the
 * desktop header groups three of them behind a dropdown.
 */
export function Footer({ locale, labels }: FooterProps) {
  const wa = whatsappUrl();
  const mail = emailUrl();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-bbn-line bg-bbn-surface">
      <div className="mx-auto w-full max-w-site px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <Link
              href={localizedPath(locale)}
              className="flex items-center gap-3"
            >
              <CrownLogo size="md" />
              <span
                aria-hidden="true"
                className="font-serif text-xl font-semibold text-bbn-champagne"
              >
                Brazilian Business Network
              </span>
            </Link>
            <p className="max-w-sm text-pretty leading-relaxed text-bbn-muted">
              {labels.tagline}
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label={labels.navLabel}>
            <h2 className="label-caps mb-5 text-bbn-gold">{labels.navLabel}</h2>
            <ul className="flex flex-col gap-3">
              {allNavItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={localizedPath(locale, item.route)}
                    className="text-sm text-bbn-muted transition-colors duration-200 hover:text-bbn-gold"
                  >
                    {labels.navLabels[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact + social */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="label-caps mb-5 text-bbn-gold">
                {labels.contactLabel}
              </h2>
              <ul className="flex flex-col gap-3 text-sm text-bbn-muted">
                {mail ? (
                  <li>
                    <a
                      href={mail}
                      className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-bbn-gold"
                    >
                      <Mail aria-hidden="true" className="size-4 shrink-0" />
                      {site.email}
                    </a>
                  </li>
                ) : null}
                {wa ? (
                  <li>
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-bbn-gold"
                    >
                      <MessageCircle aria-hidden="true" className="size-4 shrink-0" />
                      WhatsApp
                    </a>
                  </li>
                ) : null}
                <li className="inline-flex items-center gap-2">
                  <MapPin aria-hidden="true" className="size-4 shrink-0" />
                  {site.location.label}
                </li>
              </ul>
            </div>

            <div>
              <h2 className="label-caps mb-3 text-bbn-gold">
                {labels.followLabel}
              </h2>
              <div className="flex items-center gap-3">
                <SocialLinks
                  size="md"
                  labels={{
                    instagram: labels.instagram,
                    facebook: labels.facebook,
                  }}
                  className="-ml-3"
                />
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-bbn-muted transition-colors duration-200 hover:text-bbn-gold"
                >
                  {labels.handle}
                </a>
              </div>
            </div>
          </div>
        </div>

        <hr aria-hidden="true" className="rule-gold my-10 border-0" />

        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm text-bbn-muted">
            © {year} {site.name}. {labels.rights}
          </p>
          <ul className="flex items-center gap-4">
            {legalNavItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={localizedPath(locale, item.route)}
                  className="inline-flex min-h-11 items-center text-sm text-bbn-muted underline decoration-bbn-line underline-offset-4 transition-colors duration-200 hover:text-bbn-gold hover:decoration-bbn-gold"
                >
                  {labels.navLabels[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
