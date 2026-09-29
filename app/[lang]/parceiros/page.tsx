import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/brand/Container";
import { GoldHeading } from "@/components/brand/GoldHeading";
import { NumberedCard } from "@/components/brand/NumberedCard";
import { BrandIcon } from "@/components/brand/icons";
import { PageHero } from "@/components/brand/PageHero";
import { Section } from "@/components/brand/Section";
import { SectionLabel } from "@/components/brand/SectionLabel";
import { SiteForm } from "@/components/forms/SiteForm";
import { partnerTypes } from "@/data/content";
import { getDictionary } from "@/dictionaries";
import { isLocale, routes } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/parceiros">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);

  return buildMetadata({
    locale: lang,
    title: dict.meta.pages.parceiros.title,
    description: dict.meta.pages.parceiros.description,
    path: "parceiros",
  });
}

export default async function ParceirosPage({
  params,
}: PageProps<"/[lang]/parceiros">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <>
      <PageHero
        label={dict.parceiros.hero.label}
        title={dict.parceiros.hero.title}
        intro={dict.parceiros.hero.intro}
      />

      {/* --------------------------------------------- Relationship hub (4) */}
      <Section tone="surface" topRule>
        <Container className="flex flex-col gap-12">
          <div className="flex max-w-3xl flex-col gap-5">
            <SectionLabel>{dict.parceiros.hub.label}</SectionLabel>
            <GoldHeading as="h2" size="xl" variant="gradient">
              {dict.parceiros.hub.title}
            </GoldHeading>
            <p className="text-pretty leading-relaxed text-bbn-muted">
              {dict.parceiros.hub.intro}
            </p>
          </div>

          <ul className="grid gap-5 sm:grid-cols-2">
            {partnerTypes.map((type, index) => {
              const copy = dict.parceiros.types[type.key];

              return (
                <li key={type.key}>
                  <NumberedCard
                    index={index + 1}
                    title={copy.title}
                    numeralStyle="outline"
                    icon={<BrandIcon name={type.icon} />}
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

      {/* -------------------------------------------------------------- Form */}
      <Section tone="black" vignette id="proposta">
        <Container>
          <div className="mx-auto flex max-w-3xl flex-col gap-10">
            <div className="flex flex-col gap-5 text-center">
              <SectionLabel align="center">{dict.parceiros.form.label}</SectionLabel>
              <GoldHeading as="h2" size="xl">
                {dict.parceiros.form.title}
              </GoldHeading>
              <p className="text-pretty leading-relaxed text-bbn-muted">
                {dict.parceiros.form.intro}
              </p>
            </div>

            <SiteForm
              kind="parceiros"
              locale={lang}
              page={routes.parceiros}
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
                { name: "phone", label: dict.forms.fields.phone, type: "tel" },
                { name: "company", label: dict.forms.fields.company, required: true },
                { name: "role", label: dict.forms.fields.role },
                { name: "city", label: dict.forms.fields.city, required: true },
                {
                  name: "partnerType",
                  label: dict.forms.fields.partnerType,
                  type: "select",
                  required: true,
                  options: partnerTypes.map((type) => ({
                    value: type.key,
                    label: dict.parceiros.types[type.key].title,
                  })),
                },
                { name: "website", label: dict.forms.fields.website },
                {
                  name: "message",
                  label: dict.forms.fields.message,
                  type: "textarea",
                  required: true,
                  minLength: 20,
                  placeholder: dict.forms.placeholders.message,
                },
              ]}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
