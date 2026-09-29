import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, UsersRound } from "lucide-react";

import { Container } from "@/components/brand/Container";
import { CrownLogo } from "@/components/brand/CrownLogo";
import { GoldHeading } from "@/components/brand/GoldHeading";
import { NumberedCard } from "@/components/brand/NumberedCard";
import { Section } from "@/components/brand/Section";
import { SectionLabel } from "@/components/brand/SectionLabel";
import { Testimonials } from "@/components/brand/Testimonials";
import { RegisterButton } from "@/components/eventos/RegisterButton";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { InstagramFeedGrid } from "@/components/home/InstagramFeedGrid";
import { BrandPhoto } from "@/components/media/BrandPhoto";
import { PhotoBackdrop } from "@/components/media/PhotoBackdrop";
import { Button } from "@/components/ui/button";
import { movements, pillars } from "@/data/content";
import { formatEventMonth, getNextEvent, registrationUrl } from "@/data/events";
import { photo, photoList, placements } from "@/data/media";
import { getDictionary } from "@/dictionaries";
import { isLocale, localizedPath, routes } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);

  return buildMetadata({
    locale: lang,
    title: dict.meta.pages.home.title,
    description: dict.meta.pages.home.description,
  });
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const nextEvent = getNextEvent();
  const registerHref = registrationUrl(nextEvent);
  const media = placements.home;
  const heroSlides = photoList(media.hero, lang);
  const purposePhoto = photo(media.purpose, lang);
  const ctaPhoto = photo(media.cta, lang);

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      {/* Photo carousel behind the copy; the bottom padding leaves room for its
          controls. Without Cloudinary it falls back to the plain vignette band. */}
      <Section
        tone="black"
        vignette={heroSlides.length === 0}
        className="overflow-hidden pt-20 pb-28 lg:pt-28 lg:pb-32"
      >
        {heroSlides.length > 0 ? (
          <HeroCarousel slides={heroSlides} labels={dict.home.hero.carousel} />
        ) : null}
        <Container className="relative z-10 flex flex-col items-center text-center">
          <CrownLogo size="xl" priority />

          <p className="label-caps mt-8 text-bbn-gold">{dict.home.hero.eyebrow}</p>

          <GoldHeading
            as="h1"
            size="display"
            variant="gradient"
            className="mt-5 max-w-4xl"
          >
            {dict.home.hero.title}
          </GoldHeading>

          <span aria-hidden="true" className="rule-gold my-8 w-full max-w-md" />

          <p className="max-w-2xl font-serif text-lg leading-relaxed text-bbn-champagne sm:text-xl">
            {dict.home.hero.tagline}
          </p>

          <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-bbn-muted">
            {dict.home.hero.intro}
          </p>

          <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Button
              render={<Link href={localizedPath(lang, routes.membresia)} />}
              nativeButton={false}
              size="lg"
            >
              {dict.common.becomeMember}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>

            {registerHref ? (
              <RegisterButton
                href={registerHref}
                label={dict.common.registerSpot}
                ariaLabel={dict.common.registerSpotAria}
              />
            ) : (
              <Button
                render={<Link href="#proximo-evento" />}
                nativeButton={false}
                variant="outline"
                size="lg"
              >
                <CalendarDays aria-hidden="true" className="size-4" />
                {dict.common.nextEvent}
              </Button>
            )}
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------------- Purpose */}
      <Section tone="surface" topRule>
        <Container>
          {/* Text left, networking photo right; the vision line moves under the
              purpose copy. Without a photo it keeps the two-column text layout. */}
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
            <div className="flex flex-col gap-6">
              <SectionLabel>{dict.home.purpose.label}</SectionLabel>
              <GoldHeading as="h2" size="xl">
                {dict.home.purpose.title}
              </GoldHeading>
              <p className="text-pretty text-lg leading-relaxed text-bbn-muted">
                {dict.home.purpose.body}
              </p>
              {purposePhoto ? (
                <div className="mt-4 flex flex-col gap-4 border-t border-bbn-line pt-8">
                  <SectionLabel>{dict.home.purpose.visionLabel}</SectionLabel>
                  <p className="font-serif text-2xl leading-snug text-bbn-champagne">
                    {dict.home.purpose.vision}
                  </p>
                </div>
              ) : null}
            </div>

            {purposePhoto ? (
              <BrandPhoto
                photo={purposePhoto}
                ratio="4/3"
                sizes="(min-width: 1280px) 580px, (min-width: 1024px) 45vw, 92vw"
              />
            ) : (
              <div className="flex flex-col gap-5 border-l-0 lg:border-l lg:border-bbn-line lg:pl-20">
                <SectionLabel>{dict.home.purpose.visionLabel}</SectionLabel>
                <p className="font-serif text-2xl leading-snug text-bbn-champagne sm:text-3xl">
                  {dict.home.purpose.vision}
                </p>
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* ----------------------------------------------------------- Movements */}
      <Section tone="black">
        <Container className="flex flex-col gap-12">
          <div className="flex max-w-3xl flex-col gap-5">
            <SectionLabel>{dict.home.movements.label}</SectionLabel>
            <GoldHeading as="h2" size="xl" variant="gradient">
              {dict.home.movements.title}
            </GoldHeading>
            <p className="text-pretty leading-relaxed text-bbn-muted">
              {dict.home.movements.intro}
            </p>
          </div>

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {movements.map((movement, index) => {
              const copy = dict.movements[movement.key];

              return (
                <li key={movement.key}>
                  <NumberedCard
                    index={index + 1}
                    title={copy.title}
                    numeralStyle="outline"
                    className="h-full"
                  >
                    {copy.body}
                  </NumberedCard>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/* ------------------------------------------------------------- Pillars */}
      <Section tone="surface" topRule>
        <Container className="flex flex-col gap-12">
          <div className="flex max-w-3xl flex-col gap-5">
            <SectionLabel>{dict.home.pillars.label}</SectionLabel>
            <GoldHeading as="h2" size="xl">
              {dict.home.pillars.title}
            </GoldHeading>
            <p className="text-pretty leading-relaxed text-bbn-muted">
              {dict.home.pillars.intro}
            </p>
          </div>

          <ul className="grid gap-5 lg:grid-cols-3">
            {pillars.map((pillar, index) => {
              const copy = dict.pillars[pillar.key];
              const pillarPhoto = photo(media.pillars[pillar.key], lang);

              return (
                <li key={pillar.key}>
                  <NumberedCard
                    index={index + 1}
                    title={copy.title}
                    meta={copy.frequency}
                    media={
                      pillarPhoto ? (
                        <BrandPhoto
                          photo={pillarPhoto}
                          ratio="3/2"
                          framed={false}
                          sizes="(min-width: 1280px) 400px, (min-width: 1024px) 31vw, 92vw"
                        />
                      ) : undefined
                    }
                    className="h-full"
                  >
                    <p>{copy.body}</p>
                    <p className="mt-4 text-sm text-bbn-muted">
                      <span className="label-caps text-bbn-gold">
                        {dict.common.leaders}
                      </span>{" "}
                      {pillar.leaders.join(" · ")}
                    </p>
                  </NumberedCard>
                </li>
              );
            })}
          </ul>

          <div>
            <Button
              render={<Link href={localizedPath(lang, routes.comoFunciona)} />}
              nativeButton={false}
              variant="outline"
            >
              {dict.common.learnMore}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------ Visit a meeting CTA */}
      {/* `card` tone: sits between a surface and a black band without matching either. */}
      <Section tone="card" topRule>
        <Container className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="flex max-w-2xl flex-col gap-4">
            <SectionLabel>{dict.home.visit.label}</SectionLabel>
            <GoldHeading as="h2" size="lg">
              {dict.home.visit.title}
            </GoldHeading>
            <p className="text-pretty leading-relaxed text-bbn-muted">
              {dict.home.visit.body}
            </p>
          </div>
          <Button
            render={<Link href={`${localizedPath(lang, routes.comoFunciona)}#visita`} />}
            nativeButton={false}
            variant="outline"
            size="lg"
            className="shrink-0"
          >
            <UsersRound aria-hidden="true" className="size-4" />
            {dict.home.visit.button}
          </Button>
        </Container>
      </Section>

      {/* ------------------------------------------------------- Next event */}
      <Section tone="black" id="proximo-evento">
        <Container>
          <div className="flex flex-col gap-8 rounded-sm border border-bbn-line bg-bbn-card p-8 sm:p-12">
            <SectionLabel>{dict.eventos.upcoming.label}</SectionLabel>

            {nextEvent ? (
              <>
                <GoldHeading as="h2" size="lg">
                  {formatEventMonth(nextEvent, lang)}
                </GoldHeading>
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
                    <p className="label-caps text-bbn-gold">
                      {dict.eventos.upcoming.tbd}
                    </p>
                    <p className="max-w-2xl text-pretty leading-relaxed text-bbn-muted">
                      {dict.eventos.upcoming.followCta}
                    </p>
                  </>
                )}
              </>
            ) : (
              <p className="text-bbn-muted">{dict.eventos.past.empty}</p>
            )}

            <div>
              <Button
                render={<Link href={localizedPath(lang, routes.eventos)} />}
                nativeButton={false}
                variant="outline"
              >
                {dict.nav.eventos}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------ Acompanhe nossos eventos */}
      <Section tone="surface" topRule>
        <Container>
          <InstagramFeedGrid
            photos={photoList(media.feed, lang)}
            labels={{
              eyebrow: dict.home.instagram.label,
              heading: dict.home.instagram.title,
              description: dict.home.instagram.intro,
              cta: dict.common.viewOnInstagram,
              ctaLabel: dict.home.instagram.ctaLabel,
            }}
          />
        </Container>
      </Section>

      {/* ------------------------------------------------------ Testimonials */}
      <Testimonials locale={lang} labels={dict.testimonials} tone="card" />

      {/* -------------------------------------------------------- Membership */}
      <Section
        tone="black"
        vignette={!ctaPhoto}
        className={ctaPhoto ? "overflow-hidden" : undefined}
      >
        {ctaPhoto ? <PhotoBackdrop publicId={ctaPhoto.publicId} variant="center" /> : null}
        <Container className="relative z-10 flex flex-col items-center gap-7 text-center">
          <CrownLogo size="md" />
          <GoldHeading as="h2" size="xl" variant="gradient" className="max-w-3xl">
            {dict.home.cta.title}
          </GoldHeading>
          <p className="max-w-2xl text-pretty leading-relaxed text-bbn-muted">
            {dict.home.cta.body}
          </p>
          <Button
            render={<Link href={localizedPath(lang, routes.membresia)} />}
            nativeButton={false}
            size="lg"
          >
            {dict.home.cta.button}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </Container>
      </Section>
    </>
  );
}
