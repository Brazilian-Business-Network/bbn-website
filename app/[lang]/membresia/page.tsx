import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/brand/Container";
import { GoldHeading } from "@/components/brand/GoldHeading";
import { IconCard } from "@/components/brand/IconCard";
import { NumberedCard } from "@/components/brand/NumberedCard";
import { PageHero } from "@/components/brand/PageHero";
import { Section } from "@/components/brand/Section";
import { SectionLabel } from "@/components/brand/SectionLabel";
import { Testimonials } from "@/components/brand/Testimonials";
import { SiteForm } from "@/components/forms/SiteForm";
import { Faq } from "@/components/membresia/Faq";
import { JourneyTimeline } from "@/components/membresia/JourneyTimeline";
import { BrandPhoto } from "@/components/media/BrandPhoto";
import { JsonLd } from "@/components/seo/JsonLd";
import { approvalSteps, faqKeys, guidelines } from "@/data/content";
import { photo, placements } from "@/data/media";
import { getDictionary } from "@/dictionaries";
import { isLocale, routes } from "@/lib/i18n";
import { buildMetadata, faqJsonLd, membershipOfferJsonLd } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/membresia">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);

  return buildMetadata({
    locale: lang,
    title: dict.meta.pages.membresia.title,
    description: dict.meta.pages.membresia.description,
    path: "membresia",
  });
}

export default async function MembresiaPage({
  params,
}: PageProps<"/[lang]/membresia">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  const faqItems = faqKeys.map((key) => ({
    key,
    q: dict.membresia.faqItems[key].q,
    a: dict.membresia.faqItems[key].a,
  }));
  const pricePhoto = photo(placements.membresia.price, lang);

  return (
    <>
      <JsonLd data={[membershipOfferJsonLd(lang), faqJsonLd(faqItems)]} />

      <PageHero
        label={dict.membresia.hero.label}
        title={dict.membresia.hero.title}
        intro={dict.membresia.hero.intro}
        photo={photo(placements.membresia.banner, lang)?.publicId}
      />

      {/* --------------------------------------------------------- Price card */}
      {/* With a photo the card and the group photo share the row; the card's
          note then stacks under the price instead of sitting beside it. */}
      <Section tone="surface" topRule>
        <Container
          className={
            pricePhoto ? "grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8" : undefined
          }
        >
          <div
            className={
              pricePhoto
                ? "flex flex-col justify-center gap-8 rounded-sm border border-bbn-line-strong bg-bbn-card p-8 sm:p-12"
                : "flex flex-col items-start gap-8 rounded-sm border border-bbn-line-strong bg-bbn-card p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between"
            }
          >
            <div className="flex flex-col gap-4">
              <SectionLabel>{dict.membresia.price.label}</SectionLabel>
              <p className="flex flex-wrap items-baseline gap-3">
                <span className="text-gold-gradient font-serif text-5xl font-bold sm:text-6xl">
                  {dict.membresia.price.amount}
                </span>
                <span className="label-caps text-bbn-gold">
                  {dict.membresia.price.unit}
                </span>
              </p>
            </div>

            <p
              className={
                pricePhoto
                  ? "text-pretty leading-relaxed text-bbn-muted border-t border-bbn-line pt-8"
                  : "max-w-md text-pretty leading-relaxed text-bbn-muted lg:border-l lg:border-bbn-line lg:pl-12"
              }
            >
              {dict.membresia.price.note}
            </p>
          </div>

          {pricePhoto ? (
            <BrandPhoto
              photo={pricePhoto}
              ratio="3/2"
              sizes="(min-width: 1280px) 600px, (min-width: 1024px) 47vw, 92vw"
              className="lg:aspect-auto lg:h-full lg:min-h-72"
            />
          ) : null}
        </Container>
      </Section>

      {/* ----------------------------------------------------- Approval steps */}
      <Section tone="black">
        <Container className="flex flex-col gap-12">
          <div className="flex max-w-3xl flex-col gap-5">
            <SectionLabel>{dict.membresia.approval.label}</SectionLabel>
            <GoldHeading as="h2" size="xl" variant="gradient">
              {dict.membresia.approval.title}
            </GoldHeading>
            <p className="text-pretty leading-relaxed text-bbn-muted">
              {dict.membresia.approval.intro}
            </p>
          </div>

          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {approvalSteps.map((step, index) => {
              const copy = dict.membresia.approvalSteps[step];

              return (
                <li key={step}>
                  <NumberedCard
                    index={index + 1}
                    title={copy.title}
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

      {/* ----------------------------------------------------- Member journey */}
      <Section tone="surface" topRule>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
              <SectionLabel>{dict.membresia.journey.label}</SectionLabel>
              <GoldHeading as="h2" size="xl">
                {dict.membresia.journey.title}
              </GoldHeading>
              <p className="text-pretty leading-relaxed text-bbn-muted">
                {dict.membresia.journey.intro}
              </p>
            </div>

            <JourneyTimeline steps={dict.membresia.journeySteps} />
          </div>
        </Container>
      </Section>

      {/* -------------------------------------------------------- Guidelines */}
      <Section tone="black">
        <Container className="flex flex-col gap-12">
          <div className="flex max-w-3xl flex-col gap-5">
            <SectionLabel>{dict.membresia.guidelines.label}</SectionLabel>
            <GoldHeading as="h2" size="xl">
              {dict.membresia.guidelines.title}
            </GoldHeading>
            <p className="text-pretty leading-relaxed text-bbn-muted">
              {dict.membresia.guidelines.intro}
            </p>
          </div>

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {guidelines.map((item) => {
              const copy = dict.membresia.guidelineItems[item.key];

              return (
                <li key={item.key}>
                  <IconCard icon={item.icon} title={copy.title} body={copy.body} />
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/* Between the black guidelines band and the surface FAQ; renders nothing
          until data/testimonials.ts has entries. */}
      <Testimonials locale={lang} labels={dict.testimonials} tone="card" />

      {/* --------------------------------------------------------------- FAQ */}
      <Section tone="surface" topRule>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div className="flex flex-col gap-5">
              <SectionLabel>{dict.membresia.faq.label}</SectionLabel>
              <GoldHeading as="h2" size="xl">
                {dict.membresia.faq.title}
              </GoldHeading>
            </div>

            <Faq items={faqItems} />
          </div>
        </Container>
      </Section>

      {/* -------------------------------------------------------------- Form */}
      <Section tone="black" vignette id="candidatura">
        <Container>
          <div className="mx-auto flex max-w-3xl flex-col gap-10">
            <div className="flex flex-col gap-5 text-center">
              <SectionLabel align="center">{dict.membresia.form.label}</SectionLabel>
              <GoldHeading as="h2" size="xl" variant="gradient">
                {dict.membresia.form.title}
              </GoldHeading>
              <p className="text-pretty leading-relaxed text-bbn-muted">
                {dict.membresia.form.intro}
              </p>
            </div>

            <SiteForm
              kind="membresia"
              locale={lang}
              page={routes.membresia}
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
                { name: "city", label: dict.forms.fields.city, required: true },
                { name: "company", label: dict.forms.fields.company },
                { name: "businessArea", label: dict.forms.fields.businessArea },
                { name: "website", label: dict.forms.fields.website },
                {
                  name: "motivation",
                  label: dict.forms.fields.motivation,
                  type: "textarea",
                  required: true,
                  minLength: 20,
                  placeholder: dict.forms.placeholders.motivation,
                },
              ]}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
