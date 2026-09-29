import type { Locale } from "@/lib/i18n";

/**
 * Event manifest. See README.md → "How to add a new event".
 *
 * Two shapes on purpose:
 *  - UpcomingEvent — announced but not yet held. Month and year only; we never
 *                    invent a day or a venue. Shows "data e local em breve", or a
 *                    "Garantir minha vaga" button once `registrationUrl` is set.
 *  - PastEvent     — happened, has a real date and a Cloudinary folder
 *                    (bbn/eventos/AAAA-MM-slug) holding its photos and clips.
 */

export type EventVideo =
  | { kind: "youtube"; id: string; title: string }
  | { kind: "cloudinary"; publicId: string; title: string };

export type EventCopy = {
  title: string;
  description: string;
};

export type UpcomingEvent = {
  /** 3 = March, 9 = September — the network meets twice a year. */
  month: 3 | 9;
  year: number;
  /**
   * Registration page (Eventbrite, Sympla, a Google Form…). Optional: when set,
   * a gold "Garantir minha vaga" button appears on the event card and in the
   * home hero; when absent the card keeps the "em breve" state.
   */
  registrationUrl?: string;
};

export type PastEvent = {
  /** URL segment and identity — matches the folder name, e.g. "2026-03-encontro-bbn". */
  slug: string;
  /** Cloudinary folder holding this edition's photos and short clips. */
  cloudinaryFolder: string;
  /** ISO date, e.g. "2026-03-21". */
  startDate: string;
  endDate?: string;
  /** City and state, e.g. "Danbury, CT". */
  city: string;
  /** Omit when there is no venue to publish — it is then left out of the page and JSON-LD. */
  venue?: string;
  /** Cloudinary public ID used as the card cover. Omit to use the first photo. */
  coverPublicId?: string;
  videos: EventVideo[];
  i18n: Record<Locale, EventCopy>;
};

/* --------------------------------------------------------------------------
   Upcoming
   -------------------------------------------------------------------------- */
export const upcomingEvents: UpcomingEvent[] = [{ month: 3, year: 2027 }];

/* --------------------------------------------------------------------------
   Past events — most recent first is not required; helpers sort by date.
   -------------------------------------------------------------------------- */
export const pastEvents: PastEvent[] = [
  {
    slug: "2026-03-encontro-bbn",
    cloudinaryFolder: "bbn/eventos/2026-03-encontro-bbn",
    startDate: "2026-03-21",
    city: "Danbury, CT",
    // Wide shot of the full room facing the stage — shows the network, not one speaker.
    coverPublicId: "440A7701_bipslx",
    videos: [],
    i18n: {
      pt: {
        title: "Encontro BBN — Março 2026",
        description:
          "O encontro de março reuniu empreendedores brasileiros em Danbury, Connecticut, para um dia de palestras, conversas no palco, exposição de empresas parceiras e networking.",
      },
      en: {
        title: "BBN Gathering — March 2026",
        description:
          "The March gathering brought Brazilian entrepreneurs together in Danbury, Connecticut, for a day of talks, on-stage conversations, partner exhibits and networking.",
      },
    },
  },
];

/* --------------------------------------------------------------------------
   Derived helpers
   -------------------------------------------------------------------------- */

/** Past editions, most recent first. */
export function getPastEvents(): PastEvent[] {
  return [...pastEvents].sort((a, b) => b.startDate.localeCompare(a.startDate));
}

export function getEventBySlug(slug: string): PastEvent | undefined {
  return pastEvents.find((event) => event.slug === slug);
}

/** The next edition, or null if none is announced. */
export function getNextEvent(): UpcomingEvent | null {
  const sorted = [...upcomingEvents].sort(
    (a, b) => a.year - b.year || a.month - b.month,
  );
  return sorted[0] ?? null;
}

/** Registration link for an upcoming event, only if it is a real http(s) URL. */
export function registrationUrl(event: UpcomingEvent | null): string | null {
  const url = event?.registrationUrl?.trim();
  return url && /^https?:\/\//i.test(url) ? url : null;
}

/** Month name for an upcoming event, in the reader's language. */
export function formatEventMonth(event: UpcomingEvent, locale: Locale): string {
  const formatter = new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return formatter.format(new Date(Date.UTC(event.year, event.month - 1, 1)));
}

/** Full date for a past event, in the reader's language. */
export function formatEventDate(event: PastEvent, locale: Locale): string {
  const formatter = new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return formatter.format(new Date(`${event.startDate}T00:00:00Z`));
}
