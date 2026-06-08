import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export type ApiFieldErrors = Record<string, string>;

export type ParsedApiError = {
  message: string;
  status?: number | string;
  fieldErrors?: ApiFieldErrors;
};

/** True when an RTK Query error is HTTP 401 (e.g. missing refresh cookie). */
export function isUnauthorizedError(error: FetchBaseQueryError | undefined): boolean {
  if (!error) return false;
  const status = error.status;
  if (status === 401) return true;
  if (typeof status === "string" && /^\d+$/.test(status) && Number(status) === 401) return true;
  return false;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

/** Backend error codes → user-facing copy (auth / OTP flows). */
const BACKEND_ERROR_MESSAGES: Record<string, string> = {
  OTP_LIMIT: "Too many attempts. Try again later.",
  OTP_COOLDOWN: "Please wait 60 seconds before resending.",
  USER_NOT_FOUND: "No account found with that email.",
};

export function mapBackendErrorCode(code: string): string {
  const key = code.trim().toUpperCase();
  return BACKEND_ERROR_MESSAGES[key] ?? code;
}

function pickMessage(data: unknown): string | undefined {
  if (!isRecord(data)) return undefined;

  if (typeof data.code === "string" && data.code) {
    return mapBackendErrorCode(data.code);
  }
  if (typeof data.message === "string" && data.message) {
    return mapBackendErrorCode(data.message);
  }
  if (typeof data.error === "string" && data.error) {
    return mapBackendErrorCode(data.error);
  }
  if (Array.isArray(data.errors) && data.errors.length > 0) {
    const first = data.errors[0];
    if (typeof first === "string") return first;
    if (isRecord(first) && typeof first.message === "string") return first.message;
  }
  if (isRecord(data.errors)) {
    const entries = Object.entries(data.errors);
    if (entries.length > 0) {
      const [, val] = entries[0];
      if (typeof val === "string") return val;
      if (Array.isArray(val) && typeof val[0] === "string") return val[0];
    }
  }
  return undefined;
}

function pickFieldErrors(data: unknown): ApiFieldErrors | undefined {
  if (!isRecord(data)) return undefined;
  const raw = data.fieldErrors ?? data.fields;
  if (!isRecord(raw)) return undefined;
  const out: ApiFieldErrors = {};
  for (const [key, val] of Object.entries(raw)) {
    if (typeof val === "string") out[key] = val;
    else if (Array.isArray(val) && typeof val[0] === "string") out[key] = val[0];
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export function parseApiError(err: unknown, fallback = "Something went wrong."): ParsedApiError {
  if (err instanceof TypeError && /fetch|network/i.test(err.message)) {
    return { message: "Network error. Check your connection and try again." };
  }

  if (isRecord(err) && "status" in err) {
    const rtk = err as FetchBaseQueryError;
    const status = rtk.status;
    const data = "data" in rtk ? rtk.data : undefined;
    const message =
      pickMessage(data) ??
      (status === 401
        ? "You are not authorized. Please sign in again."
        : status === 403
          ? "You do not have permission to perform this action."
          : status === 404
            ? "The requested resource was not found."
            : status === "FETCH_ERROR"
              ? "Network error. Check your connection and try again."
              : status === 429
              ? "Too many requests. Please wait a moment and try again."
              : status === "TIMEOUT_ERROR"
                ? "Request timed out. Please try again."
                : fallback);
    return { message, status, fieldErrors: pickFieldErrors(data) };
  }

  if (err instanceof Error && err.message) {
    return { message: err.message };
  }

  return { message: fallback };
}

export function parseFetchResponseError(
  res: Response,
  body: unknown,
  fallback?: string
): ParsedApiError {
  const message =
    pickMessage(body) ??
    fallback ??
    (res.status === 401
      ? "You are not authorized."
      : res.status === 403
        ? "You do not have permission."
        : res.status === 422 || res.status === 400
          ? "Validation failed. Check your input."
          : res.status === 429
            ? "Too many requests. Please wait a moment and try again."
            : `Request failed (${res.status}).`);
  return { message, status: res.status, fieldErrors: pickFieldErrors(body) };
}
