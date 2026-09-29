import { Container } from "@/components/brand/Container";
import { GoldHeading } from "@/components/brand/GoldHeading";
import { Section } from "@/components/brand/Section";
import { SectionLabel } from "@/components/brand/SectionLabel";

/** Shared opening band for every inner page, so they all start on the same beat. */
export function PageHero({
  label,
  title,
  intro,
}: {
  label: string;
  title: string;
  intro: string;
}) {
  return (
    <Section tone="black" vignette>
      <Container className="flex max-w-4xl flex-col gap-6">
        <SectionLabel>{label}</SectionLabel>
        <GoldHeading as="h1" size="display" variant="gradient">
          {title}
        </GoldHeading>
        <span aria-hidden="true" className="rule-gold w-full max-w-sm" />
        <p className="text-pretty text-lg leading-relaxed text-bbn-muted">
          {intro}
        </p>
      </Container>
    </Section>
  );
}
