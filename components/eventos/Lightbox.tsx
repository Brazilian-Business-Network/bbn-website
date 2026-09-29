"use client";

import * as React from "react";
import { CldImage, getCldVideoUrl } from "next-cloudinary";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { interpolate } from "@/dictionaries";
import type { CloudMedia } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

/**
 * Full-screen viewer for one event's photos and clips.
 *
 * Built on the shadcn (Base UI) Dialog so focus trapping, Escape, scroll lock
 * and the `aria-modal` wiring come for free. On top of that this adds
 * ←/→ navigation with wrap-around, touch swipe, and a "3 de 12" counter.
 *
 * Every string arrives as a prop — the dictionaries own the copy.
 */

export type LightboxLabels = {
  /** Accessible dialog name. Template, e.g. "Galeria: {title}". */
  title: string;
  /** Position counter. Template with both tokens, e.g. "{current} de {total}". */
  counter: string;
  /** aria-label for the previous control. */
  previous: string;
  /** aria-label for the next control. */
  next: string;
  /** aria-label for the close control. */
  close: string;
  /** Alt text template, e.g. "{title} — foto {n}". */
  photoAlt: string;
};

/** Sensible ratio when Cloudinary reports no dimensions (rare, but possible). */
const FALLBACK_WIDTH = 1600;
const FALLBACK_HEIGHT = 1200;

/** Horizontal travel, in px, that counts as a swipe rather than a tap. */
const SWIPE_THRESHOLD = 48;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void): () => void {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** Read as an external store so the server snapshot is simply "no reduction". */
function useReducedMotion(): boolean {
  return React.useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

/* ==========================================================================
   Lightbox — controlled viewer
   ========================================================================== */

export function Lightbox({
  media,
  index,
  open,
  onOpenChange,
  onIndexChange,
  eventTitle,
  labels,
}: {
  media: CloudMedia[];
  /** Index of the clicked tile. */
  index: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIndexChange: (index: number) => void;
  eventTitle: string;
  labels: LightboxLabels;
}) {
  const total = media.length;
  const reducedMotion = useReducedMotion();
  const touchStartX = React.useRef<number | null>(null);

  const go = React.useCallback(
    (delta: number) => {
      if (total === 0) return;
      // Wrap-around in both directions.
      onIndexChange((index + delta + total) % total);
    },
    [index, onIndexChange, total],
  );

  // Arrow keys work wherever focus sits inside the dialog, so the listener goes
  // on the window while the dialog is open rather than on a single node.
  React.useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

      // A clip in the grid renders <video controls>, which uses the arrow keys to
      // seek. Stealing them there would make the player unusable, so let the
      // media element (or any form control) keep its own arrow handling.
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "VIDEO" ||
          target.tagName === "AUDIO" ||
          target.tagName === "INPUT" ||
          target.tagName === "SELECT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      event.preventDefault();
      go(event.key === "ArrowLeft" ? -1 : 1);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [go, open]);

  const current = media[index];
  if (!current) return null;

  const width = current.width || FALLBACK_WIDTH;
  const height = current.height || FALLBACK_HEIGHT;
  const alt =
    current.alt ??
    interpolate(labels.photoAlt, {
      title: eventTitle,
      n: index + 1,
    });

  return (
    <Dialog open={open} onOpenChange={(next) => onOpenChange(next)}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "max-h-[92vh] w-[calc(100%-1.5rem)] max-w-[min(96rem,96vw)]",
          "gap-3 border border-bbn-line bg-bbn-black/95 p-3 ring-0 sm:max-w-[min(96rem,92vw)] sm:p-4",
        )}
      >
        <DialogTitle className="sr-only">
          {interpolate(labels.title, { title: eventTitle })}
        </DialogTitle>

        <div
          className="relative flex min-h-0 items-center justify-center"
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            const start = touchStartX.current;
            touchStartX.current = null;
            if (start === null) return;
            const end = event.changedTouches[0]?.clientX;
            if (end === undefined) return;
            const delta = end - start;
            if (Math.abs(delta) < SWIPE_THRESHOLD) return;
            // Swipe left = next, swipe right = previous.
            go(delta < 0 ? 1 : -1);
          }}
        >
          {current.resourceType === "video" ? (
            <video
              // Remount on change so the browser loads the new source.
              key={current.publicId}
              className="max-h-[76vh] w-auto max-w-full rounded-sm border border-bbn-line"
              controls
              preload="metadata"
              playsInline
              src={getCldVideoUrl({ src: current.publicId })}
            />
          ) : (
            <CldImage
              key={current.publicId}
              src={current.publicId}
              width={width}
              height={height}
              sizes="(min-width: 1024px) 90vw, 100vw"
              alt={alt}
              className={cn(
                "h-auto max-h-[76vh] w-auto max-w-full rounded-sm object-contain",
                !reducedMotion && "transition-opacity duration-200",
              )}
              priority
            />
          )}

          {total > 1 && (
            <>
              <LightboxArrow
                direction="previous"
                label={labels.previous}
                onClick={() => go(-1)}
              />
              <LightboxArrow
                direction="next"
                label={labels.next}
                onClick={() => go(1)}
              />
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="label-caps text-bbn-muted" aria-live="polite">
            {interpolate(labels.counter, { current: index + 1, total })}
          </p>

          <button
            type="button"
            aria-label={labels.close}
            onClick={() => onOpenChange(false)}
            className="label-caps inline-flex h-11 cursor-pointer items-center rounded-sm border border-bbn-line px-5 text-bbn-champagne transition-colors hover:border-bbn-gold hover:text-bbn-gold-light"
          >
            {labels.close}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LightboxArrow({
  direction,
  label,
  onClick,
}: {
  direction: "previous" | "next";
  label: string;
  onClick: () => void;
}) {
  const Icon = direction === "previous" ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        // 44px hit area — this is the most touch-driven surface on the site.
        "absolute top-1/2 z-10 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-sm border border-bbn-line bg-bbn-black/70 text-bbn-champagne backdrop-blur-sm transition-colors",
        "hover:border-bbn-gold hover:text-bbn-gold-light",
        direction === "previous" ? "left-1 sm:left-3" : "right-1 sm:right-3",
      )}
    >
      <Icon className="size-5 sm:size-6" aria-hidden="true" />
    </button>
  );
}

/* ==========================================================================
   Provider + tile
   ==========================================================================
   The grid itself stays a server component: `LightboxProvider` only holds the
   open/index state and `LightboxTile` is the thin client button that wraps each
   server-rendered thumbnail.
   ========================================================================== */

type LightboxContextValue = {
  openAt: (index: number) => void;
};

const LightboxContext = React.createContext<LightboxContextValue | null>(null);

export function LightboxProvider({
  media,
  eventTitle,
  labels,
  children,
}: {
  media: CloudMedia[];
  eventTitle: string;
  labels: LightboxLabels;
  children: React.ReactNode;
}) {
  const [index, setIndex] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const value = React.useMemo<LightboxContextValue>(
    () => ({
      openAt: (next: number) => {
        setIndex(next);
        setOpen(true);
      },
    }),
    [],
  );

  return (
    <LightboxContext.Provider value={value}>
      {children}
      <Lightbox
        media={media}
        index={index}
        open={open}
        onOpenChange={setOpen}
        onIndexChange={setIndex}
        eventTitle={eventTitle}
        labels={labels}
      />
    </LightboxContext.Provider>
  );
}

/** Wraps one thumbnail. No-ops gracefully if used outside a provider. */
export function LightboxTile({
  index,
  label,
  className,
  children,
}: {
  index: number;
  /** aria-label, e.g. "Abrir foto 3 em tela cheia". */
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  const context = React.useContext(LightboxContext);

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => context?.openAt(index)}
      className={className}
    >
      {children}
    </button>
  );
}
