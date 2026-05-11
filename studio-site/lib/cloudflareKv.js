/**
 * Cloudflare Workers KV adapter (REST API).
 *
 * This module is used to talk to a Cloudflare KV namespace from outside a
 * Cloudflare Worker (e.g. from a Next.js server runtime on Vercel). It uses
 * the public KV REST endpoint:
 *
 *   GET  https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/storage/kv/namespaces/{NAMESPACE_ID}/values/{key}
 *   PUT  https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/storage/kv/namespaces/{NAMESPACE_ID}/values/{key}?expiration_ttl={seconds}
 *
 * Env vars (all required for KV to be considered "configured"):
 *   - CLOUDFLARE_ACCOUNT_ID        Cloudflare account ID
 *   - CLOUDFLARE_KV_NAMESPACE_ID   ID of the KV namespace
 *   - CLOUDFLARE_KV_API_TOKEN      API token with "Workers KV Storage:Edit"
 *                                  permission (account scope)
 *
 * Note: server-only. Do NOT expose any of these env vars with a NEXT_PUBLIC_
 * prefix. They must never be sent to the browser.
 *
 * Cloudflare KV is eventually consistent — writes can take up to ~60s to
 * become globally visible. That's perfectly fine for our 24h TTL collage
 * cache; do not use this for low-latency state.
 *
 * The adapter never throws to the caller. On any error it logs a warning and
 * returns null / false so the caller can fall through to its data source.
 */

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const NAMESPACE_ID = process.env.CLOUDFLARE_KV_NAMESPACE_ID;
const API_TOKEN = process.env.CLOUDFLARE_KV_API_TOKEN;

const BASE_URL =
  ACCOUNT_ID && NAMESPACE_ID
    ? `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}`
    : null;

// Cloudflare enforces a minimum TTL of 60 seconds for `expiration_ttl`.
const MIN_TTL_SECONDS = 60;

export function isKvConfigured() {
  return Boolean(ACCOUNT_ID && NAMESPACE_ID && API_TOKEN);
}

function buildValueUrl(key) {
  return `${BASE_URL}/values/${encodeURIComponent(key)}`;
}

function authHeaders() {
  return { Authorization: `Bearer ${API_TOKEN}` };
}

/**
 * Read a value from KV. Returns the parsed JSON, the raw string if the body
 * isn't valid JSON, or null on miss / error.
 */
export async function kvGet(key) {
  if (!isKvConfigured()) return null;

  try {
    const res = await fetch(buildValueUrl(key), {
      method: 'GET',
      headers: authHeaders(),
      cache: 'no-store',
    });

    if (res.status === 404) return null;
    if (!res.ok) {
      console.warn(`[cloudflareKv] GET ${key} failed: ${res.status}`);
      return null;
    }

    const text = await res.text();
    if (!text) return null;

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch (err) {
    console.warn(`[cloudflareKv] GET ${key} error: ${err.message}`);
    return null;
  }
}

/**
 * Write a value to KV. Objects/arrays are JSON-stringified; primitives are
 * stored as their string representation. Returns true on success, false
 * otherwise.
 *
 * @param {string} key
 * @param {unknown} value
 * @param {{ ex?: number }} [options]  ex = expiration TTL in seconds (>= 60)
 */
export async function kvSet(key, value, options = {}) {
  if (!isKvConfigured()) return false;

  const url = new URL(buildValueUrl(key));
  if (typeof options.ex === 'number' && options.ex >= MIN_TTL_SECONDS) {
    url.searchParams.set('expiration_ttl', String(Math.floor(options.ex)));
  }

  const body = typeof value === 'string' ? value : JSON.stringify(value);

  try {
    const res = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        ...authHeaders(),
        'Content-Type': 'text/plain; charset=utf-8',
      },
      body,
      cache: 'no-store',
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.warn(
        `[cloudflareKv] PUT ${key} failed: ${res.status} ${detail.slice(0, 200)}`,
      );
      return false;
    }

    return true;
  } catch (err) {
    console.warn(`[cloudflareKv] PUT ${key} error: ${err.message}`);
    return false;
  }
}

/**
 * Delete a value from KV. Returns true on success.
 */
export async function kvDel(key) {
  if (!isKvConfigured()) return false;

  try {
    const res = await fetch(buildValueUrl(key), {
      method: 'DELETE',
      headers: authHeaders(),
      cache: 'no-store',
    });
    return res.ok;
  } catch (err) {
    console.warn(`[cloudflareKv] DELETE ${key} error: ${err.message}`);
    return false;
  }
}
