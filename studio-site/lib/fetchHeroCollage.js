import { fetchGallery } from './fetchGallery';
import { kvGet, kvSet, isKvConfigured } from './cloudflareKv';

/**
 * Hero collage data layer.
 *
 * Strategy:
 *   1. Try Cloudflare KV     ->  studio:{studioId}:hero-collage:v1
 *   2. On miss, ask the upstream Gallery API for a curated collage set.
 *   3. If upstream is unavailable (or the studio is the placeholder), assemble
 *      a collage from the existing gallery payload as a fallback.
 *   4. Persist the result back to Cloudflare KV with a 24h TTL so subsequent
 *      builds and ISR regenerations are O(1).
 *
 * KV is optional. When KV credentials are not provided (typical local dev),
 * the function silently skips the cache step and just returns freshly
 * assembled data.
 *
 * Server-only — must be invoked from getStaticProps / getServerSideProps /
 * Route Handlers, never bundled to the client.
 */

const COLLAGE_KEY_PREFIX = 'studio:';
const COLLAGE_KEY_SUFFIX = ':hero-collage:v1';
const COLLAGE_TTL_SECONDS = 60 * 60 * 24; // 24h
const DEFAULT_SIZE = 18;

function isLikelyPhoto(item) {
  return item && typeof item.publicUrl === 'string' && item.publicUrl.length > 0;
}

function dedupeByUrl(photos) {
  const seen = new Set();
  const out = [];
  for (const p of photos) {
    if (!isLikelyPhoto(p)) continue;
    if (seen.has(p.publicUrl)) continue;
    seen.add(p.publicUrl);
    out.push(p);
  }
  return out;
}

function buildCollageFromGallery(gallery, size) {
  const flat = (gallery?.events ?? []).flatMap((event) =>
    (event.photos ?? []).map((photo) => ({
      publicUrl: photo.publicUrl,
      eventName: event.eventName,
      venueName: event.venue?.name ?? '',
      venueCity: event.venue?.city ?? '',
    })),
  );
  return dedupeByUrl(flat).slice(0, size);
}

async function fetchCollageFromUpstream(studioId, size) {
  const apiBase = process.env.NEXT_PUBLIC_GALLERY_API;
  if (!studioId || studioId === 'placeholder_studio_id' || !apiBase) {
    return null;
  }

  try {
    const res = await fetch(
      `${apiBase}/gallery/${studioId}/collage?size=${size}`,
      {
        // ISR-friendly fetch cache — KV is the cross-deployment cache,
        // this is the in-build memo cache.
        next: { revalidate: COLLAGE_TTL_SECONDS },
      },
    );

    if (!res.ok) {
      if (res.status !== 404) {
        console.warn(
          `[heroCollage] Upstream collage returned ${res.status} — falling back to gallery`,
        );
      }
      return null;
    }

    const data = await res.json();
    if (Array.isArray(data?.photos)) return dedupeByUrl(data.photos).slice(0, size);
    if (Array.isArray(data)) return dedupeByUrl(data).slice(0, size);
    return null;
  } catch (err) {
    console.warn('[heroCollage] Upstream collage fetch failed:', err.message);
    return null;
  }
}

export async function fetchHeroCollage({ size = DEFAULT_SIZE } = {}) {
  const studioId = process.env.NEXT_PUBLIC_STUDIO_ID || 'placeholder_studio_id';
  const kvKey = `${COLLAGE_KEY_PREFIX}${studioId}${COLLAGE_KEY_SUFFIX}`;

  // 1. Try KV
  if (isKvConfigured()) {
    const cached = await kvGet(kvKey);
    if (Array.isArray(cached) && cached.length > 0) {
      return cached;
    }
  }

  // 2. Try upstream curated endpoint
  let photos = await fetchCollageFromUpstream(studioId, size);

  // 3. Fall back to assembling from the regular gallery payload
  if (!photos || photos.length === 0) {
    const gallery = await fetchGallery();
    photos = buildCollageFromGallery(gallery, size);
  }

  // 4. Write-through to KV
  if (isKvConfigured() && photos.length > 0) {
    await kvSet(kvKey, photos, { ex: COLLAGE_TTL_SECONDS });
  }

  return photos;
}
