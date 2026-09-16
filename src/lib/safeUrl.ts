/**
 * URL / slug safety helpers (frontend allowlist).
 *
 * CMS- and API-controlled strings must never become `javascript:` / `data:`
 * script sinks. React escapes text nodes but does NOT reliably block
 * `javascript:` in `href`, so every external link goes through these.
 */

/** Allow only http(s) absolute URLs. Returns the trimmed URL or null. */
export function toSafeHttpUrl(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const url = raw.trim();
  if (!/^https?:\/\//i.test(url)) return null;
  // Reject control chars / whitespace that can smuggle schemes.
  if (/[\s<>"'`]/.test(url)) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

/** Allow only https image sources (absolute) or root-relative paths. */
export function toSafeImageSrc(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const src = raw.trim();
  if (!src) return null;
  if (src.startsWith("/") && !src.startsWith("//")) {
    if (/[\s<>"'`]/.test(src)) return null;
    return src;
  }
  const safe = toSafeHttpUrl(src);
  if (!safe) return null;
  return safe.startsWith("https://") ? safe : null;
}

/** Slug allowlist shared by events + forms routing. */
const SLUG_RE = /^[a-z0-9-]+$/;

export function isSafeSlug(raw: unknown): raw is string {
  return typeof raw === "string" && raw.length <= 120 && SLUG_RE.test(raw);
}

/** Encode a validated slug for fetch paths / navigation. Null if invalid. */
export function toSafeSlugPath(raw: unknown): string | null {
  if (!isSafeSlug(raw)) return null;
  return encodeURIComponent(raw);
}
