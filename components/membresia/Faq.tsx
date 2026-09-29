import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type FaqEntry = { key: string; q: string; a: string };

/**
 * FAQ accordion. shadcn here is built on Base UI, so there is no `type` prop —
 * single-open is the default and `defaultValue` is an array.
 */
export function Faq({ items }: { items: FaqEntry[] }) {
  return (
    <Accordion className="w-full">
      {items.map((item) => (
        <AccordionItem key={item.key} value={item.key}>
          <AccordionTrigger className="text-left font-serif text-lg text-bbn-champagne">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="text-pretty leading-relaxed text-bbn-muted">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
