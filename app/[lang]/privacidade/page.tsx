import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink } from "lucide-react";

import { Container } from "@/components/brand/Container";
import { GoldHeading } from "@/components/brand/GoldHeading";
import { PageHero } from "@/components/brand/PageHero";
import { Section } from "@/components/brand/Section";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/dictionaries";
import { isLocale, localizedPath, routes } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

const FORMSPREE_PRIVACY_URL = "https://formspree.io/legal/privacy-policy";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/privacidade">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);

  return buildMetadata({
    locale: lang,
    title: dict.meta.pages.privacidade.title,
    description: dict.meta.pages.privacidade.description,
    path: "privacidade",
  });
}

export default async function PrivacidadePage({
  params,
}: PageProps<"/[lang]/privacidade">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const copy = dict.privacidade;
  const { coleta, formspree, direitos, ...rest } = copy.sections;

  return (
    <>
      <PageHero
        label={copy.hero.label}
        title={copy.hero.title}
        intro={copy.hero.intro}
      />

      {/* `card`: the footer below is surface. */}
      <Section tone="card" topRule>
        <Container className="flex max-w-3xl flex-col gap-14">
          <p className="label-caps text-bbn-muted">{copy.updated}</p>

          <PolicySection title={rest.quemSomos.title} body={rest.quemSomos.body} />

          <PolicySection title={coleta.title} body={coleta.body}>
            <ul className="flex flex-col gap-3">
              {coleta.items.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-bbn-ink">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-px w-4 shrink-0 bg-bbn-gold"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </PolicySection>

          <PolicySection title={rest.finalidade.title} body={rest.finalidade.body} />

          <PolicySection title={formspree.title} body={formspree.body}>
            <a
              href={FORMSPREE_PRIVACY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 self-start text-bbn-gold underline underline-offset-4 transition-colors hover:text-bbn-gold-light"
            >
              {copy.formspreeLinkLabel}
              <ExternalLink aria-hidden="true" className="size-4" />
              <span className="sr-only">{dict.common.opensNewTab}</span>
            </a>
          </PolicySection>

          <PolicySection title={rest.analytics.title} body={rest.analytics.body} />
          <PolicySection title={rest.fotos.title} body={rest.fotos.body} />
          <PolicySection
            title={rest.compartilhamento.title}
            body={rest.compartilhamento.body}
          />
          <PolicySection title={rest.retencao.title} body={rest.retencao.body} />

          <PolicySection title={direitos.title} body={direitos.body}>
            <div>
              <Button
                render={
                  <Link href={`${localizedPath(lang, routes.contato)}#formulario`} />
                }
                nativeButton={false}
                variant="outline"
                className="h-auto min-h-11 py-2.5 text-left whitespace-normal"
              >
                {copy.contactCta}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Button>
            </div>
          </PolicySection>
        </Container>
      </Section>
    </>
  );
}

function PolicySection({
  title,
  body,
  children,
}: {
  title: string;
  body: string[];
  children?: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5 border-t border-bbn-line pt-10 first-of-type:border-t-0 first-of-type:pt-0">
      <GoldHeading as="h2" size="md">
        {title}
      </GoldHeading>
      {body.map((paragraph) => (
        <p key={paragraph} className="text-pretty leading-relaxed text-bbn-ink">
          {paragraph}
        </p>
      ))}
      {children}
    </section>
  );
}
