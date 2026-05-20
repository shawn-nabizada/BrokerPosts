# BrokerPosts

Generate Instagram/Facebook-ready French real-estate posts (**Vendu** / **Acheté**)
from 3–5 property photos. Each broker signs in with Google, sets up their profile
once (photo, title, contact, agency logo), and it follows them across devices.

- **Stack:** Next.js (App Router) + TypeScript, React 19.
- **Auth:** Google sign-in via Auth.js (NextAuth), JWT sessions — no database.
- **Storage:** Vercel Blob (per-user profile JSON + headshot + logo).
- **Export:** 1080×1080 PNG via `html-to-image`.

The 9 post designs are 3 styles (Classique / Moderne / Éditorial) × 3 layouts
(Hero / Grille / Mosaïque) that adapt to 3, 4, or 5 photos. UI is in French;
generated captions are French.

---

## Setup & deploy — in order

Follow these steps top to bottom. There are two unavoidable "you need X before Y"
points (the Blob token and the production redirect URI), and they're called out
where they land in the sequence.

### 1. Install

```bash
npm install
```

### 2. Generate `AUTH_SECRET`

```bash
cp .env.example .env.local
npx auth secret        # prints/writes a value → put it in .env.local as AUTH_SECRET
```

### 3. Create the Google OAuth credentials

1. [Google Cloud Console](https://console.cloud.google.com/) → create a project.
2. **APIs & Services → OAuth consent screen**: choose **External**, add an app name
   and your support email. Save. The app starts in **Testing** mode.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - Application type: **Web application**.
   - **Authorized redirect URIs** → add the local one for now:
     `http://localhost:3000/api/auth/callback/google`
     (you'll add the production URL in step 6, once you know it).
4. Copy **Client ID** → `AUTH_GOOGLE_ID` and **Client secret** → `AUTH_GOOGLE_SECRET`
   in `.env.local`.

#### While in Testing mode — allow specific sign-ins

In Testing mode, **only explicitly-added accounts can sign in** (everyone else gets
"access blocked / app not verified"). Add yourself and any colleagues:

- **APIs & Services → OAuth consent screen → Audience** (older UI: the **Test users**
  section of the consent screen) → **Add users** → enter their Google email addresses
  → Save. Up to 100 test users; no review required.

This is the fastest way to demo the app with a handful of people before going public.

#### Going to Production — let anyone sign in

When you're ready for open sign-up (your chosen setting), publish the app:

- **APIs & Services → OAuth consent screen → Audience** → **Publishing status:
  Testing → Publish app** → confirm.
- Because this app only requests the **non-sensitive** `email` / `profile` / `openid`
  scopes, publishing takes effect **immediately and requires no Google verification
  or review** — there's no form to submit and no waiting period. (Verification is only
  required for sensitive/restricted scopes, which this app does not use.)
- Once published, the test-user list no longer applies and any Google account can sign in.

### 4. Create the Vercel project + Blob store (needed for the Blob token)

The `BLOB_READ_WRITE_TOKEN` comes from a Vercel Blob store, so the Vercel project
has to exist before profile saves/image uploads work — even for local dev.

1. Push this repo to GitHub and **Import** it in [Vercel](https://vercel.com/new).
   (The first deploy will fail/lack env vars — that's fine; we finish wiring below.)
2. In the project: **Storage → Create → Blob**, and connect the store to the project.
   This injects `BLOB_READ_WRITE_TOKEN` into the deployment automatically.
3. Pull that token into your local env:
   ```bash
   npx vercel link          # link this folder to the Vercel project
   npx vercel env pull .env.local   # adds BLOB_READ_WRITE_TOKEN to .env.local
   ```

> Want to skip Vercel for now? You can run locally after step 3 — sign-in will work,
> but saving a profile / uploading images needs the Blob token from this step.

### 5. Run locally

```bash
npm run dev
# http://localhost:3000
```

> If port 3000 is busy, use `PORT=3210 npm run dev` **and** register the matching
> `http://localhost:3210/api/auth/callback/google` redirect URI in Google (step 3).

### 6. Finish the deploy

1. In Vercel → **Settings → Environment Variables**, add (Blob token is already there):
   - `AUTH_SECRET`
   - `AUTH_GOOGLE_ID`
   - `AUTH_GOOGLE_SECRET`
2. Trigger a deploy. Note your production URL (e.g. `https://<your-app>.vercel.app`).
3. **Now that you know the URL**, add the production redirect URI in Google (step 3.3):
   `https://<your-app>.vercel.app/api/auth/callback/google`
4. Redeploy if needed. Done.

> Auth.js auto-detects the deployment URL on Vercel. For a custom domain, also set
> `AUTH_URL=https://yourdomain.com`.

---

## How data is stored

- **Profile** (`name`, `title`, `phone`, `email`, `agency`, crop, image URLs):
  one JSON object per user at `profiles/<googleUserId>.json` in Vercel Blob.
- **Images** (headshot + logo): uploaded directly from the browser to
  `users/<googleUserId>/...` via a token-scoped client upload, so a user can only
  write into their own namespace.
- **House photos** for a post are **never uploaded** — they live in the browser for
  the duration of the compose session and are baked into the exported PNG.

## Scripts

```bash
npm run dev        # dev server
npm run build      # production build
npm run start      # serve production build
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
```

## Notes / future work

- Profile images use a random suffix per upload, so replacing an image leaves the
  previous blob orphaned. A periodic cleanup (or `del()` of the old URL on replace)
  could reclaim that space if it ever matters on the free tier.
