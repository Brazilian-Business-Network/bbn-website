import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/brand/Container";
import { CrownLogo } from "@/components/brand/CrownLogo";
import { GoldHeading } from "@/components/brand/GoldHeading";
import { Monogram } from "@/components/brand/Monogram";
import { NumberedCard } from "@/components/brand/NumberedCard";
import { BrandIcon } from "@/components/brand/icons";
import { PageHero } from "@/components/brand/PageHero";
import { Section } from "@/components/brand/Section";
import { SectionLabel } from "@/components/brand/SectionLabel";
import { leadershipCycle, pillars } from "@/data/content";
import { hasValue, site } from "@/data/site";
import { getDictionary } from "@/dictionaries";
import { isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/lideranca">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);

  return buildMetadata({
    locale: lang,
    title: dict.meta.pages.lideranca.title,
    description: dict.meta.pages.lideranca.description,
    path: "lideranca",
  });
}

export default async function LiderancaPage({
  params,
}: PageProps<"/[lang]/lideranca">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const presidentNamed = hasValue(site.president);

  return (
    <>
      <PageHero
        label={dict.lideranca.hero.label}
        title={dict.lideranca.hero.title}
        intro={dict.lideranca.hero.intro}
      />

      {/* ---------------------------------------------------------- Structure */}
      <Section tone="surface" topRule>
        <Container className="flex flex-col gap-12">
          <div className="flex max-w-3xl flex-col gap-5">
            <SectionLabel>{dict.lideranca.structure.label}</SectionLabel>
            <GoldHeading as="h2" size="xl" variant="gradient">
              {dict.lideranca.structure.title}
            </GoldHeading>
            <p className="text-pretty leading-relaxed text-bbn-muted">
              {dict.lideranca.structure.intro}
            </p>
          </div>

          {/* 1 General Leader + 2 leaders per pillar = 7 in year one. */}
          <div className="flex flex-col gap-6">
            <article className="flex flex-col items-center gap-4 rounded-sm border border-bbn-line-strong bg-bbn-card p-8 text-center sm:p-10">
              {/* No portraits by design: a gold monogram stands in permanently.
                  Until the president is named, the BBN logo marks the role alone —
                  no placeholder name is shown. */}
              <Monogram
                size="lg"
                name={presidentNamed ? site.president : undefined}
                icon={
                  presidentNamed ? undefined : (
                    <CrownLogo size="sm" alt="" className="h-10" />
                  )
                }
              />
              <p className="label-caps text-bbn-gold">
                {dict.lideranca.structure.generalLeader}
              </p>
              {presidentNamed ? (
                <GoldHeading as="h3" size="md">
                  {site.president}
                </GoldHeading>
              ) : null}
            </article>

            {/* Gold connector between the president and the pillar leaders. */}
            <span
              aria-hidden="true"
              className="mx-auto h-10 w-px bg-linear-to-b from-bbn-gold to-bbn-line"
            />

            <ul className="grid gap-5 lg:grid-cols-3">
              {pillars.map((pillar) => {
                const copy = dict.pillars[pillar.key];

                return (
                  <li
                    key={pillar.key}
                    className="flex h-full flex-col gap-4 rounded-sm border border-bbn-line bg-bbn-card p-6 sm:p-7"
                  >
                    <span className="text-bbn-gold">
                      <BrandIcon name={pillar.icon} />
                    </span>
                    <GoldHeading as="h3" size="sm">
                      {copy.title}
                    </GoldHeading>
                    <p className="label-caps text-bbn-gold">
                      {dict.lideranca.structure.pillarLeaders}
                    </p>
                    <ul className="flex flex-col gap-3">
                      {pillar.leaders.map((leader) => (
                        <li
                          key={leader}
                          className="flex items-center gap-3 text-bbn-champagne"
                        >
                          <Monogram name={leader} size="sm" />
                          {leader}
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </div>
        </Container>
      </Section>

      {/* -------------------------------------------------------------- Motto */}
      <Section tone="black" vignette>
        <Container className="flex flex-col items-center gap-8 text-center">
          <CrownLogo size="md" />
          <blockquote className="max-w-3xl">
            <p className="text-gold-gradient font-serif text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              &ldquo;{dict.lideranca.motto.quote}&rdquo;
            </p>
          </blockquote>
          <p className="max-w-2xl text-pretty leading-relaxed text-bbn-muted">
            {dict.lideranca.motto.body}
          </p>
        </Container>
      </Section>

      {/* ------------------------------------- Plan → Delegate → Execute → … */}
      {/* Closes on `card`: the motto band above is black and the footer is
          surface, so card is the one tone that stays distinct from both. */}
      <Section tone="card" topRule>
        <Container className="flex flex-col gap-12">
          <div className="flex max-w-3xl flex-col gap-5">
            <SectionLabel>{dict.lideranca.cycle.label}</SectionLabel>
            <GoldHeading as="h2" size="xl">
              {dict.lideranca.cycle.title}
            </GoldHeading>
            <p className="text-pretty leading-relaxed text-bbn-muted">
              {dict.lideranca.cycle.intro}
            </p>
          </div>

          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {leadershipCycle.map((step, index) => {
              const copy = dict.lideranca.cycleSteps[step];

              return (
                <li key={step}>
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
          </ol>
        </Container>
      </Section>
    </>
  );
}
