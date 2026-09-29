import { Container } from "@/components/brand/Container";
import { GoldHeading } from "@/components/brand/GoldHeading";
import { Section } from "@/components/brand/Section";
import { SectionLabel } from "@/components/brand/SectionLabel";
import { PhotoBackdrop } from "@/components/media/PhotoBackdrop";
import type { PhotoId } from "@/data/media";

/**
 * Shared opening band for every inner page, so they all start on the same beat.
 * With `photo`, an event photo sits behind the title under a dark gradient
 * (decorative, alt=""); without it — Privacidade, or when Cloudinary isn't
 * configured — it is the plain black band with the gold vignette.
 */
export function PageHero({
  label,
  title,
  intro,
  photo,
}: {
  label: string;
  title: string;
  intro: string;
  photo?: PhotoId | null;
}) {
  return (
    <Section tone="black" vignette={!photo} className={photo ? "overflow-hidden" : undefined}>
      {photo ? <PhotoBackdrop publicId={photo} /> : null}
      {/* With a photo the text column aligns to the site container's left edge,
          so it sits over the darkest side of the gradient and the photo shows
          on the right. */}
      <Container className={photo ? "relative z-10" : "flex max-w-4xl flex-col gap-6"}>
        <div className={photo ? "flex max-w-4xl flex-col gap-6" : "contents"}>
          <SectionLabel>{label}</SectionLabel>
          <GoldHeading as="h1" size="display" variant="gradient">
            {title}
          </GoldHeading>
          <span aria-hidden="true" className="rule-gold w-full max-w-sm" />
          <p className="text-pretty text-lg leading-relaxed text-bbn-muted">
            {intro}
          </p>
        </div>
      </Container>
    </Section>
  );
}
