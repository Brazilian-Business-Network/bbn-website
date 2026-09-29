import type { ReactNode } from "react";

import { GoldHeading } from "@/components/brand/GoldHeading";
import { cn } from "@/lib/utils";

type NumberedCardProps = {
  /** 1-based position; rendered as 01, 02, 03 per the PDF. */
  index: number;
  title: string;
  children?: ReactNode;
  /** Small gold meta line under the title, e.g. frequency or leaders. */
  meta?: ReactNode;
  icon?: ReactNode;
  className?: string;
  /** `outline` draws the numeral as a large hollow figure behind the content. */
  numeralStyle?: "plate" | "outline";
};

/**
 * The numbered card from the institutional PDF: a gold 01 / 02 / 03, a serif
 * title and body copy, on a card surface with a hairline gold border.
 */
export function NumberedCard({
  index,
  title,
  children,
  meta,
  icon,
  className,
  numeralStyle = "plate",
}: NumberedCardProps) {
  const numeral = String(index).padStart(2, "0");

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-sm border border-bbn-line bg-bbn-card p-6 sm:p-8",
        "transition-colors duration-300 hover:border-bbn-line-strong",
        className,
      )}
    >
      {numeralStyle === "outline" ? (
        <span
          aria-hidden="true"
          className="numeral-outline pointer-events-none absolute -top-2 right-3 select-none text-7xl leading-none opacity-30 sm:text-8xl"
        >
          {numeral}
        </span>
      ) : null}

      <div className="relative flex flex-col gap-4">
        {/* Only render the row when it has something in it — an empty flex row
            still consumes the parent's gap. */}
        {numeralStyle === "plate" || icon ? (
          <div className="flex items-baseline gap-4">
            {numeralStyle === "plate" ? (
              // The numeral is the signature of the PDF's numbered cards, so it
              // reads as a display figure with the gold gradient, not as a label.
              <span
                aria-hidden="true"
                className="text-gold-gradient shrink-0 font-serif text-4xl font-bold leading-none sm:text-5xl"
              >
                {numeral}
              </span>
            ) : null}
            {icon ? (
              <span
                aria-hidden="true"
                className="self-center text-bbn-gold [&>svg]:size-6"
              >
                {icon}
              </span>
            ) : null}
          </div>
        ) : null}

        <GoldHeading as="h3" size="md">
          {title}
        </GoldHeading>

        {meta ? <div className="label-caps text-bbn-gold">{meta}</div> : null}

        {children ? (
          <div className="text-pretty leading-relaxed text-bbn-muted">{children}</div>
        ) : null}
      </div>
    </article>
  );
}
