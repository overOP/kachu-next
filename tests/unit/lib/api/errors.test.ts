import { describe, expect, it } from "vitest";
import {
  isUnauthorizedError,
  mapBackendErrorCode,
  parseApiError,
  parseFetchResponseError,
} from "@/lib/api/errors";

describe("isUnauthorizedError", () => {
  it("returns true for numeric 401", () => {
    expect(isUnauthorizedError({ status: 401, data: { message: "No refresh token" } })).toBe(
      true
    );
  });

  it("returns true for string status 401", () => {
    expect(isUnauthorizedError({ status: "401", data: {} })).toBe(true);
  });

  it("returns false for other statuses", () => {
    expect(isUnauthorizedError({ status: 403, data: {} })).toBe(false);
    expect(isUnauthorizedError({ status: "FETCH_ERROR", data: {} })).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isUnauthorizedError(undefined)).toBe(false);
  });
});

describe("mapBackendErrorCode", () => {
  it("maps OTP and auth error codes to friendly messages", () => {
    expect(mapBackendErrorCode("OTP_LIMIT")).toBe("Too many attempts. Try again later.");
    expect(mapBackendErrorCode("otp_cooldown")).toBe("Please wait 60 seconds before resending.");
    expect(mapBackendErrorCode("USER_NOT_FOUND")).toBe("No account found with that email.");
  });

  it("returns unknown codes unchanged", () => {
    expect(mapBackendErrorCode("SOME_OTHER_CODE")).toBe("SOME_OTHER_CODE");
  });
});

describe("parseApiError", () => {
  it("parses network TypeError", () => {
    const err = new TypeError("Failed to fetch");
    expect(parseApiError(err).message).toMatch(/Network error/);
  });

  it("uses API message from RTK error data", () => {
    const result = parseApiError({
      status: 400,
      data: { message: "Invalid email" },
    });
    expect(result.message).toBe("Invalid email");
    expect(result.status).toBe(400);
  });

  it("maps backend error codes in message field", () => {
    expect(parseApiError({ status: 429, data: { message: "OTP_LIMIT" } }).message).toBe(
      "Too many attempts. Try again later."
    );
    expect(parseApiError({ status: 429, data: { message: "OTP_COOLDOWN" } }).message).toBe(
      "Please wait 60 seconds before resending."
    );
    expect(parseApiError({ status: 404, data: { message: "USER_NOT_FOUND" } }).message).toBe(
      "No account found with that email."
    );
  });

  it("maps backend error codes in code field", () => {
    expect(parseApiError({ status: 404, data: { code: "USER_NOT_FOUND" } }).message).toBe(
      "No account found with that email."
    );
  });

  it("maps 401 to auth message", () => {
    expect(parseApiError({ status: 401, data: {} }).message).toMatch(/not authorized/i);
  });

  it("maps 403 to permission message", () => {
    expect(parseApiError({ status: 403, data: {} }).message).toMatch(/permission/i);
  });

  it("maps 404 to not found message", () => {
    expect(parseApiError({ status: 404, data: {} }).message).toMatch(/not found/i);
  });

  it("maps 429 to rate limit message", () => {
    expect(parseApiError({ status: 429, data: {} }).message).toMatch(/Too many requests/i);
  });

  it("maps FETCH_ERROR status", () => {
    expect(parseApiError({ status: "FETCH_ERROR", data: {} }).message).toMatch(/Network error/i);
  });

  it("maps TIMEOUT_ERROR status", () => {
    expect(parseApiError({ status: "TIMEOUT_ERROR", data: {} }).message).toMatch(/timed out/i);
  });

  it("extracts field errors from data.fields", () => {
    const result = parseApiError({
      status: 422,
      data: { fields: { email: "Required", password: ["Too short"] } },
    });
    expect(result.fieldErrors).toEqual({ email: "Required", password: "Too short" });
  });

  it("falls back for generic Error", () => {
    expect(parseApiError(new Error("Boom")).message).toBe("Boom");
  });

  it("uses custom fallback for unknown shapes", () => {
    expect(parseApiError({}, "Custom fallback").message).toBe("Custom fallback");
  });
});

describe("parseFetchResponseError", () => {
  it("uses body message when present", () => {
    const res = new Response(null, { status: 400 });
    const parsed = parseFetchResponseError(res, { message: "Bad request" });
    expect(parsed.message).toBe("Bad request");
    expect(parsed.status).toBe(400);
  });

  it("maps backend error codes from fetch response body", () => {
    const res = new Response(null, { status: 429 });
    expect(parseFetchResponseError(res, { message: "OTP_COOLDOWN" }).message).toBe(
      "Please wait 60 seconds before resending."
    );
  });

  it("maps 401 without body", () => {
    const res = new Response(null, { status: 401 });
    expect(parseFetchResponseError(res, null).message).toMatch(/not authorized/i);
  });

  it("maps 429 without body", () => {
    const res = new Response(null, { status: 429 });
    expect(parseFetchResponseError(res, null).message).toMatch(/Too many requests/i);
  });

  it("uses explicit fallback", () => {
    const res = new Response(null, { status: 500 });
    expect(parseFetchResponseError(res, null, "Server exploded").message).toBe("Server exploded");
  });

  it("defaults to status-based message", () => {
    const res = new Response(null, { status: 418 });
    expect(parseFetchResponseError(res, null).message).toBe("Request failed (418).");
  });
});
