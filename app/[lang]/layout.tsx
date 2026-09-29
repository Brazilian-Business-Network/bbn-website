import "../globals.css";

import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { JsonLd } from "@/components/seo/JsonLd";
import { getDictionary } from "@/dictionaries";
import { fontVariables } from "@/lib/fonts";
import { htmlLang, isLocale, locales } from "@/lib/i18n";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  const navLabels: Record<string, string> = {
    home: dict.nav.home,
    sobre: dict.nav.sobre,
    comoFunciona: dict.nav.comoFunciona,
    membresia: dict.nav.membresia,
    eventos: dict.nav.eventos,
    parceiros: dict.nav.parceiros,
    lideranca: dict.nav.lideranca,
    contato: dict.nav.contato,
    privacidade: dict.nav.privacidade,
  };

  return (
    // This is the root layout: it lives under the [lang] segment so that <html
    // lang> reflects the page's actual language rather than a fixed default.
    <html lang={htmlLang[lang]} className={`${fontVariables} dark h-full`}>
      <body className="flex min-h-full flex-col bg-bbn-black text-bbn-ink antialiased">
        {/* Organization + WebSite schema, emitted once for the whole site. */}
        <JsonLd data={[organizationJsonLd(lang), websiteJsonLd(lang)]} />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-bbn-gold focus:px-4 focus:py-2 focus:font-semibold focus:text-bbn-black"
        >
          {dict.nav.skipToContent}
        </a>

        <Header
          locale={lang}
          labels={{
            navLabels,
            sobreGroupLabel: dict.nav.sobreGroupLabel,
            openSubmenu: dict.nav.openSubmenu,
            openMenu: dict.nav.openMenu,
            closeMenu: dict.nav.closeMenu,
            menuLabel: dict.nav.menuLabel,
            mobileMenuLabel: dict.nav.mobileMenuLabel,
            becomeMember: dict.common.becomeMember,
            langToggle: dict.nav.langToggleLabel,
            langPt: dict.nav.langPt,
            langEn: dict.nav.langEn,
            instagram: dict.common.instagramAria,
            facebook: dict.common.facebookAria,
          }}
        />

        <main id="main" className="flex-1">
          {children}
        </main>

        <Footer
          locale={lang}
          labels={{
            tagline: dict.footer.tagline,
            navLabel: dict.footer.navLabel,
            contactLabel: dict.footer.contactLabel,
            followLabel: dict.footer.followLabel,
            rights: dict.footer.rights,
            navLabels,
            instagram: dict.common.instagramAria,
            facebook: dict.common.facebookAria,
            handle: dict.contato.social.handle,
          }}
        />

        {/* Renders nothing until data/site.ts has a WhatsApp number. */}
        <WhatsAppFloat label={dict.common.whatsappFloatAria} />

        {/* Cookieless, aggregated page views; a no-op outside Vercel. */}
        <Analytics />
      </body>
    </html>
  );
}
