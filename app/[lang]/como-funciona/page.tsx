import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, UsersRound } from "lucide-react";

import { Container } from "@/components/brand/Container";
import { GoldHeading } from "@/components/brand/GoldHeading";
import { BrandIcon } from "@/components/brand/icons";
import { PageHero } from "@/components/brand/PageHero";
import { Section } from "@/components/brand/Section";
import { SectionLabel } from "@/components/brand/SectionLabel";
import { SiteForm } from "@/components/forms/SiteForm";
import { BrandPhoto } from "@/components/media/BrandPhoto";
import { Button } from "@/components/ui/button";
import { pillars } from "@/data/content";
import { photo, placements } from "@/data/media";
import { getDictionary } from "@/dictionaries";
import { isLocale, localizedPath, routes } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/como-funciona">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);

  return buildMetadata({
    locale: lang,
    title: dict.meta.pages.comoFunciona.title,
    description: dict.meta.pages.comoFunciona.description,
    path: "como-funciona",
  });
}

export default async function ComoFuncionaPage({
  params,
}: PageProps<"/[lang]/como-funciona">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const media = placements.comoFunciona;

  return (
    <>
      <PageHero
        label={dict.comoFunciona.hero.label}
        title={dict.comoFunciona.hero.title}
        intro={dict.comoFunciona.hero.intro}
        photo={photo(media.banner, lang)?.publicId}
      />

      {/* ----------------------------------------------------- The 3 pillars */}
      <Section tone="surface" topRule>
        <Container>
          <ol className="flex flex-col gap-12 lg:gap-8">
            {pillars.map((pillar, index) => {
              const copy = dict.pillars[pillar.key];
              const numeral = String(index + 1).padStart(2, "0");

              const pillarPhoto = photo(media.pillars[pillar.key], lang);

              return (
                <li
                  key={pillar.key}
                  className={cn(
                    "grid gap-4 lg:gap-6",
                    pillarPhoto && "lg:grid-cols-2 lg:items-stretch",
                  )}
                >
                  {/* Photo beside the card, alternating sides on desktop;
                      stacked above it on mobile. */}
                  {pillarPhoto ? (
                    <BrandPhoto
                      photo={pillarPhoto}
                      ratio="3/2"
                      sizes="(min-width: 1280px) 600px, (min-width: 1024px) 47vw, 92vw"
                      className={cn(
                        "lg:aspect-auto lg:h-full lg:min-h-80",
                        index % 2 === 1 && "lg:order-last",
                      )}
                    />
                  ) : null}

                  <article className="group relative overflow-hidden rounded-sm border border-bbn-line bg-bbn-card p-8 transition-colors duration-300 hover:border-bbn-line-strong sm:p-12">
                    {/* Large hollow numeral, as on the institutional pages. */}
                    <span
                      aria-hidden="true"
                      className="numeral-outline pointer-events-none absolute -top-6 right-4 select-none text-[6rem] leading-none opacity-25 sm:text-[9rem]"
                    >
                      {numeral}
                    </span>

                    <div
                      className={cn(
                        "relative grid gap-8",
                        !pillarPhoto && "lg:grid-cols-[1fr_auto] lg:items-start lg:gap-16",
                      )}
                    >
                      <div className="flex flex-col gap-5">
                        <span className="flex items-center gap-4 text-bbn-gold">
                          <BrandIcon name={pillar.icon} />
                          <span className="label-caps">{numeral}</span>
                        </span>

                        <GoldHeading as="h2" size="lg" variant="gradient">
                          {copy.title}
                        </GoldHeading>

                        <p className="max-w-2xl text-pretty leading-relaxed text-bbn-muted">
                          {copy.body}
                        </p>
                      </div>

                      <dl
                        className={
                          pillarPhoto
                            ? "flex flex-wrap gap-x-12 gap-y-6 border-t border-bbn-line pt-6"
                            : "flex flex-col gap-6 border-t border-bbn-line pt-6 lg:min-w-56 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0"
                        }
                      >
                        <div>
                          <dt className="label-caps text-bbn-gold">
                            {dict.common.frequency}
                          </dt>
                          <dd className="mt-2 text-bbn-champagne">
                            {copy.frequency}
                          </dd>
                        </div>
                        <div>
                          <dt className="label-caps text-bbn-gold">
                            {dict.common.leaders}
                          </dt>
                          <dd className="mt-2 text-bbn-champagne">
                            {pillar.leaders.join(" · ")}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </Container>
      </Section>

      {/* ------------------------------------------- Visit a meeting (guests) */}
      {/* `card` tone: sits between the surface pillars and the black outro. */}
      <Section tone="card" topRule id="visita">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
              <SectionLabel>{dict.comoFunciona.visit.label}</SectionLabel>
              <GoldHeading as="h2" size="xl" variant="gradient">
                {dict.comoFunciona.visit.title}
              </GoldHeading>
              <p className="text-pretty leading-relaxed text-bbn-muted">
                {dict.comoFunciona.visit.intro}
              </p>
              <p className="flex items-start gap-3 rounded-sm border border-bbn-line-strong bg-bbn-black p-5 leading-relaxed text-bbn-champagne">
                <UsersRound
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-bbn-gold"
                />
                {dict.comoFunciona.visit.guestRule}
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <GoldHeading as="h3" size="md">
                {dict.comoFunciona.visit.formTitle}
              </GoldHeading>
              <SiteForm
                kind="visita"
                locale={lang}
                page={routes.comoFunciona}
                dict={dict}
                fields={[
                  {
                    name: "name",
                    label: dict.forms.fields.name,
                    required: true,
                    minLength: 3,
                  },
                  {
                    name: "email",
                    label: dict.forms.fields.email,
                    type: "email",
                    required: true,
                  },
                  {
                    name: "phone",
                    label: dict.forms.fields.phone,
                    type: "tel",
                    required: true,
                  },
                  {
                    name: "profession",
                    label: dict.forms.fields.profession,
                    required: true,
                  },
                  {
                    name: "hearAbout",
                    label: dict.forms.fields.hearAbout,
                    type: "select",
                    wide: true,
                    options: (
                      Object.keys(dict.forms.hearAboutOptions) as Array<
                        keyof typeof dict.forms.hearAboutOptions
                      >
                    ).map((key) => ({
                      value: key,
                      label: dict.forms.hearAboutOptions[key],
                    })),
                  },
                ]}
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* -------------------------------------------------------------- Outro */}
      <Section tone="black" vignette>
        <Container className="flex flex-col items-center gap-7 text-center">
          <SectionLabel align="center">{dict.membresia.hero.label}</SectionLabel>
          <GoldHeading as="h2" size="xl" className="max-w-3xl">
            {dict.comoFunciona.outro.title}
          </GoldHeading>
          <p className="max-w-2xl text-pretty leading-relaxed text-bbn-muted">
            {dict.comoFunciona.outro.body}
          </p>
          <Button
            render={<Link href={localizedPath(lang, routes.membresia)} />}
            nativeButton={false}
            size="lg"
          >
            {dict.comoFunciona.outro.button}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </Container>
      </Section>
    </>
  );
}
