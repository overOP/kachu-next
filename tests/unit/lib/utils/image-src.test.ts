import { describe, expect, it } from "vitest";
import { resolveImageSrc } from "@/lib/utils/image-src";

describe("resolveImageSrc", () => {
  it("keeps relative upload paths", () => {
    expect(resolveImageSrc("/uploads/products/a.png")).toBe("/uploads/products/a.png");
  });

  it("strips localhost origin from upload URLs", () => {
    expect(
      resolveImageSrc("http://localhost:3000/uploads/products/a.png")
    ).toBe("/uploads/products/a.png");
  });

  it("strips loopback IP origin from upload URLs", () => {
    expect(resolveImageSrc("http://127.0.0.1:3000/uploads/products/a.png")).toBe(
      "/uploads/products/a.png"
    );
  });

  it("leaves external URLs unchanged", () => {
    const remote = "https://images.unsplash.com/photo-1.jpg";
    expect(resolveImageSrc(remote)).toBe(remote);
  });
});
