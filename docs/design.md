# BrokerPosts — Design

_Date: 2026-05-20_

## Problem

A real-estate broker needs to quickly produce polished, Instagram/Facebook-ready
social posts announcing a property as **VENDU** (sold) or **ACHETÉ** (bought).
Each post combines 3–5 house photos, the broker's identity (photo, name, title,
contact, agency logo), a warm French thank-you message, and a French caption +
hashtags ready to copy. Output is a square **1080×1080 PNG**.

This is a faithful productionization of a Claude Design HTML/JS prototype
(`Broker Post Generator.html` + JSX modules), extended with real accounts and
cross-device persistence.

## Goals

- Recreate the prototype's 3 styles × 3 layouts (9 templates) **pixel-faithfully**.
- Real per-broker **accounts** via Google sign-in; each broker's profile is isolated.
- Profile (photo, logo, name, title, phone, email, agency) **persists across
  devices**, stored server-side.
- Compose flow: upload 3–5 photos → pick Vendu/Acheté → choose a template →
  preview at 1080×1080 → copy French caption → download PNG.
- Profile editing happens in a **modal**, not a separate full-screen route.
- Deploy on **Vercel free tier**.

## Non-goals

- No multi-language UI toggle (UI in English/French as designed; generated posts in French).
- No analytics, scheduling, or direct social publishing.
- No storage of the per-post house photos server-side (they stay client-side per session).
- No password reset / email flows (Google handles identity).
- No Tweaks/brand color-override dev panel (branding locked to navy/pale-blue).

## Decisions (from Q&A)

| Topic | Decision |
|-------|----------|
| Stack | **Next.js (App Router) + TypeScript** |
| Fidelity | Recreate + small improvements (types, a11y, light responsiveness); posts stay pixel-faithful |
| Captions | Single curated French caption + hashtag set per style (as prototype) |
| Auth | **Google sign-in** (Auth.js / NextAuth), JWT sessions, **no database** |
| Sign-up | Open to anyone |
| Profiles | Isolated per authenticated user |
| Persistence | Cross-device, server-side |
| Image storage | **Vercel Blob** (broker photo + logo only) |
| Profile UI | Modal |
| Deploy | Vercel free tier |

## Architecture

```
Next.js App Router (client-rendered compose UI + server routes)
│
├── Auth.js (Google provider, JWT session, no DB)
│     userId = Google `sub`
│
├── Vercel Blob  (per user)
│     profiles/<userId>.json     ← profile metadata (name, title, phone, email, agency, photoCrop, image URLs)
│     users/<userId>/photo       ← broker headshot
│     users/<userId>/logo        ← agency logo
│
└── Per-post house photos: client-side data URLs only (never uploaded)
```

### Why no database

Identity comes from Google (JWT session). The only persistent per-user data is one
small profile JSON + two images — all of which live in Vercel Blob keyed by the
authenticated `userId`. This keeps the app on the free tier with zero DB infra.

### Routes / API

- `GET /` — if unauthenticated, sign-in landing; if authenticated, the compose app.
- `/api/auth/[...nextauth]` — Auth.js handlers.
- `GET /api/profile` — returns the signed-in user's profile JSON (or null). Reads Blob server-side.
- `POST /api/profile` — upserts the user's profile JSON (authed).
- `POST /api/profile/upload` — Vercel Blob **client-upload** token handler (authed), so
  images upload directly from browser to Blob (avoids the 4.5 MB serverless body limit) and
  are stored under `users/<userId>/...`.

### Data flow

1. Visit `/` → not signed in → "Sign in with Google".
2. After sign-in → fetch `/api/profile`.
   - No profile yet → open the **Setup modal** (forced, first run).
   - Has profile → land on Compose.
3. Setup modal: upload + crop headshot, upload logo (uploaded to Blob via client-upload),
   fill name/title/phone/email/agency. Save → `POST /api/profile`.
4. Compose: add 3–5 house photos (client-side) → pick Vendu/Acheté → pick a template →
   focus modal renders 1080×1080 → copy caption / download PNG (`html-to-image`).
5. Edit profile anytime via header avatar chip → same modal in "edit" mode.

## Components / file layout

```
app/
  layout.tsx, page.tsx            ← shell + auth gate
  api/auth/[...nextauth]/route.ts
  api/profile/route.ts            ← GET/POST profile JSON
  api/profile/upload/route.ts     ← Blob client-upload token
src/
  auth.ts                         ← Auth.js config (Google, JWT)
  types.ts                        ← Broker, PhotoCrop, Kind, StyleId, LayoutId
  lib/
    blob.ts                       ← profile read/write helpers (server)
    captions.ts                   ← French caption generator (ported)
  theme.css                       ← CSS vars (navy/pale-blue), base styles
  components/
    Icon.tsx
    auth/SignInScreen.tsx
    setup/ProfileModal.tsx, PhotoCropPicker.tsx, ImagePicker.tsx, Field.tsx, TextInput.tsx
    compose/ComposeScreen.tsx, ComposeHeader.tsx, PhotoStrip.tsx, KindSelector.tsx,
            TemplateGallery.tsx, TemplateCard.tsx, FocusPanel.tsx
    templates/Template.tsx, Classique.tsx, Moderne.tsx, Editorial.tsx,
              PhotoGrid.tsx, BrokerAvatar.tsx, PostLogo.tsx
```

### Design tokens (locked)

- `--ink: #0E1E47` (navy), `--paper: #E6EEF6` (pale blue), `--accent: #1A4A8A`,
  `--muted: #5C7193`; body bg `#DCE6F0`.
- Fonts: Playfair Display + DM Serif Display (serif), Inter (sans), JetBrains Mono (mono).

### Templates (pixel-faithful to prototype)

- **Classique** — serif, inner frame, navy ink circular stamp ("Officiellement/Avec joie" +
  VENDU/ACHETÉ + "avec gratitude"), centered thank-you, broker footer.
- **Moderne** — sans, oversized 132px VENDU./ACHETÉ. headline on a 2px rule, full-width photos,
  mono broker bar. No vertical sidebar.
- **Éditorial** — masthead + photo area + navy bottom block with DM Serif display word and
  broker card; pale-blue corner accent.
- **Layouts** `hero / grille / mosaïque` with distinct CSS grids for 3 / 4 / 5 photos.
- Posts show the **logo only** (no agency text), **no dates**.

## Error handling

- Profile fetch/save failures surface a non-blocking toast/inline error; the form keeps state.
- Image upload failure → inline message, keep prior image.
- PNG export failure → alert + console (as prototype), retto retry.
- Unauthenticated API calls → 401; client redirects to sign-in.
- Validation: name, email, phone required before a profile can be saved.

## Testing / verification

- `next build` + `tsc` must pass clean.
- Manual: sign-in gate renders; setup modal forced on first run; profile persists across reload;
  9 templates render for 3/4/5 photos; PNG downloads at 1080×1080.

## Required env vars

| Var | Where | Notes |
|-----|-------|-------|
| `AUTH_SECRET` | local + Vercel | `npx auth secret` |
| `AUTH_GOOGLE_ID` | local + Vercel | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | local + Vercel | Google OAuth client secret |
| `BLOB_READ_WRITE_TOKEN` | auto on Vercel; `vercel env pull` for local | Vercel Blob store |

### Google OAuth setup (user, one-time)

1. Google Cloud Console → new project → OAuth consent screen (External) → Publish app.
2. Create OAuth client (Web). Redirect URIs:
   `http://localhost:3000/api/auth/callback/google` and
   `https://<app>.vercel.app/api/auth/callback/google`.
3. Paste client ID/secret into env vars.

## Open questions

None outstanding — ready to implement.
