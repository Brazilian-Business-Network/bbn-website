import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/brand/Container";
import { CrownLogo } from "@/components/brand/CrownLogo";
import { GoldHeading } from "@/components/brand/GoldHeading";
import { IconCard } from "@/components/brand/IconCard";
import { PageHero } from "@/components/brand/PageHero";
import { Section } from "@/components/brand/Section";
import { SectionLabel } from "@/components/brand/SectionLabel";
import { BrandPhoto } from "@/components/media/BrandPhoto";
import { cultureValues, dimensions } from "@/data/content";
import { photo, photoList, placements } from "@/data/media";
import { getDictionary } from "@/dictionaries";
import { isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/sobre">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);

  return buildMetadata({
    locale: lang,
    title: dict.meta.pages.sobre.title,
    description: dict.meta.pages.sobre.description,
    path: "sobre",
  });
}

export default async function SobrePage({ params }: PageProps<"/[lang]/sobre">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const media = placements.sobre;
  const bandPhoto = photo(media.band, lang);
  const mosaic = photoList(media.mosaic, lang);

  return (
    <>
      <PageHero
        label={dict.sobre.hero.label}
        title={dict.sobre.hero.title}
        intro={dict.sobre.hero.intro}
        photo={photo(media.banner, lang)?.publicId}
      />

      {/* -------------------------------------------- Purpose and vision */}
      {/* With a photo: purpose, then a wide photo band, then vision offset to
          the right. Without one: the original two columns. */}
      <Section tone="surface" topRule>
        <Container>
          <div
            className={
              bandPhoto
                ? "flex flex-col gap-12 lg:gap-16"
                : "grid gap-12 lg:grid-cols-2 lg:gap-20"
            }
          >
            <div className="flex max-w-3xl flex-col gap-5">
              <SectionLabel>{dict.sobre.purpose.label}</SectionLabel>
              <GoldHeading as="h2" size="lg">
                {dict.sobre.purpose.title}
              </GoldHeading>
              <p className="text-pretty leading-relaxed text-bbn-muted">
                {dict.sobre.purpose.body}
              </p>
            </div>

            {bandPhoto ? (
              <BrandPhoto
                photo={bandPhoto}
                ratio="21/9"
                sizes="(min-width: 1280px) 1216px, 94vw"
              />
            ) : null}

            <div className={bandPhoto ? "flex max-w-3xl flex-col gap-5 lg:ml-auto" : "flex flex-col gap-5"}>
              <SectionLabel>{dict.sobre.vision.label}</SectionLabel>
              <GoldHeading as="h2" size="lg">
                {dict.sobre.vision.title}
              </GoldHeading>
              <p className="text-pretty leading-relaxed text-bbn-muted">
                {dict.sobre.vision.body}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------ Belief quote */}
      <Section tone="black" vignette>
        <Container className="flex flex-col items-center gap-8 text-center">
          <CrownLogo size="md" />
          <SectionLabel align="center">{dict.sobre.belief.label}</SectionLabel>

          <blockquote className="max-w-4xl">
            <p className="text-gold-gradient font-serif text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              &ldquo;{dict.sobre.belief.quote}&rdquo;
            </p>
            {dict.sobre.belief.attribution ? (
              <footer className="label-caps mt-8 text-bbn-gold">
                {dict.sobre.belief.attribution}
              </footer>
            ) : null}
          </blockquote>
        </Container>
      </Section>

      {/* -------------------------------------- O empreendedor por inteiro */}
      <Section tone="surface" topRule>
        <Container className="flex flex-col gap-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="flex max-w-3xl flex-col gap-5">
              <SectionLabel>{dict.sobre.whole.label}</SectionLabel>
              <GoldHeading as="h2" size="xl" variant="gradient">
                {dict.sobre.whole.title}
              </GoldHeading>
              <p className="text-pretty leading-relaxed text-bbn-muted">
                {dict.sobre.whole.intro}
              </p>
            </div>

            {/* Mosaic: one tall photo beside two squares. */}
            {mosaic.length === 3 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <BrandPhoto
                  photo={mosaic[0]}
                  ratio="1/2"
                  sizes="(min-width: 1280px) 290px, (min-width: 1024px) 23vw, 46vw"
                  className="row-span-2 aspect-auto h-full"
                />
                <BrandPhoto
                  photo={mosaic[1]}
                  ratio="1/1"
                  sizes="(min-width: 1280px) 290px, (min-width: 1024px) 23vw, 46vw"
                />
                <BrandPhoto
                  photo={mosaic[2]}
                  ratio="1/1"
                  sizes="(min-width: 1280px) 290px, (min-width: 1024px) 23vw, 46vw"
                />
              </div>
            ) : null}
          </div>

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {dimensions.map((dimension) => {
              const copy = dict.sobre.dimensions[dimension.key];

              return (
                <li key={dimension.key}>
                  <IconCard
                    icon={dimension.icon}
                    title={copy.title}
                    body={copy.body}
                  />
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/* ------------------------------------------------------------ Culture */}
      <Section tone="black">
        <Container className="flex flex-col gap-12">
          <div className="flex max-w-3xl flex-col gap-5">
            <SectionLabel>{dict.sobre.culture.label}</SectionLabel>
            <GoldHeading as="h2" size="xl">
              {dict.sobre.culture.title}
            </GoldHeading>
            <p className="text-pretty leading-relaxed text-bbn-muted">
              {dict.sobre.culture.intro}
            </p>
          </div>

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cultureValues.map((value) => {
              const copy = dict.sobre.cultureValues[value.key];

              return (
                <li key={value.key}>
                  <IconCard icon={value.icon} title={copy.title} body={copy.body} />
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>
    </>
  );
}
