/**
 * Which event photo appears where — the single place to change it.
 *
 * `photos` is the curated catalogue of the Cloudinary folder
 * bbn/eventos/2026-03-encontro-bbn: every public ID, what the photo shows, and
 * pt/en alt text describing what is actually in the frame. `placements` maps
 * site sections to those IDs. Components never hard-code a public ID.
 *
 * Rules (checked at build time by `assertNoRepeats` below):
 * - never the same photo twice on one page;
 * - landscape photos for wide areas (every photo in this set is 3:2);
 * - `usable: false` photos are kept in the event gallery but never placed.
 *
 * To swap a photo: change the ID in `placements`. To add photos from a new
 * event: add them to `photos` with a kind and alt text, then place them.
 */

import { pastEvents } from "@/data/events";
import type { Locale } from "@/lib/i18n";

export type PhotoKind =
  | "room" // wide room / audience
  | "stage" // speaker on stage
  | "networking" // people talking
  | "sponsor" // sponsor / exhibitor tables
  | "group" // group photo
  | "portrait"; // close-up portrait

type PhotoInfo = {
  kind: PhotoKind;
  alt: Record<Locale, string>;
  /** Present when the photo must not be placed on the site (gallery only). */
  unusable?: string;
};

export const photos = {
  "440A7379_dxvh3h": {
    kind: "sponsor",
    alt: {
      pt: "Mesa de expositor com letras em 3D, canecas, garrafas e materiais impressos de uma gráfica parceira",
      en: "Exhibitor table with 3D letters, mugs, bottles and printed samples from a partner print shop",
    },
  },
  "440A7436_zu5ey4": {
    kind: "sponsor",
    alt: {
      pt: "Crachás do BBN organizados sobre a mesa de credenciamento",
      en: "BBN name badges laid out on the registration table",
    },
    unusable: "The badges show attendees' full names.",
  },
  "440A7470_a3yl9l": {
    kind: "portrait",
    alt: {
      pt: "Um homem e uma mulher sorriem na mesa de credenciamento, ao lado dos crachás do BBN",
      en: "A man and a woman smile at the registration table beside the BBN name badges",
    },
  },
  "440A7475_m0buec": {
    kind: "networking",
    alt: {
      pt: "Participante do BBN dá entrevista com microfone diante do painel de um patrocinador",
      en: "A BBN attendee gives a microphone interview in front of a sponsor's backdrop",
    },
  },
  "440A7545_wxulur": {
    kind: "group",
    alt: {
      pt: "Quatro empreendedoras sorriem sentadas a uma mesa redonda, com o salão do evento ao fundo",
      en: "Four women entrepreneurs smile at a round table, with the event room behind them",
    },
  },
  "440A7548_ftermt": {
    kind: "group",
    alt: {
      pt: "Três participantes sorriem juntas à mesa durante o encontro",
      en: "Three attendees smile together at their table during the gathering",
    },
  },
  "440A7606_kp7nb6": {
    kind: "stage",
    alt: {
      pt: "Palestrante de terno fala ao microfone no palco, diante do telão",
      en: "A speaker in a suit talks into the microphone on stage in front of the screen",
    },
  },
  "440A7613_eprab3": {
    kind: "stage",
    alt: {
      pt: "Palestrante no palco mostra uma folha com QR code enquanto fala ao microfone",
      en: "A speaker on stage holds up a sheet with a QR code while talking into the microphone",
    },
  },
  "440A7644_jifx5i": {
    kind: "room",
    alt: {
      pt: "Participantes acompanham uma palestra sentados à mesa, com banners de patrocinadores ao fundo",
      en: "Attendees follow a talk from their table, with sponsor banners behind them",
    },
  },
  "440A7656_z0tcjv": {
    kind: "room",
    alt: {
      pt: "Palestrante no palco, visto de costas, fala para o salão cheio de participantes em mesas redondas",
      en: "A speaker, seen from behind on stage, addresses a full room of attendees at round tables",
    },
  },
  "440A7701_bipslx": {
    kind: "room",
    alt: {
      pt: "Vista do fundo do salão: o público em mesas redondas assiste a uma palestra no palco",
      en: "View from the back of the room: the audience at round tables watches a talk on stage",
    },
  },
  "440A7742_hk57gn": {
    kind: "stage",
    alt: {
      pt: "Palestrante fala ao microfone no palco enquanto o público acompanha em primeiro plano",
      en: "A speaker talks on stage while the audience listens in the foreground",
    },
  },
  "440A7754_l9blpw": {
    kind: "portrait",
    alt: {
      pt: "Palestrante de óculos gesticula enquanto fala ao microfone, com um flip chart ao fundo",
      en: "A speaker in glasses gestures while talking into the microphone, with a flip chart behind",
    },
  },
  "440A7759_fuk8ap": {
    kind: "stage",
    alt: {
      pt: "Palestrante apresenta ao lado de um flip chart com a frase “Atitude Mental Positiva”",
      en: "A speaker presents beside a flip chart that reads “Atitude Mental Positiva” (positive mental attitude)",
    },
  },
  "440A7788_b2ygav": {
    kind: "portrait",
    alt: {
      pt: "Participante de barba e paletó escuta com atenção, sentado entre outros convidados",
      en: "A bearded attendee in a blazer listens closely, seated among other guests",
    },
  },
  "440A7828_sgesye": {
    kind: "networking",
    alt: {
      pt: "Três homens conversam no palco, dois deles com microfone, diante do telão do evento",
      en: "Three men talk on stage, two of them holding microphones, in front of the event screen",
    },
  },
  "440A7905_xf3r8x": {
    kind: "stage",
    alt: {
      pt: "Painel com três convidados sentados no palco, observados pelo público em primeiro plano",
      en: "A panel of three guests seated on stage, watched by the audience in the foreground",
    },
  },
  "440A8029_atufbf": {
    kind: "portrait",
    alt: {
      pt: "Palestrante sorridente de blazer azul fala ao microfone",
      en: "A smiling speaker in a blue blazer talks into the microphone",
    },
  },
  "440A8043_dn4ux7": {
    kind: "stage",
    alt: {
      pt: "Palestrante no palco diante de um telão com o anúncio de um escritório de advocacia",
      en: "A speaker on stage in front of a screen showing a law firm's advertisement",
    },
    unusable: "The screen shows a third-party ad with phone numbers.",
  },
  "440A8329_uum5pw": {
    kind: "room",
    alt: {
      pt: "Palestrante no palco fala ao público, visto por trás das mesas",
      en: "A speaker on stage addresses the audience, seen from behind the tables",
    },
  },
  "440A8380_ma9kkq": {
    kind: "stage",
    alt: {
      pt: "Palestrante de camisa azul gesticula animado enquanto fala ao microfone",
      en: "A speaker in a blue shirt gestures energetically while talking into the microphone",
    },
  },
  "440A8457_nixfn2": {
    kind: "group",
    alt: {
      pt: "Duas mulheres sorriem abraçadas no palco",
      en: "Two women smile arm in arm on stage",
    },
    unusable: "Harsh stage light blows out one face.",
  },
} as const satisfies Record<string, PhotoInfo>;

export type PhotoId = keyof typeof photos;

/* --------------------------------------------------------------------------
   Placements — edit these to change which photo appears where.
   -------------------------------------------------------------------------- */
export const placements = {
  home: {
    /** Hero carousel, in order. The first slide is the LCP image. */
    hero: [
      "440A7701_bipslx",
      "440A7742_hk57gn",
      "440A7905_xf3r8x",
      "440A7545_wxulur",
      "440A7606_kp7nb6",
      "440A7828_sgesye",
    ],
    purpose: "440A7548_ftermt",
    pillars: {
      eventos: "440A7656_z0tcjv",
      reunioes: "440A7475_m0buec",
      treinamentos: "440A7759_fuk8ap",
    },
    /** "Acompanhe nossos eventos" grid (square crops). */
    feed: [
      "440A7470_a3yl9l",
      "440A7788_b2ygav",
      "440A8380_ma9kkq",
      "440A7644_jifx5i",
      "440A8029_atufbf",
      "440A7379_dxvh3h",
    ],
    /** Membership CTA band background (decorative). */
    cta: "440A8329_uum5pw",
  },
  sobre: {
    banner: "440A7656_z0tcjv",
    band: "440A7701_bipslx",
    mosaic: ["440A7545_wxulur", "440A7754_l9blpw", "440A7470_a3yl9l"],
  },
  comoFunciona: {
    banner: "440A7742_hk57gn",
    pillars: {
      eventos: "440A7656_z0tcjv",
      reunioes: "440A7644_jifx5i",
      treinamentos: "440A7759_fuk8ap",
    },
  },
  membresia: {
    banner: "440A7905_xf3r8x",
    price: "440A7545_wxulur",
  },
  eventos: {
    banner: "440A7656_z0tcjv",
  },
  parceiros: {
    banner: "440A7379_dxvh3h",
  },
  lideranca: {
    banner: "440A7828_sgesye",
  },
  contato: {
    banner: "440A7470_a3yl9l",
    band: "440A7548_ftermt",
  },
} as const satisfies Record<string, Record<string, PlacementValue>>;

type PlacementValue =
  | PhotoId
  | readonly PhotoId[]
  | Readonly<Record<string, PhotoId>>;

/* --------------------------------------------------------------------------
   Lookup
   -------------------------------------------------------------------------- */

export type Photo = { publicId: PhotoId; alt: string };

/**
 * Photos render only when Cloudinary is configured; without a cloud name every
 * helper returns null / [] and sections fall back to their photo-less layout.
 */
export const mediaEnabled = Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);

export function photo(id: PhotoId, locale: Locale): Photo | null {
  if (!mediaEnabled) return null;
  return { publicId: id, alt: photos[id].alt[locale] };
}

export function photoList(ids: readonly PhotoId[], locale: Locale): Photo[] {
  if (!mediaEnabled) return [];
  return ids.map((id) => ({ publicId: id, alt: photos[id].alt[locale] }));
}

/** Curated alt text for any catalogued public ID (used by the event gallery). */
export function describePhoto(publicId: string, locale: Locale): string | undefined {
  return publicId in photos ? photos[publicId as PhotoId].alt[locale] : undefined;
}

/* --------------------------------------------------------------------------
   Build-time guard: no repeats on a page, no unusable photos placed.
   -------------------------------------------------------------------------- */

function collect(value: PlacementValue): PhotoId[] {
  if (typeof value === "string") return [value as PhotoId];
  if (Array.isArray(value)) return [...(value as readonly PhotoId[])];
  return Object.values(value as Record<string, PhotoId>);
}

function assertNoRepeats() {
  for (const [page, sections] of Object.entries(placements)) {
    const ids = Object.values(sections).flatMap(collect);
    // Event cards on /eventos show their cover, so it counts toward that page.
    if (page === "eventos") {
      for (const event of pastEvents) {
        if (event.coverPublicId) ids.push(event.coverPublicId as PhotoId);
      }
    }
    const seen = new Set<string>();
    for (const id of ids) {
      if (seen.has(id)) {
        throw new Error(`data/media.ts: photo ${id} appears twice on "${page}".`);
      }
      seen.add(id);
      const info: PhotoInfo | undefined = photos[id];
      if (info?.unusable) {
        throw new Error(`data/media.ts: photo ${id} is marked unusable (${info.unusable}).`);
      }
    }
  }
}

assertNoRepeats();
