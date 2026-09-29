import { GoldHeading } from "@/components/brand/GoldHeading";
import { BrandIcon, type IconName } from "@/components/brand/icons";
import { cn } from "@/lib/utils";

/** Card with a gold icon, serif title and body copy. Used across the content grids. */
export function IconCard({
  icon,
  title,
  body,
  className,
}: {
  icon: IconName;
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "flex h-full flex-col gap-4 rounded-sm border border-bbn-line bg-bbn-card p-6 sm:p-7",
        "transition-colors duration-300 hover:border-bbn-line-strong",
        className,
      )}
    >
      <span className="text-bbn-gold">
        <BrandIcon name={icon} />
      </span>
      <GoldHeading as="h3" size="sm">
        {title}
      </GoldHeading>
      <p className="text-pretty leading-relaxed text-bbn-muted">{body}</p>
    </article>
  );
}
