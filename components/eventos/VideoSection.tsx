"use client";

import * as React from "react";
import Image from "next/image";
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import { PlayIcon } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { EventVideo } from "@/data/events";
import { interpolate } from "@/dictionaries";
import { cn } from "@/lib/utils";

/**
 * Long-form videos for one edition, listed in data/events.ts.
 *
 * Performance rule: a YouTube embed costs ~1MB and several third-party
 * requests, so nothing from youtube.com is loaded until the reader clicks. The
 * poster is a single static thumbnail from i.ytimg.com and the <iframe> is
 * mounted only while its dialog is open (and unmounted on close, which also
 * stops playback). The embed uses youtube-nocookie.com.
 */

export type VideoSectionLabels = {
  /** Optional section heading, e.g. "Vídeos". */
  heading?: string;
  /** Optional section label above the heading, e.g. "Assista". */
  eyebrow?: string;
  /** aria-label template for a poster, e.g. "Assistir {title}". */
  play: string;
  /** aria-label / text for the close control. */
  close: string;
};

export function VideoSection({
  videos,
  labels,
  className,
}: {
  videos: EventVideo[];
  labels: VideoSectionLabels;
  className?: string;
}) {
  // No videos, no section — an empty heading would read as a bug.
  if (videos.length === 0) return null;

  return (
    <section className={cn("flex flex-col gap-8", className)}>
      {(labels.eyebrow || labels.heading) && (
        <div className="flex flex-col gap-3">
          {labels.eyebrow && (
            <span className="label-caps text-bbn-gold">{labels.eyebrow}</span>
          )}
          {labels.heading && (
            <h2 className="text-2xl text-bbn-champagne sm:text-3xl">
              {labels.heading}
            </h2>
          )}
          <span aria-hidden="true" className="rule-gold-short" />
        </div>
      )}

      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <li key={video.kind === "youtube" ? video.id : video.publicId}>
            {video.kind === "youtube" ? (
              <YouTubeVideo video={video} labels={labels} />
            ) : (
              <CloudinaryVideo video={video} />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ==========================================================================
   YouTube — poster now, iframe only while open
   ========================================================================== */

function YouTubeVideo({
  video,
  labels,
}: {
  video: Extract<EventVideo, { kind: "youtube" }>;
  labels: VideoSectionLabels;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={interpolate(labels.play, { title: video.title })}
        onClick={() => setOpen(true)}
        className={cn(
          "group relative block w-full cursor-pointer overflow-hidden rounded-sm",
          "border border-bbn-line bg-bbn-card transition-[border-color,box-shadow] duration-300",
          "hover:border-bbn-gold hover:shadow-[0_0_0_1px_var(--color-bbn-gold),0_10px_40px_-12px_var(--color-bbn-gold-dark)]",
          "focus-visible:border-bbn-gold",
        )}
      >
        <span className="relative block aspect-video">
          <Image
            src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
            alt=""
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
            loading="lazy"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-bbn-black/35 transition-colors duration-300 group-hover:bg-bbn-black/20"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="flex size-14 items-center justify-center rounded-full border border-bbn-gold bg-bbn-black/70 text-bbn-gold-light transition-colors duration-300 group-hover:bg-bbn-gold group-hover:text-bbn-black">
              <PlayIcon className="size-5" />
            </span>
          </span>
        </span>

        <span className="block border-t border-bbn-line px-4 py-3 text-left font-serif text-base text-bbn-champagne">
          {video.title}
        </span>
      </button>

      <Dialog open={open} onOpenChange={(next) => setOpen(next)}>
        <DialogContent
          showCloseButton={false}
          className="w-[calc(100%-1.5rem)] max-w-[min(64rem,94vw)] gap-3 border border-bbn-line bg-bbn-black/95 p-3 ring-0 sm:max-w-[min(64rem,90vw)] sm:p-4"
        >
          <DialogTitle className="sr-only">{video.title}</DialogTitle>

          {/* Mounted only while `open` — zero youtube.com traffic before that. */}
          {open && (
            <div className="aspect-video w-full overflow-hidden rounded-sm border border-bbn-line bg-bbn-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="size-full border-0"
              />
            </div>
          )}

          <div className="flex items-center justify-end">
            <button
              type="button"
              aria-label={labels.close}
              onClick={() => setOpen(false)}
              className="label-caps inline-flex h-11 cursor-pointer items-center rounded-sm border border-bbn-line px-5 text-bbn-champagne transition-colors hover:border-bbn-gold hover:text-bbn-gold-light"
            >
              {labels.close}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ==========================================================================
   Cloudinary — inline native player
   ========================================================================== */

function CloudinaryVideo({
  video,
}: {
  video: Extract<EventVideo, { kind: "cloudinary" }>;
}) {
  return (
    <figure className="overflow-hidden rounded-sm border border-bbn-line bg-bbn-card">
      <video
        className="aspect-video w-full bg-bbn-black"
        controls
        preload="metadata"
        playsInline
        poster={getCldImageUrl({
          src: video.publicId,
          assetType: "video",
          format: "jpg",
          width: 1280,
        })}
        src={getCldVideoUrl({ src: video.publicId })}
        title={video.title}
      />
      <figcaption className="border-t border-bbn-line px-4 py-3 font-serif text-base text-bbn-champagne">
        {video.title}
      </figcaption>
    </figure>
  );
}

export default VideoSection;
