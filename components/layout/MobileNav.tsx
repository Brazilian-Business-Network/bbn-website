"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";

import { CrownLogo } from "@/components/brand/CrownLogo";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  allNavItems,
  isActivePath,
  localizedPath,
  routes,
  type Locale,
} from "@/lib/i18n";
import { cn } from "@/lib/utils";

type MobileNavProps = {
  locale: Locale;
  labels: {
    openMenu: string;
    closeMenu: string;
    mobileMenuLabel: string;
    navLabels: Record<string, string>;
    becomeMember: string;
    instagram: string;
    facebook: string;
  };
};

/**
 * Mobile navigation. Lists all eight pages flat — the desktop header groups
 * three of them under a "Sobre" dropdown, but nesting on a small screen just
 * adds taps.
 */
export function MobileNav({ locale, labels }: MobileNavProps) {
  const pathname = usePathname() || localizedPath(locale);
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);

  // Close the sheet once the route changes — covers browser back/forward as well
  // as the SheetClose on each link. Adjusting state during render (rather than in
  // an effect) avoids the extra render pass a post-commit setState would cause.
  if (open && pathname !== openedAt) {
    setOpen(false);
  }

  function handleOpenChange(next: boolean) {
    if (next) setOpenedAt(pathname);
    setOpen(next);
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={labels.openMenu}
            className="size-11 text-bbn-champagne lg:hidden"
          />
        }
      >
        <Menu aria-hidden="true" className="size-6" />
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full border-bbn-line bg-bbn-surface sm:max-w-sm"
      >
        <SheetHeader className="border-b border-bbn-line">
          <SheetTitle className="flex items-center gap-3 font-serif text-bbn-champagne">
            {/* The sheet's accessible name comes from the logo's alt; the
                visible wordmark is hidden from AT so it isn't read twice. */}
            <CrownLogo size="sm" />
            <span aria-hidden="true">Brazilian Business Network</span>
          </SheetTitle>
        </SheetHeader>

        <nav aria-label={labels.mobileMenuLabel} className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="flex flex-col">
            {allNavItems.map((item) => {
              const href = localizedPath(locale, item.route);
              const active = isActivePath(pathname, locale, item.route);

              return (
                <li key={href} className="border-b border-bbn-line/60 last:border-0">
                  <SheetClose
                    render={
                      <Link
                        href={href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "label-caps block py-4 transition-colors duration-200",
                          active
                            ? "text-bbn-gold"
                            : "text-bbn-ink hover:text-bbn-gold",
                        )}
                      />
                    }
                    nativeButton={false}
                  >
                    {labels.navLabels[item.key]}
                  </SheetClose>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex flex-col gap-6">
            <Button
              render={<Link href={localizedPath(locale, routes.membresia)} />}
              nativeButton={false}
              size="lg"
              className="w-full"
            >
              {labels.becomeMember}
            </Button>

            <SocialLinks
              size="md"
              labels={{ instagram: labels.instagram, facebook: labels.facebook }}
              className="justify-center"
            />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
