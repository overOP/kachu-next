/** Unwrap `{ data: T }` or return payload as-is. */
export function unwrapData<T>(res: unknown): T {
  if (res != null && typeof res === "object" && "data" in res) {
    const data = (res as { data: unknown }).data;
    if (data !== undefined) return data as T;
  }
  return res as T;
}

function readArray<T>(obj: unknown, keys: string[]): T[] | undefined {
  if (obj == null || typeof obj !== "object") return undefined;
  const record = obj as Record<string, unknown>;
  for (const key of keys) {
    const val = record[key];
    if (Array.isArray(val)) return val as T[];
  }
  return undefined;
}

function readItem<T>(obj: unknown, keys: string[]): T | undefined {
  if (obj == null || typeof obj !== "object") return undefined;
  const record = obj as Record<string, unknown>;
  for (const key of keys) {
    const val = record[key];
    if (val != null && typeof val === "object" && !Array.isArray(val)) return val as T;
  }
  return undefined;
}

/** Extract a list from common API envelope shapes. */
export function extractList<T>(res: unknown, keys: string[]): T[] {
  if (Array.isArray(res)) return res as T[];
  const unwrapped = unwrapData(res);
  if (Array.isArray(unwrapped)) return unwrapped as T[];
  const fromData = readArray<T>(unwrapped, keys);
  if (fromData) return fromData;
  return readArray<T>(res, keys) ?? [];
}

/** Extract a single entity from common API envelope shapes. */
export function extractItem<T>(res: unknown, keys: string[]): T | undefined {
  const unwrapped = unwrapData(res);
  if (unwrapped != null && typeof unwrapped === "object" && !Array.isArray(unwrapped)) {
    const direct = unwrapped as T;
    const keyed = readItem<T>(unwrapped, keys);
    return keyed ?? direct;
  }
  return readItem<T>(res, keys);
}

/** Read access token from login or refresh responses. */
export function extractAccessToken(json: unknown): string | undefined {
  if (json == null || typeof json !== "object") return undefined;
  const r = json as Record<string, unknown>;

  if (typeof r.accessToken === "string" && r.accessToken) return r.accessToken;
  if (typeof r.token === "string" && r.token) return r.token;

  const data = r.data;
  if (data != null && typeof data === "object") {
    const d = data as Record<string, unknown>;
    if (typeof d.accessToken === "string" && d.accessToken) return d.accessToken;
    if (typeof d.token === "string" && d.token) return d.token;
  }
  return undefined;
}

export function extractUser<T>(json: unknown): T | undefined {
  if (json == null || typeof json !== "object") return undefined;
  const r = json as Record<string, unknown>;
  if (r.user && typeof r.user === "object") return r.user as T;
  const data = r.data;
  if (data != null && typeof data === "object" && (data as Record<string, unknown>).user) {
    return (data as Record<string, unknown>).user as T;
  }
  return undefined;
}
