# Brazilian Business Network — Website

Institutional site for the BBN. Portuguese-first with a PT/EN toggle, dark-and-gold brand identity, and an event gallery backed by Cloudinary.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 · shadcn/ui (Base UI) · next-cloudinary · Formspree · Vercel

---

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then fill it in — see below
npm run dev                        # http://localhost:3000
```

`/` redirects to the reader's preferred language, defaulting to Portuguese: `/pt`, `/en`.

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build — run before every commit |
| `npm run lint` | ESLint |
| `npx next typegen` | Regenerate route types — **run after adding or renaming a route** |

---

## Environment variables

Copy `.env.local.example` to `.env.local` and fill these in. `.env.local` is gitignored; never commit real values.

| Variable | Required | What it is |
| --- | --- | --- |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | for media | Cloudinary cloud name (Dashboard → Product Environment). Public — it appears in every image URL. |
| `CLOUDINARY_API_KEY` | for media | Server-only. Used by the Search API that lists event folders. |
| `CLOUDINARY_API_SECRET` | for media | Server-only. **Never** prefix with `NEXT_PUBLIC_`. |
| `NEXT_PUBLIC_SITE_URL` | for production | Absolute site URL, no trailing slash (e.g. `https://bbnusa.com`). Drives metadata, Open Graph, canonicals and the sitemap. |
| `NEXT_PUBLIC_FORMSPREE_ID` | for the forms | The **single** Formspree form ID. Every form on the site (Membresia, Parceiros, Contato, and the guest visit form on Como funciona) posts to `https://formspree.io/f/<ID>`. |

**Nothing here is required to build.** With the Cloudinary variables unset, the gallery helpers return an empty list and the photo sections render gold-outlined placeholder tiles. With the Formspree ID unset, every form shows a "still being configured" notice instead of a broken submit button. `npm run build` succeeds either way.

### One form, four sources

All four forms share the one Formspree form. Each submission tells you where it came from:

| Field | Value |
| --- | --- |
| `_subject` | `[BBN] Membresia`, `[BBN] Parceiros`, `[BBN] Contato` or `[BBN] Visita`, so you can filter the inbox |
| `origem` | The page and locale it was sent from, e.g. `/pt/como-funciona` |
| `_replyto` | The sender's email, so "Reply" in your inbox goes straight to them |
| `_gotcha` | Honeypot. Bots fill it and Formspree drops the submission |

Each form carries a consent line linking to `/[lang]/privacidade`.

### Institutional details (`data/site.ts`)

Email, WhatsApp and the president's name live in **`data/site.ts`**, and they are currently empty. **An empty value hides everything that depends on it:** the Contato card, the footer line, the floating WhatsApp button, and the `email` in the Organization JSON-LD. Fill a value in and those appear on their own, with no component edits. The check is `hasValue()` from the same file; use it for any new field that follows this pattern.

- `whatsapp`: digits only, with the country code, e.g. `12035551234`.
- `president`: until it is set, Liderança shows the crown and the role only.
- Location is fixed to "Connecticut, USA", with no street address, in both the copy and the schema.
- There is no domain constant. URLs come from `NEXT_PUBLIC_SITE_URL`.

Leaders have no photos by design. Liderança shows a gold monogram of their initials.

---

## How to add a new event

Three steps. The events index, the detail page, the sitemap and the JSON-LD all derive from the manifest, so you never touch a component.

### 1. Upload the media to Cloudinary

**Folder convention: `bbn/eventos/AAAA-MM-slug`**, e.g. `bbn/eventos/2027-03-encontro-bbn`. Create it in the Media Library and upload the photos and any short clips into it. The year-month prefix keeps folders sorted and matches the slug. Long videos don't go here; they stay on YouTube (step 2).

> ⚠️ This Cloudinary account holds other clients' folders. Only ever create or change things under `bbn/eventos/`.

The account uses **dynamic folders**. The folder an asset sits in (`asset_folder`) is independent of its `public_id`. So:
- If you upload straight into the event folder, the `public_id` is just the file name plus a suffix, such as `440A7701_bipslx`. Copy it from the Media Library when you need a cover.
- If you move an existing asset into the folder, its `public_id` and URLs don't change. The site finds it anyway, because the search matches both `asset_folder="…"` and the legacy `folder:…/*` path.

Photos are shown in capture order: the EXIF date, then the camera frame number in the file name (`440A7379` comes before `440A7380`), then the upload time.

### 2. Add an entry to `data/events.ts`

Append to `pastEvents`:

```ts
{
  slug: "2027-03-encontro-bbn",
  cloudinaryFolder: "bbn/eventos/2027-03-encontro-bbn",
  startDate: "2027-03-20",
  endDate: "2027-03-21",           // optional
  city: "Danbury, CT",
  venue: "Nome do local",          // optional: omit it and it's left out of the page and the JSON-LD
  coverPublicId: "440A7701_bipslx", // optional: the asset's public_id, copied from Cloudinary
  videos: [
    { kind: "youtube", id: "<youtube-id>", title: "Palestra de abertura" },
    { kind: "cloudinary", publicId: "<public-id-do-clipe>", title: "Bastidores" },
  ],
  i18n: {
    pt: { title: "Encontro BBN — Março 2027", description: "Uma ou duas frases sobre o encontro." },
    en: { title: "BBN Gathering — March 2027", description: "One or two sentences about the gathering." },
  },
},
```

Notes:
- `coverPublicId` is optional. Pick a wide landscape shot; it's also cropped to 1200×630 for Open Graph and the Event JSON-LD. Leave it out and the first photo in the folder becomes the cover. With no photos at all, a crown placeholder is used.
- `videos` can be an empty array; the videos section then doesn't render at all.
- Both `pt` and `en` copy are required — TypeScript will tell you if one is missing.

### 3. Regenerate route types and build

```bash
npx next typegen
npm run build
```

That's it. The event appears on `/pt/eventos`, gets its own page at `/pt/eventos/2027-03-encontro-bbn` (and the `/en` equivalents), lands in `sitemap.xml`, and emits `Event` JSON-LD.

**Adding more photos to an event that already exists needs no code change at all.** Upload them to the same Cloudinary folder; the event pages revalidate hourly (`export const revalidate = 3600`) and pick them up. (Photos on the other pages are curated. See "Changing which photo appears where".)

### Announcing the next event

Upcoming editions are separate, because we don't invent dates. `upcomingEvents` holds month + year only:

```ts
export const upcomingEvents: UpcomingEvent[] = [
  { month: 3, year: 2027 },
  // once sign-ups open:
  // { month: 3, year: 2027, registrationUrl: "https://..." },
];
```

Without `registrationUrl`, this renders a "Próximo evento: março de 2027 — data e local em breve" card with a CTA to follow @bbn_usa. **Add a `registrationUrl`** (it must start with `http://` or `https://`) and a gold **"Garantir minha vaga"** button replaces that state on the Eventos card, the Início next-event card and the Início hero. It opens in a new tab. After the event, add it to `pastEvents` (above) and move `upcomingEvents` on to the next edition.

---

## Other content you can fill in

- **Testimonials:** add entries to `data/testimonials.ts` (`name`, `business`, an optional Cloudinary `photo` public ID, and the `quote` in `pt` and `en`). The section appears on Início and Membresia once the array has at least one item, and renders nothing while it's empty.
- **Privacy policy:** `/[lang]/privacidade`. Its copy is in the dictionaries under `privacidade`. Update the `updated` date whenever you change it, for example when you add a new form or service.
- **Analytics:** `@vercel/analytics` is in the root layout. Enable Web Analytics in the Vercel project to start collecting. It is cookieless, as the privacy policy states.

---

## Project layout

```
app/[lang]/            The 8 pages + privacidade; every route is locale-prefixed
dictionaries/          pt.json (shape of record) + en.json + getDictionary()
data/site.ts           Contact details, socials, Formspree ID; hasValue(), siteUrl()
data/events.ts         Event manifest (see above)
data/testimonials.ts   Member quotes (empty = section hidden)
components/forms/      SiteForm (server wrapper) → FormspreeForm (client)
data/content.ts        Pillars, movements, guidelines, FAQ order — facts and keys only
lib/cloudinary.ts      Search API wrapper; returns [] when unconfigured
lib/seo.ts             Metadata builder + Organization/Event/FAQ/Breadcrumb JSON-LD
lib/i18n.ts            Locales, route map, and the single navTree
components/brand/      Section, Container, GoldHeading, NumberedCard, CrownLogo…
proxy.ts               Locale redirect (Next 16's replacement for middleware.ts)
```

### Conventions worth knowing

- **All copy lives in the dictionaries.** No Portuguese or English string belongs in a component — pass it in as a prop.
- **Headings are never plain white.** Use the `GoldHeading` primitive; it only offers champagne and gold-gradient.
- **`app/globals.css` is the only file allowed to contain a raw hex value.** Everywhere else, use the `bbn-*` tokens.
- **One `navTree`** in `lib/i18n.ts` feeds the header, the mobile sheet, the footer and the sitemap. The desktop header shows five items with a `Sobre` dropdown; the mobile sheet lists all eight. Add a page in one place. Legal pages (`legalNavItems`) sit in the footer's bottom row and in the sitemap, not in the main nav.
- **Empty means hidden.** Optional contact data is `""` until it's known, and every consumer checks `hasValue()`. Never render a placeholder such as "em breve" or `TODO_` for it.
- **shadcn here is Base UI, not Radix** — compose with `render={<Button />}` (plus `nativeButton={false}` for non-buttons), not `asChild`.

---

## Changing which photo appears where

Every event photo outside the gallery is chosen in **`data/media.ts`**:

- **`photos`** is the catalogue. Each Cloudinary public ID has a `kind`, pt/en `alt` text describing what's actually in the frame, and, for photos that shouldn't be used, an `unusable` reason. Those stay in the event gallery but are never placed.
- **`placements`** maps page sections to IDs: the home carousel (`home.hero`, in order; the first slide is the one that loads first), each page banner (`<page>.banner`), the pillar photos, the Sobre mosaic, and so on.

To swap a photo, change its ID in `placements`. To use photos from a new event, add them to `photos` first (kind and alt text in both languages), then reference them. The build fails if the same photo appears twice on a page, or if a photo marked `unusable` is placed. That keeps pages from repeating themselves.

Prefer landscape shots for wide areas (banners, the carousel, the Sobre band). Crops use Cloudinary's subject-aware `g_auto`, so faces stay in frame on phones. The event gallery also shows the catalogue's alt text when a photo has an entry.

---

## Logo and icons

The logo is `public/brand/bbn-logo.png`, which already includes the "BBN" lettering. It is always rendered through `components/brand/CrownLogo.tsx`, sized by height. The favicon, `app/icon.png` and `app/apple-icon.png` show the crown alone, since the letters are unreadable at 32px. `public/brand/og-default.png` is the share image for pages that don't have their own. If the logo file changes, regenerate all four:

```bash
node scripts/generate-icons.mjs
```

The script uses `sharp`, which comes installed with Next.

---

## Deploying

Push to the repo connected to Vercel, and set the same environment variables in the Vercel project (Settings → Environment Variables). `NEXT_PUBLIC_SITE_URL` should be the production domain so canonicals, Open Graph and the sitemap resolve correctly.
