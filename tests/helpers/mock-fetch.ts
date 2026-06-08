import { vi } from "vitest";

type MockResponseInit = {
  ok?: boolean;
  status?: number;
  body?: unknown;
  headers?: Record<string, string>;
};

export function jsonResponse({
  ok = true,
  status = ok ? 200 : 400,
  body = {},
  headers = { "Content-Type": "application/json" },
}: MockResponseInit = {}): Response {
  return new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers,
  });
}

export type FetchHandlerContext = {
  url: string;
  method: string;
  headers: Headers;
  body: string | undefined;
};

function resolveFetchContext(
  input: RequestInfo | URL,
  init?: RequestInit
): FetchHandlerContext {
  if (input instanceof Request) {
    return {
      url: input.url,
      method: input.method.toUpperCase(),
      headers: input.headers,
      body: undefined,
    };
  }

  let url: string;
  if (typeof input === "string") {
    url = input;
  } else if (input instanceof URL) {
    url = input.href;
  } else {
    url = input.url;
  }
  const headers = new Headers(init?.headers ?? {});
  const method = (init?.method ?? "GET").toUpperCase();
  const body = typeof init?.body === "string" ? init.body : undefined;

  return { url, method, headers, body };
}

export function getHeader(
  headers: Headers,
  name: string
): string | null {
  return headers.get(name);
}

export function createFetchMock(
  handler: (
    ctx: FetchHandlerContext
  ) => MockResponseInit | Response | Promise<MockResponseInit | Response>
) {
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const ctx = resolveFetchContext(input, init);
    const result = await handler(ctx);
    if (result instanceof Response) return result;
    const { ok = true, status = ok ? 200 : 400, body, headers } = result;
    return jsonResponse({ ok, status, body, headers });
  });

  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

export function mockNetworkError() {
  const fetchMock = vi.fn(async () => {
    throw new TypeError("Failed to fetch");
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}
