import Link from "next/link";

import { CrownLogo } from "@/components/brand/CrownLogo";
import { GoldHeading } from "@/components/brand/GoldHeading";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/dictionaries";
import { defaultLocale, localizedPath } from "@/lib/i18n";

/**
 * Root 404. Rendered outside the [lang] segment, so it falls back to Portuguese
 * — the default language of the network.
 */
export default async function NotFound() {
  const dict = await getDictionary(defaultLocale);

  return (
    <div className="bbn-vignette flex min-h-[70vh] flex-col items-center justify-center gap-8 px-5 py-24 text-center">
      <CrownLogo size="lg" />
      <div className="flex flex-col items-center gap-4">
        <p className="label-caps text-bbn-gold">404</p>
        <GoldHeading as="h1" size="xl" variant="gradient">
          {dict.notFound.title}
        </GoldHeading>
        <p className="max-w-md text-pretty leading-relaxed text-bbn-muted">
          {dict.notFound.body}
        </p>
      </div>
      <Button
        render={<Link href={localizedPath(defaultLocale)} />}
        nativeButton={false}
        size="lg"
      >
        {dict.notFound.button}
      </Button>
    </div>
  );
}
