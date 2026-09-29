"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { CrownLogo } from "@/components/brand/CrownLogo";
import { LangToggle } from "@/components/layout/LangToggle";
import { MobileNav } from "@/components/layout/MobileNav";
import { NavDropdown } from "@/components/layout/NavDropdown";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { Button } from "@/components/ui/button";
import { interpolate } from "@/dictionaries";
import {
  isActivePath,
  localizedPath,
  navTree,
  routes,
  utilityNav,
  type Locale,
} from "@/lib/i18n";
import { cn } from "@/lib/utils";

type HeaderProps = {
  locale: Locale;
  labels: {
    navLabels: Record<string, string>;
    sobreGroupLabel: string;
    /** Template with a {label} token. */
    openSubmenu: string;
    openMenu: string;
    closeMenu: string;
    menuLabel: string;
    mobileMenuLabel: string;
    becomeMember: string;
    langToggle: string;
    langPt: string;
    langEn: string;
    instagram: string;
    facebook: string;
  };
};

/**
 * Sticky header. Desktop shows five nav items — Início, Sobre (with a dropdown
 * for Sobre / Como funciona / Liderança), Eventos, Membresia, Parceiros — with
 * Contato as a text link beside the gold CTA. Eight top-level links was too
 * crowded to scan.
 */
export function Header({ locale, labels }: HeaderProps) {
  const pathname = usePathname() || localizedPath(locale);

  return (
    <header className="sticky top-0 z-40 border-b border-bbn-line bg-bbn-black/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-site items-center justify-between gap-6 px-5 sm:px-8">
        <Link
          href={localizedPath(locale)}
          className="flex shrink-0 items-center gap-3"
        >
          {/* The logo carries the "BBN" lettering and names the link via its alt. */}
          <CrownLogo size="sm" priority />
          {/* The letter-spaced wordmark needs ~170px; at 375px that would push
              the language toggle and menu button off-screen, so it starts at sm.
              aria-hidden: the logo's alt already gives the link its name. */}
          <span
            aria-hidden="true"
            className="label-caps hidden text-[0.625rem] leading-none text-bbn-gold sm:block lg:text-xs"
          >
            Brazilian Business Network
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav aria-label={labels.menuLabel} className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {navTree.map((node) => {
              const href = localizedPath(locale, node.route);

              if (node.children?.length) {
                const childActive = node.children.some((child) =>
                  isActivePath(pathname, locale, child.route),
                );

                return (
                  <NavDropdown
                    key={node.key}
                    href={href}
                    label={labels.navLabels[node.key]}
                    active={childActive}
                    groupLabel={labels.sobreGroupLabel}
                    submenuLabel={interpolate(labels.openSubmenu, {
                      label: labels.navLabels[node.key],
                    })}
                    items={node.children.map((child) => ({
                      href: localizedPath(locale, child.route),
                      label: labels.navLabels[child.key],
                      active: isActivePath(pathname, locale, child.route),
                    }))}
                  />
                );
              }

              const active = isActivePath(pathname, locale, node.route);

              return (
                <li key={node.key}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "label-caps py-2 transition-colors duration-200",
                      active ? "text-bbn-gold" : "text-bbn-ink hover:text-bbn-gold",
                    )}
                  >
                    {labels.navLabels[node.key]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <SocialLinks
            labels={{ instagram: labels.instagram, facebook: labels.facebook }}
            className="hidden sm:flex"
          />

          <LangToggle
            current={locale}
            labels={{
              toggle: labels.langToggle,
              pt: labels.langPt,
              en: labels.langEn,
            }}
          />

          {/* Contato sits outside the main nav, next to the CTA. */}
          {utilityNav.map((node) => {
            const active = isActivePath(pathname, locale, node.route);

            return (
              <Link
                key={node.key}
                href={localizedPath(locale, node.route)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "label-caps hidden px-2 py-2 transition-colors duration-200 lg:block",
                  active ? "text-bbn-gold" : "text-bbn-ink hover:text-bbn-gold",
                )}
              >
                {labels.navLabels[node.key]}
              </Link>
            );
          })}

          <Button
            render={<Link href={localizedPath(locale, routes.membresia)} />}
            nativeButton={false}
            className="hidden lg:inline-flex"
          >
            {labels.becomeMember}
          </Button>

          <MobileNav
            locale={locale}
            labels={{
              openMenu: labels.openMenu,
              closeMenu: labels.closeMenu,
              mobileMenuLabel: labels.mobileMenuLabel,
              navLabels: labels.navLabels,
              becomeMember: labels.becomeMember,
              instagram: labels.instagram,
              facebook: labels.facebook,
            }}
          />
        </div>
      </div>
    </header>
  );
}
