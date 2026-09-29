@AGENTS.md

# Brazilian Business Network (BBN) — Website

## Commands
- npm run dev — local server at http://localhost:3000
- npm run build — production build (run before every commit)
- npm run lint

## Stack
Next.js 16 (App Router, Turbopack) + React 19 + TypeScript + Tailwind v4 + shadcn/ui, next-cloudinary for media, Formspree for forms, deployed on Vercel.

Version specifics that differ from older conventions:
- **Tailwind v4** — there is no `tailwind.config.ts`. Brand tokens are declared in `app/globals.css` under `@theme`, and the shadcn semantic variables are mapped to Tailwind colours in an `@theme inline` block. Use `bg-linear-to-b`, not `bg-gradient-to-b`.
- **shadcn/ui is on Base UI, not Radix** — composition uses `render={<Button />}` instead of `asChild`, and add `nativeButton={false}` when the rendered element isn't a button. Accordion takes no `type` prop and `defaultValue` is an array. See `.agents/skills/shadcn/rules/base-vs-radix.md`.
- **Next 16** — `params`/`searchParams` are Promises; routing middleware is `proxy.ts`, not `middleware.ts`; `PageProps<"/[lang]/x">` / `LayoutProps<"/[lang]">` are global helpers. Run `npx next typegen` after adding a route. Docs are bundled in `node_modules/next/dist/docs/`.
- **lucide-react is pinned to 0.577.0** — v1 removed the brand icons (Instagram, Facebook) that the header, footer and Contato page need. Don't upgrade without replacing those.

## Languages
Portuguese (pt) is the default. English (en) via a PT/EN toggle in the header. All strings live in /dictionaries/pt.json and /dictionaries/en.json.
Routing: every page sits under `app/[lang]/`; `/` redirects to the reader's preferred language (Portuguese by default) via `proxy.ts`. `pt.json` is the shape of record — the `Dictionary` type derives from it, so a key missing from `en.json` is a build error.

## Brand (from docs/BBN_Institucional.pdf — do not change)
- Colors: bbn-black #0A0A0A, bbn-surface #121212, bbn-card #1A1A1A, bbn-gold #C29A4D, bbn-gold-light #E6C076, bbn-gold-dark #B2904D, bbn-champagne #F1E0B4, white #FFFFFF
- Gold gradient: linear-gradient(135deg, #B2904D 0%, #E6C076 50%, #C29A4D 100%)
- Fonts: serif headings (Playfair Display unless the licensed Kief Montaser file is in /public/fonts), Poppins for uppercase labels, Lato for body
- Style: dark premium, crown logo, thin gold lines, uppercase letter-spaced labels, numbered cards (01, 02, 03)
- Logo: /public/brand/bbn-logo.png (828×749, transparent, orange crown with the "BBN" lettering built in). Render it through `components/brand/CrownLogo.tsx`, which sizes it by height with alt="Brazilian Business Network". Never add a separate "BBN" text wordmark beside it, and never recolour it.
- Icons: `app/favicon.ico`, `app/icon.png` and `app/apple-icon.png` show the crown only, without the letters. The default OG card is `public/brand/og-default.png`. To regenerate them from the logo, see the README.

## Institutional content (source of truth)
- Tagline: Conectar pessoas. Desenvolver negócios. Criar oportunidades. Transformar vidas.
- Purpose: connect, train and boost Brazilian entrepreneurs to turn ideas into businesses, businesses into opportunities and opportunities into impact.
- Vision: build the largest and most relevant network of Brazilian entrepreneurs.
- Belief: "We don't just build businesses. We build people who build businesses."
- The whole entrepreneur: Mente, Corpo, Espírito, Relacionamentos, Negócios.
- What we do (5): Connect/Conectar, Educate/Capacitar, Launch/Impulsionar, Grow/Desenvolver, Impact/Gerar impacto.
- How it works (3 pillars):
  - Eventos — 2x per year (March & September). Leaders: Henrique, Ademir.
  - Reuniões — monthly, in Portuguese. Leaders: Vinícius, Reinaldo.
  - Treinamentos — quarterly, members only. Leaders: Everton, Milton.
- Membership: US$ 150 per person/year, subject to review and approval.
- Member journey: Evento → Conhece o BBN → Torna-se membro → Reuniões mensais → Treinamentos → Parceiros & oportunidades → Desenvolve o negócio → Contribui → Voluntário/Líder.
- Guidelines: no politics; Christian principles, non-denominational; meetings in Portuguese; guests may attend up to 2 meetings before joining; trainings are members-only.
- Culture: contribution, relationship, growth, mutual opportunities; volunteering; intentionality; from member to leader.
- Relationship hub: partners in other states and in Brazil; local partners (podcasts, newspapers, influencers); event venues; out-of-the-box opportunities.
- Leadership (year one): 7 leaders — 1 General Leader/President (name in `data/site.ts`, empty until known) + 2 per pillar. "Líderes desenvolvem líderes." Plan → Delegate → Execute → Evaluate.

## Social links (official — do not change)
- Instagram: https://www.instagram.com/bbn_usa/ — handle @bbn_usa
- Facebook: https://www.facebook.com/profile.php?id=61569167398193
- Both URLs must appear in the Organization JSON-LD `sameAs` array. Open Graph `siteName` is always "Brazilian Business Network".
- Rendered by `components/layout/SocialLinks.tsx` (header, mobile sheet, footer) and read from `data/site.ts` → `site.social`. External links always carry `target="_blank" rel="noopener noreferrer"` plus an accessible label.

## Site data and "empty means hidden"
Institutional details live in `data/site.ts`. Edit there, not in components.
- Location: "Connecticut, USA" (region CT, US), with no street address, in both the copy and the JSON-LD.
- `email`, `whatsapp` and `president` are `""` until known. **An empty value hides every link, button, card and JSON-LD field that depends on it.** Always gate on `hasValue()`, and never render "em breve", `TODO_` or a fake value. The floating WhatsApp button (`components/layout/WhatsAppFloat.tsx`) follows the same rule.
- There is no domain constant. Absolute URLs come from `siteUrl()`, which reads `NEXT_PUBLIC_SITE_URL`.
- Leaders have no photos by design. Liderança uses the gold `Monogram` (`components/brand/Monogram.tsx`) permanently.
- Testimonials: `data/testimonials.ts`. While the array is empty, `<Testimonials>` renders nothing (on Início and Membresia).
- Instagram: https://www.instagram.com/bbn_usa/ (@bbn_usa) · Facebook: https://www.facebook.com/profile.php?id=61569167398193

## Environment (`.env.local`, gitignored; never print or commit the secret)
`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_FORMSPREE_ID`. `.env.local.example` lists the same keys, empty.

## Forms (one Formspree form)
There is a **single** `NEXT_PUBLIC_FORMSPREE_ID`, and every form posts to `https://formspree.io/f/${ID}` through `components/forms/SiteForm.tsx` (server wrapper) → `FormspreeForm.tsx` (client). Each one sends:
- A hidden `_subject`, by `kind`: `[BBN] Membresia` | `[BBN] Parceiros` | `[BBN] Contato` | `[BBN] Visita`.
- A hidden `origem` with the page and locale.
- `_replyto` set to the sender's email.
- The `_gotcha` honeypot.

Each form also shows a consent line linking to `/[lang]/privacidade`. The guest form ("Quero visitar uma reunião", kind `visita`) sits on Como funciona at `#visita`, and Início has a CTA pointing to it. Guests may attend up to 2 meetings.

## Events and Cloudinary
- **Folder convention: `bbn/eventos/AAAA-MM-slug`**, e.g. `bbn/eventos/2026-03-encontro-bbn`.
- The account uses dynamic folders and **holds other clients' folders. Only ever touch `bbn/eventos`.** Never rename or delete assets. To move an asset, change its `asset_folder`; its `public_id` and URLs don't change.
- `lib/cloudinary.ts` searches `(asset_folder="<folder>" OR folder:<folder>/*)` across images and videos, sorted by capture order: EXIF date, then the camera frame number, then upload time. With no credentials it returns `[]`.
- To add an event, append it to `pastEvents` in `data/events.ts` (slug, cloudinaryFolder, startDate, city, optional venue and coverPublicId, videos, pt/en title and description), then run `npx next typegen` and `npm run build`. The full walkthrough is in the README.
- `upcomingEvents` holds month and year only. An optional `registrationUrl` (http/https) shows the gold "Garantir minha vaga" button on the Eventos card, the Início next-event card and the Início hero; without it, the event keeps its "em breve" state.

## Photos on the site (`data/media.ts`)
- **`data/media.ts` is the only place that decides which event photo appears where.** `photos` is the curated catalogue: public ID, kind (room, stage, networking, sponsor, group, portrait), pt/en alt text, and an `unusable` reason for photos that stay in the gallery only. `placements` maps each page section to IDs. Components never hard-code a public ID.
- At build time, a check fails if a page repeats a photo (Eventos also counts the event covers) or if an unusable photo is placed.
- Components:
  - `BrandPhoto` is a framed photo: 4px radius, gold hairline border, soft dark gradient, always lazy.
  - `PhotoBackdrop` is a decorative full-bleed background behind text, with `alt=""`, used on page banners and the home membership CTA.
  - `HeroCarousel` is the home hero: a 4s crossfade with Ken Burns zoom. Only its first slide is eager with `fetchPriority="high"`; the other slides mount after hydration. Under `prefers-reduced-motion` it shows the first photo only.
- Text over photos must stay WCAG AA even over a white pixel. The overlays in `PhotoBackdrop` and `HeroCarousel`, and the `bbn-scrim-*` utilities in `globals.css`, are tuned for that. Don't lighten them without re-checking.
- Without `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `photo()` and `photoList()` return null or `[]`, and every section falls back to its photo-less layout.
- `PageHero` takes an optional `photo`. Every inner page has one except Privacidade, which stays plain, and the event detail page, whose gallery already shows every photo.

## Privacy and analytics
`/[lang]/privacidade` (copy is under `privacidade` in the dictionaries) is linked in the footer's bottom row (`legalNavItems`) and under every form. `@vercel/analytics` is mounted in `app/[lang]/layout.tsx`.

## Rules
- Fix the typos from the PDF in site copy (empresendedor, discussção, voluntaráir, sé tomar, la comunidade).
- Mobile-first; sections py-24 desktop / py-16 mobile; max container 1280px.
- Use the agents in .claude/agents and the skills in .agents/skills. (`.claude/skills/` also works — it is a directory of symlinks pointing into `.agents/skills/` — but the agent definitions reference the real path, since symlinks don't survive every clone on Windows.)