"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

import { CldImage } from "@/components/media/CldImage";
import { croppedSrcSet } from "@/components/media/croppedSrcSet";
import type { Photo } from "@/data/media";
import { cn } from "@/lib/utils";

const SLIDE_MS = 4000;

export type HeroCarouselLabels = {
  /** Region name, e.g. "Fotos do Encontro BBN". */
  label: string;
  /** "Foto {n} de {total}" */
  slide: string;
  /** "Mostrar a foto {n} de {total}" */
  goTo: string;
  pause: string;
  play: string;
};

const fill = (template: string, n: number, total: number) =>
  template.replace("{n}", String(n)).replace("{total}", String(total));

/**
 * Full-bleed crossfading photo carousel behind the home hero.
 *
 * - 4s per slide, 1s crossfade, slow 1 → 1.05 zoom; no sliding.
 * - Pauses on mouse hover, on focus anywhere in the hero, while the tab is
 *   hidden, and when the visitor presses pause. Pressing play again overrides
 *   hover/focus (focus stays on the button after the click) until the next pause.
 * - prefers-reduced-motion: only the first photo, no autoplay, no zoom, no
 *   controls.
 * - Performance: the server renders only slide 1 (fetchPriority="high", the
 *   LCP image). After hydration only the *next* slide is mounted, so each photo
 *   downloads about 4s before it is shown rather than all at once.
 *
 * Renders as an absolutely positioned layer: put it first inside a `relative`
 * hero and give the hero content `relative z-10`. Hover/focus are tracked on
 * that parent so the text on top still pauses the show.
 */
export function HeroCarousel({
  slides,
  labels,
}: {
  slides: Photo[];
  labels: HeroCarouselLabels;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [enhanced, setEnhanced] = useState(false); // autoplay + controls active
  // Slides whose <img> is in the DOM: the current one and the next one.
  const [mounted, setMounted] = useState<ReadonlySet<number>>(() => new Set([0]));
  const [userPaused, setUserPaused] = useState(false);
  const [resumed, setResumed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);

  const total = slides.length;
  const playing =
    enhanced && !hidden && !userPaused && (resumed || (!hovered && !focused));

  const mount = useCallback(
    (index: number) => {
      const next = (index + 1) % total;
      setMounted((current) =>
        current.has(index) && current.has(next)
          ? current
          : new Set([...current, index, next]),
      );
    },
    [total],
  );

  // Mount the rest of the show after first paint — unless motion is reduced.
  useEffect(() => {
    if (total < 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;
    const id = window.requestAnimationFrame(() => {
      setEnhanced(true);
      mount(0);
    });
    const onChange = () => {
      if (reduce.matches) {
        setEnhanced(false);
        setActive(0);
        setPrevious(null);
        setMounted(new Set([0]));
      }
    };
    reduce.addEventListener("change", onChange);
    return () => {
      window.cancelAnimationFrame(id);
      reduce.removeEventListener("change", onChange);
    };
  }, [total, mount]);

  // Hover and focus anywhere in the hero (the text sits above this layer).
  useEffect(() => {
    const host = rootRef.current?.parentElement;
    if (!host) return;
    // Mouse only: a tap fires pointerenter but never pointerleave, which would
    // freeze the show on touch screens.
    const enter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") setHovered(true);
    };
    const leave = (event: PointerEvent) => {
      if (event.pointerType === "mouse") setHovered(false);
    };
    const focusIn = () => setFocused(true);
    const focusOut = (event: FocusEvent) => {
      if (!host.contains(event.relatedTarget as Node | null)) setFocused(false);
    };
    host.addEventListener("pointerenter", enter);
    host.addEventListener("pointerleave", leave);
    host.addEventListener("focusin", focusIn);
    host.addEventListener("focusout", focusOut);
    return () => {
      host.removeEventListener("pointerenter", enter);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("focusin", focusIn);
      host.removeEventListener("focusout", focusOut);
    };
  }, []);

  useEffect(() => {
    const onVisibility = () => setHidden(document.visibilityState === "hidden");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const goTo = useCallback(
    (next: number) => {
      if (next === active) return;
      mount(next);
      setPrevious(active);
      setActive(next);
    },
    [active, mount],
  );

  // Autoplay: one timer per slide, restarted whenever the slide or state changes.
  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => goTo((active + 1) % total), SLIDE_MS);
    return () => window.clearTimeout(id);
  }, [playing, active, total, goTo]);

  // Drop the outgoing slide's zoom once its 1s fade has finished.
  useEffect(() => {
    if (previous === null) return;
    const id = window.setTimeout(() => setPrevious(null), 1100);
    return () => window.clearTimeout(id);
  }, [previous]);

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={labels.label}
      className="absolute inset-0"
    >
      <div aria-live={playing ? "off" : "polite"} className="absolute inset-0 overflow-hidden">
        {slides.map((slide, index) => {
          if (!mounted.has(index)) return null;
          const isActive = index === active;
          const zooming = enhanced && (isActive || index === previous);

          return (
            <div
              key={slide.publicId}
              role="group"
              aria-roledescription="slide"
              aria-label={fill(labels.slide, index + 1, total)}
              aria-hidden={!isActive}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-in-out motion-reduce:transition-none",
                isActive ? "opacity-100" : "opacity-0",
              )}
            >
              <div
                className={cn(
                  "size-full will-change-transform motion-reduce:animate-none",
                  zooming && "animate-kenburns",
                  !playing && "paused",
                )}
              >
                <picture className="block size-full">
                  <source
                    media="(max-width: 767px)"
                    srcSet={croppedSrcSet(slide.publicId, [9, 16])}
                    sizes="100vw"
                  />
                  <CldImage
                    src={slide.publicId}
                    width={2560}
                    height={1440}
                    crop="fill"
                    gravity="auto"
                    sizes="100vw"
                    alt={slide.alt}
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "low"}
                    className="size-full object-cover"
                  />
                </picture>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overlays. The linear layer follows the brand spec (85% bottom-left →
          40% top-right from lg; stronger below 1024px, where the copy spans
          nearly the full width); the scrim deepens it behind the centred copy so every
          text colour keeps WCAG AA over the brightest pixels. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-tr from-bbn-black/92 to-bbn-black/75 lg:from-bbn-black/85 lg:to-bbn-black/40"
      />
      <span aria-hidden="true" className="bbn-scrim-hero absolute inset-0" />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-bbn-black to-transparent"
      />

      {enhanced ? (
        <div className="absolute inset-x-0 bottom-4 z-20 flex items-center justify-center gap-1 sm:bottom-6">
          <button
            type="button"
            onClick={() => {
              setUserPaused(!userPaused);
              setResumed(userPaused);
            }}
            aria-label={userPaused ? labels.play : labels.pause}
            className="flex size-11 items-center justify-center rounded-full text-bbn-gold transition-colors hover:text-bbn-gold-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bbn-gold-light"
          >
            {userPaused ? (
              <Play aria-hidden="true" className="size-4 fill-current" />
            ) : (
              <Pause aria-hidden="true" className="size-4 fill-current" />
            )}
          </button>
          {slides.map((slide, index) => (
            <button
              key={slide.publicId}
              type="button"
              onClick={() => goTo(index)}
              aria-label={fill(labels.goTo, index + 1, total)}
              aria-current={index === active ? "true" : undefined}
              className="group flex size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-bbn-gold-light"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "block rounded-full transition-all duration-300",
                  index === active
                    ? "h-2 w-6 bg-bbn-gold"
                    : "size-2 bg-bbn-gold/60 group-hover:bg-bbn-gold/85",
                )}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
