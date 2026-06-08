import { describe, expect, it } from "vitest";
import {
  extractAccessToken,
  extractItem,
  extractList,
  extractUser,
  unwrapData,
} from "@/lib/api/parse-response";
import { mockAdmin, mockProduct } from "../../../helpers/fixtures";

describe("unwrapData", () => {
  it("unwraps { data: T } envelopes", () => {
    expect(unwrapData({ data: { id: 1 } })).toEqual({ id: 1 });
  });

  it("returns payload as-is when no data key", () => {
    expect(unwrapData({ products: [] })).toEqual({ products: [] });
  });

  it("returns primitives unchanged", () => {
    expect(unwrapData(null)).toBe(null);
    expect(unwrapData("hello")).toBe("hello");
  });
});

describe("extractList", () => {
  it("returns a bare array response", () => {
    expect(extractList([mockProduct], ["products"])).toEqual([mockProduct]);
  });

  it("extracts from top-level keyed array", () => {
    expect(extractList({ products: [mockProduct] }, ["products"])).toEqual([mockProduct]);
  });

  it("extracts from data envelope", () => {
    expect(extractList({ data: { products: [mockProduct] } }, ["products"])).toEqual([
      mockProduct,
    ]);
  });

  it("returns empty array when key is missing", () => {
    expect(extractList({ message: "ok" }, ["products"])).toEqual([]);
  });

  it("tries multiple keys in order", () => {
    expect(extractList({ items: [1, 2] }, ["products", "items"])).toEqual([1, 2]);
  });
});

describe("extractItem", () => {
  it("extracts keyed entity from response", () => {
    expect(extractItem({ product: mockProduct }, ["product"])).toEqual(mockProduct);
  });

  it("extracts from data envelope", () => {
    expect(extractItem({ data: { product: mockProduct } }, ["product"])).toEqual(mockProduct);
  });

  it("returns unwrapped object when no key matches", () => {
    expect(extractItem({ id: "x", name: "Direct" }, ["product"])).toEqual({
      id: "x",
      name: "Direct",
    });
  });

  it("returns undefined for non-object responses", () => {
    expect(extractItem(null, ["product"])).toBeUndefined();
    expect(extractItem("bad", ["product"])).toBeUndefined();
  });
});

describe("extractAccessToken", () => {
  it("reads accessToken from top level", () => {
    expect(extractAccessToken({ accessToken: "abc" })).toBe("abc");
  });

  it("reads token alias from top level", () => {
    expect(extractAccessToken({ token: "legacy" })).toBe("legacy");
  });

  it("reads accessToken from data envelope", () => {
    expect(extractAccessToken({ data: { accessToken: "nested" } })).toBe("nested");
  });

  it("prefers accessToken over token", () => {
    expect(extractAccessToken({ accessToken: "new", token: "old" })).toBe("new");
  });

  it("returns undefined for empty or invalid payloads", () => {
    expect(extractAccessToken(null)).toBeUndefined();
    expect(extractAccessToken({ accessToken: "" })).toBeUndefined();
    expect(extractAccessToken({ data: {} })).toBeUndefined();
  });
});

describe("extractUser", () => {
  it("reads user from top level", () => {
    expect(extractUser({ user: mockAdmin })).toEqual(mockAdmin);
  });

  it("reads user from data envelope", () => {
    expect(extractUser({ data: { user: mockAdmin } })).toEqual(mockAdmin);
  });

  it("returns undefined when user is absent", () => {
    expect(extractUser({ token: "x" })).toBeUndefined();
    expect(extractUser(null)).toBeUndefined();
  });
});
