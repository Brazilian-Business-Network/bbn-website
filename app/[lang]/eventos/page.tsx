import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarClock } from "lucide-react";

import { Container } from "@/components/brand/Container";
import { GoldHeading } from "@/components/brand/GoldHeading";
import { PageHero } from "@/components/brand/PageHero";
import { Section } from "@/components/brand/Section";
import { SectionLabel } from "@/components/brand/SectionLabel";
import { EventCard } from "@/components/eventos/EventCard";
import { InstagramNote } from "@/components/eventos/InstagramNote";
import { RegisterButton } from "@/components/eventos/RegisterButton";
import {
  formatEventMonth,
  getNextEvent,
  getPastEvents,
  registrationUrl,
} from "@/data/events";
import { getDictionary } from "@/dictionaries";
import { isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

/** Covers are resolved from Cloudinary, so refresh hourly. */
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/eventos">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);

  return buildMetadata({
    locale: lang,
    title: dict.meta.pages.eventos.title,
    description: dict.meta.pages.eventos.description,
    path: "eventos",
  });
}

export default async function EventosPage({ params }: PageProps<"/[lang]/eventos">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const nextEvent = getNextEvent();
  const registerHref = registrationUrl(nextEvent);
  const past = getPastEvents();

  return (
    <>
      <PageHero
        label={dict.eventos.hero.label}
        title={dict.eventos.hero.title}
        intro={dict.eventos.hero.intro}
      />

      {/* ------------------------------------------------------ Next edition */}
      {nextEvent ? (
        <Section tone="surface" topRule>
          <Container>
            <div className="flex flex-col gap-6 rounded-sm border border-bbn-line-strong bg-bbn-card p-8 sm:p-12">
              <SectionLabel>{dict.eventos.upcoming.label}</SectionLabel>

              <div className="flex flex-col gap-3">
                <GoldHeading as="h2" size="xl" variant="gradient">
                  {dict.eventos.upcoming.title}
                </GoldHeading>
                <p className="font-serif text-2xl capitalize text-bbn-champagne sm:text-3xl">
                  {formatEventMonth(nextEvent, lang)}
                </p>
              </div>

              {registerHref ? (
                <div>
                  <RegisterButton
                    href={registerHref}
                    label={dict.common.registerSpot}
                    ariaLabel={dict.common.registerSpotAria}
                  />
                </div>
              ) : (
                <>
                  {/* No registration link yet — say so plainly rather than
                      inventing a date or a venue. */}
                  <p className="label-caps inline-flex items-center gap-2 text-bbn-gold">
                    <CalendarClock aria-hidden="true" className="size-4" />
                    {dict.eventos.upcoming.tbd}
                  </p>

                  <p className="max-w-2xl text-pretty leading-relaxed text-bbn-muted">
                    {dict.eventos.upcoming.followCta}
                  </p>
                </>
              )}

              <InstagramNote
                text={dict.eventos.instagramNote}
                linkLabel={dict.eventos.instagramLinkLabel}
              />
            </div>
          </Container>
        </Section>
      ) : null}

      {/* ------------------------------------------------------ Past editions */}
      <Section tone="black">
        <Container className="flex flex-col gap-12">
          <div className="flex max-w-3xl flex-col gap-5">
            <SectionLabel>{dict.eventos.past.label}</SectionLabel>
            <GoldHeading as="h2" size="xl">
              {dict.eventos.past.title}
            </GoldHeading>
            <p className="text-pretty leading-relaxed text-bbn-muted">
              {dict.eventos.past.intro}
            </p>
          </div>

          {past.length > 0 ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((event) => (
                <li key={event.slug}>
                  <EventCard
                    event={event}
                    locale={lang}
                    labels={{
                      viewGallery: dict.eventos.gallery.viewGallery,
                      coverAlt: dict.eventos.gallery.coverAlt,
                    }}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="max-w-2xl rounded-sm border border-dashed border-bbn-line bg-bbn-card p-8 text-pretty leading-relaxed text-bbn-muted">
              {dict.eventos.past.empty}
            </p>
          )}
        </Container>
      </Section>
    </>
  );
}
