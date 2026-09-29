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
import { InstagramFeedGrid } from "@/components/home/InstagramFeedGrid";
import { Button } from "@/components/ui/button";
import { movements, pillars } from "@/data/content";
import { formatEventMonth, getNextEvent, registrationUrl } from "@/data/events";
import { getDictionary } from "@/dictionaries";
import { isLocale, localizedPath, routes } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

/** New Cloudinary uploads appear within the hour without a redeploy. */
export const revalidate = 3600;

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

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <Section tone="black" vignette className="overflow-hidden pt-20 lg:pt-28">
        <Container className="flex flex-col items-center text-center">
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
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="flex flex-col gap-6">
              <SectionLabel>{dict.home.purpose.label}</SectionLabel>
              <GoldHeading as="h2" size="xl">
                {dict.home.purpose.title}
              </GoldHeading>
              <p className="text-pretty text-lg leading-relaxed text-bbn-muted">
                {dict.home.purpose.body}
              </p>
            </div>

            <div className="flex flex-col gap-5 border-l-0 lg:border-l lg:border-bbn-line lg:pl-20">
              <SectionLabel>{dict.home.purpose.visionLabel}</SectionLabel>
              <p className="font-serif text-2xl leading-snug text-bbn-champagne sm:text-3xl">
                {dict.home.purpose.vision}
              </p>
            </div>
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

              return (
                <li key={pillar.key}>
                  <NumberedCard
                    index={index + 1}
                    title={copy.title}
                    meta={copy.frequency}
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
            labels={{
              eyebrow: dict.home.instagram.label,
              heading: dict.home.instagram.title,
              description: dict.home.instagram.intro,
              cta: dict.common.viewOnInstagram,
              ctaLabel: dict.home.instagram.ctaLabel,
              photoAlt: dict.home.instagram.photoAlt,
            }}
          />
        </Container>
      </Section>

      {/* ------------------------------------------------------ Testimonials */}
      <Testimonials locale={lang} labels={dict.testimonials} tone="card" />

      {/* -------------------------------------------------------- Membership */}
      <Section tone="black" vignette>
        <Container className="flex flex-col items-center gap-7 text-center">
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
