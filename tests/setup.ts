import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

// Node >=22 defines global `localStorage` / `sessionStorage` getters that return
// undefined unless the experimental --localstorage-file flag is set. Those getters
// shadow jsdom's window.localStorage on globalThis, so bare `localStorage` inside
// app code (guarded by `typeof window !== "undefined"`) resolves to undefined and
// throws. Re-expose the jsdom storages on globalThis so the test env matches a
// browser, where bare `localStorage` === `window.localStorage`.
function installWebStorage(kind: "localStorage" | "sessionStorage"): void {
  if (typeof window === "undefined") return;
  const globalScope = globalThis as Record<string, unknown>;
  if (globalScope[kind] != null) return;
  try {
    Object.defineProperty(globalThis, kind, {
      value: window[kind],
      configurable: true,
      writable: true,
    });
  } catch {
    // Node's global can't be redefined on some versions; leave it as-is.
  }
}

installWebStorage("localStorage");
installWebStorage("sessionStorage");

beforeEach(() => {
  globalThis.localStorage?.clear();
  globalThis.sessionStorage?.clear();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
