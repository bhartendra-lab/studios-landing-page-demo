# Wedding Photography Studio — Website Template

A Next.js website template for Indian wedding photography studios. This is a public-facing marketing and portfolio website — not a dashboard or admin panel.

---

## Environment Variables

Set these in Vercel when deploying, or in `.env.local` for local development.

| Variable | Description | Who provides it |
|---|---|---|
| `NEXT_PUBLIC_STUDIO_ID` | Unique ID assigned to this studio | Platform admin |
| `NEXT_PUBLIC_GALLERY_API` | Gallery API base URL | Platform admin |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Studio WhatsApp number in international format, no `+` or spaces (e.g. `919876543210` for +91 98765 43210) | Studio owner |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID (server-only, optional) | Platform admin |
| `CLOUDFLARE_KV_NAMESPACE_ID` | KV namespace ID for the hero collage cache (server-only, optional) | Platform admin |
| `CLOUDFLARE_KV_API_TOKEN` | API token with `Workers KV Storage:Edit` permission (server-only, optional) | Platform admin |

Copy `.env.local.example` to `.env.local` and fill in the values for local development.

### Hero collage cache (Cloudflare KV)

The home page hero is a **moving collage** of wedding photos. To avoid hammering the Gallery API on every ISR regeneration, the collage is fetched from the upstream once and persisted to **Cloudflare Workers KV** with a 24h TTL via the [Cloudflare KV REST API](https://developers.cloudflare.com/api/operations/workers-kv-namespace-write-key-value-pair).

- KV is **optional**. If the three `CLOUDFLARE_*` env vars are not set, the collage is assembled fresh from the gallery payload on every build — no errors.
- All three KV env vars are **server-only** — do not prefix with `NEXT_PUBLIC_`.
- Cache key: `studio:{NEXT_PUBLIC_STUDIO_ID}:hero-collage:v1`. Bump the `v1` suffix in `lib/fetchHeroCollage.js` to invalidate.

**Setting up Cloudflare KV:**

1. Cloudflare dashboard → **Workers & Pages** → **KV** → **Create namespace** (e.g. `studio-site-cache`). Copy the namespace ID.
2. **My Profile** → **API Tokens** → **Create Token** → **Custom token**. Permissions: `Account · Workers KV Storage · Edit`. Scope it to your account. Copy the token (shown only once).
3. Your **Account ID** is on the Workers & Pages dashboard sidebar.
4. Add `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_KV_NAMESPACE_ID`, `CLOUDFLARE_KV_API_TOKEN` to your hosting platform's env vars (Vercel: Project → Settings → Environment Variables, scope to Production + Preview).

> Cloudflare KV is **eventually consistent** — writes can take up to ~60s to become globally visible. That is fine for a 24h-TTL collage cache; do not use this adapter for low-latency state.

---

## Deployment

1. Click the **Deploy** button (or import this repo in [vercel.com](https://vercel.com))
2. Sign in to Vercel
3. When prompted, set the three environment variables above
4. Deploy — done

---

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Studio Configuration

`public/studio-config.json` is pre-filled by the platform admin during setup. It contains studio name, branding, team, testimonials, and contact details. **Do not manually edit this file** — changes will be overwritten when the platform admin re-provisions the site.

---

## Tech Stack

- [Next.js](https://nextjs.org/) (Pages Router, ISR)
- Plain CSS Modules — no Tailwind, no CSS-in-JS
- [`sharp`](https://sharp.pixelplumbing.com/) for image optimisation
- No UI component libraries, no animation libraries
