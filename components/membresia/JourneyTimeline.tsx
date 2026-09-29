import { journeySteps } from "@/data/content";

/**
 * The member journey, Evento → Voluntário/Líder, as a vertical gold line.
 * An ordered list so the sequence is conveyed structurally, not just visually.
 */
export function JourneyTimeline({
  steps,
}: {
  steps: Record<(typeof journeySteps)[number], string>;
}) {
  return (
    <ol className="relative flex flex-col gap-0">
      {journeySteps.map((step, index) => {
        const isLast = index === journeySteps.length - 1;

        return (
          <li key={step} className="relative flex gap-6 pb-10 last:pb-0">
            {/* Gold rail + node */}
            <div className="relative flex flex-col items-center">
              <span
                aria-hidden="true"
                className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-bbn-gold bg-bbn-black"
              >
                <span className="label-caps text-[0.625rem] text-bbn-gold">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </span>
              {!isLast ? (
                <span
                  aria-hidden="true"
                  className="absolute top-10 h-full w-px bg-linear-to-b from-bbn-gold to-bbn-line"
                />
              ) : null}
            </div>

            <p className="pt-2 text-pretty leading-relaxed text-bbn-champagne">
              {steps[step]}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
