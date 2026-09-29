import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Send } from "lucide-react";

import { Container } from "@/components/brand/Container";
import { GoldHeading } from "@/components/brand/GoldHeading";
import { PageHero } from "@/components/brand/PageHero";
import { Section } from "@/components/brand/Section";
import { SectionLabel } from "@/components/brand/SectionLabel";
import { SiteForm } from "@/components/forms/SiteForm";
import { Button } from "@/components/ui/button";
import { emailUrl, site, whatsappUrl } from "@/data/site";
import { getDictionary } from "@/dictionaries";
import { isLocale, routes } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/contato">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);

  return buildMetadata({
    locale: lang,
    title: dict.meta.pages.contato.title,
    description: dict.meta.pages.contato.description,
    path: "contato",
  });
}

export default async function ContatoPage({ params }: PageProps<"/[lang]/contato">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  const wa = whatsappUrl();
  const mail = emailUrl();

  return (
    <>
      <PageHero
        label={dict.contato.hero.label}
        title={dict.contato.hero.title}
        intro={dict.contato.hero.intro}
      />

      {/* ----------------------------------------------------------- Channels */}
      <Section tone="surface" topRule>
        <Container className="flex flex-col gap-12">
          <div className="flex max-w-3xl flex-col gap-5">
            <SectionLabel>{dict.contato.channels.label}</SectionLabel>
            <GoldHeading as="h2" size="xl" variant="gradient">
              {dict.contato.channels.title}
            </GoldHeading>
          </div>

          {/* WhatsApp and e-mail cards render only once those values exist in
              data/site.ts. The form card is always there, so the list is never
              empty and there is always one way to reach the leadership. */}
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {wa ? (
              <li className="flex h-full flex-col gap-4 rounded-sm border border-bbn-line bg-bbn-card p-7">
                <span className="text-bbn-gold">
                  <MessageCircle aria-hidden="true" className="size-6" />
                </span>
                <GoldHeading as="h3" size="sm">
                  {dict.contato.channels.whatsapp}
                </GoldHeading>
                <Button
                  render={
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={dict.contato.channels.whatsappCtaAria}
                    />
                  }
                  nativeButton={false}
                  variant="outline"
                  className="mt-auto self-start"
                >
                  {dict.contato.channels.whatsappCta}
                </Button>
              </li>
            ) : null}

            {mail ? (
              <li className="flex h-full flex-col gap-4 rounded-sm border border-bbn-line bg-bbn-card p-7">
                <span className="text-bbn-gold">
                  <Mail aria-hidden="true" className="size-6" />
                </span>
                <GoldHeading as="h3" size="sm">
                  {dict.contato.channels.email}
                </GoldHeading>
                <p className="break-all text-bbn-muted">{site.email}</p>
                <Button
                  render={<a href={mail} />}
                  nativeButton={false}
                  variant="outline"
                  className="mt-auto self-start"
                >
                  {dict.contato.channels.emailCta}
                </Button>
              </li>
            ) : null}

            <li className="flex h-full flex-col gap-4 rounded-sm border border-bbn-line bg-bbn-card p-7">
              <span className="text-bbn-gold">
                <Send aria-hidden="true" className="size-6" />
              </span>
              <GoldHeading as="h3" size="sm">
                {dict.contato.channels.form}
              </GoldHeading>
              <p className="text-pretty leading-relaxed text-bbn-muted">
                {dict.contato.channels.formBody}
              </p>
              <Button
                render={<a href="#formulario" />}
                nativeButton={false}
                variant="outline"
                className="mt-auto self-start"
              >
                {dict.contato.channels.formCta}
              </Button>
            </li>

            <li className="flex h-full flex-col gap-4 rounded-sm border border-bbn-line bg-bbn-card p-7">
              <span className="text-bbn-gold">
                <MapPin aria-hidden="true" className="size-6" />
              </span>
              <GoldHeading as="h3" size="sm">
                {dict.contato.channels.location}
              </GoldHeading>
              <p className="text-bbn-muted">{site.location.label}</p>
            </li>
          </ul>
        </Container>
      </Section>

      {/* -------------------------------------------------------- Siga o BBN */}
      <Section tone="black" vignette>
        <Container className="flex flex-col gap-10">
          <div className="flex max-w-3xl flex-col gap-5">
            <SectionLabel>{dict.contato.social.label}</SectionLabel>
            <GoldHeading as="h2" size="xl">
              {dict.contato.social.title}
            </GoldHeading>
            <p className="text-pretty leading-relaxed text-bbn-muted">
              {dict.contato.social.intro}
            </p>
          </div>

          <ul className="grid gap-5 sm:grid-cols-2">
            <li>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={dict.common.instagramAria}
                className="group flex h-full items-center gap-5 rounded-sm border border-bbn-line bg-bbn-card p-7 transition-colors duration-300 hover:border-bbn-line-strong"
              >
                <Instagram
                  aria-hidden="true"
                  className="size-8 shrink-0 text-bbn-gold"
                />
                <span className="flex flex-col gap-1">
                  <span className="font-serif text-lg text-bbn-champagne">
                    Instagram
                  </span>
                  <span className="text-bbn-muted transition-colors duration-300 group-hover:text-bbn-gold">
                    {dict.contato.social.handle}
                  </span>
                </span>
              </a>
            </li>

            <li>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={dict.common.facebookAria}
                className="group flex h-full items-center gap-5 rounded-sm border border-bbn-line bg-bbn-card p-7 transition-colors duration-300 hover:border-bbn-line-strong"
              >
                <Facebook
                  aria-hidden="true"
                  className="size-8 shrink-0 text-bbn-gold"
                />
                <span className="flex flex-col gap-1">
                  <span className="font-serif text-lg text-bbn-champagne">
                    Facebook
                  </span>
                  <span className="text-bbn-muted transition-colors duration-300 group-hover:text-bbn-gold">
                    {site.name}
                  </span>
                </span>
              </a>
            </li>
          </ul>
        </Container>
      </Section>

      {/* -------------------------------------------------------------- Form */}
      {/* Closes on `card`: the preceding band is black and the footer is
          surface, so card is the one tone that stays distinct from both. */}
      <Section tone="card" topRule id="formulario">
        <Container>
          <div className="mx-auto flex max-w-3xl flex-col gap-10">
            <div className="flex flex-col gap-5 text-center">
              <SectionLabel align="center">{dict.contato.form.label}</SectionLabel>
              <GoldHeading as="h2" size="xl">
                {dict.contato.form.title}
              </GoldHeading>
              <p className="text-pretty leading-relaxed text-bbn-muted">
                {dict.contato.form.intro}
              </p>
            </div>

            <SiteForm
              kind="contato"
              locale={lang}
              page={routes.contato}
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
                { name: "subject", label: dict.forms.fields.subject, required: true },
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
