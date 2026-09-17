import type { ApiErrorShape } from "@/lib/types";

// || (not ??) so an empty NEXT_PUBLIC_API_BASE_URL also falls back to the backend,
// instead of resolving to "" and calling the site's own origin.
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://field.maestrovps.org";

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  token?: string | null;
  /** Send FormData / multipart untouched (no JSON encoding). */
  form?: FormData;
}

export async function apiFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const { body, form, token, headers, ...rest } = opts;

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(headers as Record<string, string> | undefined),
  };
  if (body !== undefined && !form) finalHeaders["Content-Type"] = "application/json";
  if (token) finalHeaders["Authorization"] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: form ? form : body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (e) {
    throw new ApiError(e instanceof Error ? `Network error: ${e.message}` : "Network error", 0);
  }

  const text = await res.text();
  const parsed = text ? safeJson(text) : null;

  if (!res.ok) {
    const err = parsed as ApiErrorShape | null;
    throw new ApiError(err?.error ?? res.statusText ?? `HTTP ${res.status}`, res.status, err?.details);
  }

  return parsed as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
