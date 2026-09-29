import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";

import { Container } from "@/components/brand/Container";
import { GoldHeading } from "@/components/brand/GoldHeading";
import { Section } from "@/components/brand/Section";
import { SectionLabel } from "@/components/brand/SectionLabel";
import { InstagramNote } from "@/components/eventos/InstagramNote";
import { PhotoGrid } from "@/components/eventos/PhotoGrid";
import { VideoSection } from "@/components/eventos/VideoSection";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  formatEventDate,
  getEventBySlug,
  getPastEvents,
  pastEvents,
} from "@/data/events";
import { describePhoto } from "@/data/media";
import { hasValue } from "@/data/site";
import { getDictionary, interpolate } from "@/dictionaries";
import { getEventMedia } from "@/lib/cloudinary";
import { isLocale, localizedPath, locales, routes } from "@/lib/i18n";
import {
  breadcrumbJsonLd,
  buildMetadata,
  eventCoverUrl,
  eventJsonLd,
} from "@/lib/seo";

/** New uploads to an existing folder appear within the hour, no redeploy. */
export const revalidate = 3600;

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    pastEvents.map((event) => ({ lang, slug: event.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/eventos/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};

  const event = getEventBySlug(slug);
  if (!event) return {};

  const copy = event.i18n[lang];

  return buildMetadata({
    locale: lang,
    title: copy.title,
    description: copy.description,
    path: `${routes.eventos}/${event.slug}`,
    image: eventCoverUrl(event) ?? undefined,
  });
}

export default async function EventDetailPage({
  params,
}: PageProps<"/[lang]/eventos/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const event = getEventBySlug(slug);
  if (!event) notFound();

  const dict = await getDictionary(lang);
  const copy = event.i18n[lang];
  // PhotoGrid renders images and short clips together; the lightbox plays both.
  // Catalogued photos get their curated alt text from data/media.ts.
  const media = (await getEventMedia(event.cloudinaryFolder)).map((item) => ({
    ...item,
    alt: describePhoto(item.publicId, lang),
  }));

  const hasVideos = event.videos.length > 0;
  const otherEditions = getPastEvents().filter((other) => other.slug !== event.slug);
  // Venue is optional and omitted entirely when absent.
  const location = [event.venue, event.city].filter((part) => hasValue(part)).join(" · ");

  return (
    <>
      <JsonLd
        data={[
          eventJsonLd(event, lang),
          breadcrumbJsonLd(lang, [
            { name: dict.nav.home, path: routes.home },
            { name: dict.nav.eventos, path: routes.eventos },
            { name: copy.title, path: `${routes.eventos}/${event.slug}` },
          ]),
        ]}
      />

      {/* --------------------------------------------------------------- Hero */}
      <Section tone="black" vignette className="pt-12 lg:pt-16">
        <Container className="flex max-w-4xl flex-col gap-6">
          <Link
            href={localizedPath(lang, routes.eventos)}
            className="label-caps -ml-2 inline-flex min-h-11 items-center gap-2 self-start px-2 py-2 text-bbn-muted transition-colors hover:text-bbn-gold"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            {dict.common.backToEvents}
          </Link>

          <SectionLabel>{dict.eventos.hero.label}</SectionLabel>

          <GoldHeading as="h1" size="display" variant="gradient">
            {copy.title}
          </GoldHeading>

          <span aria-hidden="true" className="rule-gold w-full max-w-sm" />

          <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <li className="inline-flex items-center gap-2 text-bbn-champagne">
              <CalendarDays aria-hidden="true" className="size-4 text-bbn-gold" />
              {formatEventDate(event, lang)}
            </li>
            {location ? (
              <li className="inline-flex items-center gap-2 text-bbn-champagne">
                <MapPin aria-hidden="true" className="size-4 text-bbn-gold" />
                {location}
              </li>
            ) : null}
          </ul>

          <p className="text-pretty text-lg leading-relaxed text-bbn-muted">
            {copy.description}
          </p>
        </Container>
      </Section>

      {/* ------------------------------------------------------------- Photos */}
      <Section tone="surface" topRule>
        <Container className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <SectionLabel>{dict.eventos.gallery.label}</SectionLabel>
            <GoldHeading as="h2" size="lg">
              {dict.eventos.gallery.photosTitle}
            </GoldHeading>
          </div>

          <PhotoGrid
            media={media}
            eventTitle={copy.title}
            labels={{
              photoAlt: dict.eventos.gallery.photoAlt,
              openPhoto: dict.eventos.gallery.openPhoto,
              empty: dict.eventos.gallery.empty,
              emptyHint: dict.eventos.gallery.emptyHint,
              lightbox: {
                title: interpolate(dict.eventos.gallery.lightboxTitle, {
                  title: copy.title,
                }),
                counter: dict.eventos.lightbox.counter,
                previous: dict.eventos.lightbox.previous,
                next: dict.eventos.lightbox.next,
                close: dict.eventos.lightbox.close,
              },
            }}
          />

          {/* Required line under every gallery. */}
          <InstagramNote
            text={dict.eventos.instagramNote}
            linkLabel={dict.eventos.instagramLinkLabel}
          />
        </Container>
      </Section>

      {/* ------------------------------------------------------------- Videos */}
      {hasVideos ? (
        <Section tone="black">
          <Container className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <SectionLabel>{dict.eventos.gallery.videosEyebrow}</SectionLabel>
              <GoldHeading as="h2" size="lg">
                {dict.eventos.gallery.videosTitle}
              </GoldHeading>
            </div>

            <VideoSection
              videos={event.videos}
              labels={{
                play: dict.eventos.lightbox.playVideo,
                close: dict.eventos.lightbox.close,
              }}
            />
          </Container>
        </Section>
      ) : null}

      {/* ------------------------------------------------- Other editions */}
      {otherEditions.length > 0 ? (
        <Section tone={hasVideos ? "surface" : "black"} topRule>
          <Container className="flex flex-col gap-8">
            <GoldHeading as="h2" size="lg">
              {dict.eventos.past.title}
            </GoldHeading>
            <ul className="flex flex-wrap gap-4">
              {otherEditions.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`${localizedPath(lang, routes.eventos)}/${other.slug}`}
                      className="inline-flex flex-col gap-1 rounded-sm border border-bbn-line bg-bbn-card px-5 py-4 transition-colors hover:border-bbn-line-strong"
                    >
                      <span className="font-serif text-bbn-champagne">
                        {other.i18n[lang].title}
                      </span>
                      <span className="text-sm text-bbn-muted">
                        {formatEventDate(other, lang)}
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
