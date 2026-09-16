export type ApiError = Error & { status?: number };

/**
 * Throw on non-OK responses, attaching the HTTP status so callers can map
 * to generic UI messages instead of echoing backend internals verbatim.
 */
export async function throwIfNotOk(res: Response): Promise<void> {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      const raw = body?.message ?? body?.error;
      if (typeof raw === "string" && raw.length > 0) {
        // Cap length so a verbose backend can never flood the UI / logs.
        message = raw.slice(0, 300);
      }
    } catch {
      if (res.statusText) {
        message = `HTTP ${res.status}: ${res.statusText}`;
      }
    }
    const err = new Error(message) as ApiError;
    err.status = res.status;
    throw err;
  }
}

/**
 * Generic, non-leaking message for admin surfaces. 400-validation callers
 * that parse field-level errors may still use the raw message internally,
 * but it must never be rendered verbatim.
 */
export function toFriendlyErrorMessage(err: unknown): string {
  const status = (err as ApiError)?.status;
  if (status === 401) return "Session expired. Please sign in again.";
  if (status === 403) return "You don't have permission for this action.";
  if (status === 404) return "Not found.";
  if (status === 409) return "This record already exists.";
  if (status === 413) return "Upload too large.";
  if (status === 429) return "Too many attempts. Please try again later.";
  if (status !== undefined && status >= 500) {
    return "Something went wrong. Please try again later.";
  }
  return "Something went wrong. Please try again.";
}
