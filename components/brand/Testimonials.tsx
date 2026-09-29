import { CldImage } from "@/components/media/CldImage";
import { Quote } from "lucide-react";

import { Container } from "@/components/brand/Container";
import { GoldHeading } from "@/components/brand/GoldHeading";
import { Monogram } from "@/components/brand/Monogram";
import { Section } from "@/components/brand/Section";
import { SectionLabel } from "@/components/brand/SectionLabel";
import { testimonials } from "@/data/testimonials";
import type { Locale } from "@/lib/i18n";

/**
 * Member testimonials. Renders nothing at all while data/testimonials.ts is
 * empty — no heading, no empty band — so it can sit on Início and Membresia
 * ahead of the first real quote.
 */
export function Testimonials({
  locale,
  labels,
  tone = "surface",
}: {
  locale: Locale;
  labels: { label: string; title: string; intro: string };
  tone?: "black" | "surface" | "card";
}) {
  if (testimonials.length === 0) return null;

  return (
    <Section tone={tone} topRule>
      <Container className="flex flex-col gap-12">
        <div className="flex max-w-3xl flex-col gap-5">
          <SectionLabel>{labels.label}</SectionLabel>
          <GoldHeading as="h2" size="xl">
            {labels.title}
          </GoldHeading>
          <p className="text-pretty leading-relaxed text-bbn-muted">{labels.intro}</p>
        </div>

        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <li key={item.name}>
              <figure className="flex h-full flex-col gap-6 rounded-sm border border-bbn-line bg-bbn-card p-7">
                <Quote aria-hidden="true" className="size-6 text-bbn-gold" />
                <blockquote className="flex-1 font-serif text-lg leading-relaxed text-bbn-champagne">
                  <p>{item.quote[locale]}</p>
                </blockquote>
                <figcaption className="flex items-center gap-4 border-t border-bbn-line pt-5">
                  {item.photo ? (
                    <CldImage
                      src={item.photo}
                      width={112}
                      height={112}
                      crop="fill"
                      gravity="face"
                      alt=""
                      className="size-14 shrink-0 rounded-full border border-bbn-gold object-cover"
                    />
                  ) : (
                    <Monogram name={item.name} />
                  )}
                  <span className="flex flex-col">
                    <span className="font-semibold text-bbn-champagne">{item.name}</span>
                    <span className="text-sm text-bbn-muted">{item.business}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
