/**
 * Renders structured data. Next.js recommends a plain script tag for JSON-LD in
 * the App Router; `<` is escaped so a stray value can never break out of the
 * script element.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}
