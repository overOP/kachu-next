import { describe, expect, it } from "vitest";
import { formatRateForApi, parseRateValue } from "@/lib/utils/rating";

describe("parseRateValue", () => {
  it("rounds finite numbers to 1–5", () => {
    expect(parseRateValue(4.2)).toBe(4);
    expect(parseRateValue(5)).toBe(5);
    // Numbers clamp to minimum 1 per legacy catalog display rules.
    expect(parseRateValue(0)).toBe(1);
  });

  it("clamps numbers above 5", () => {
    expect(parseRateValue(9)).toBe(5);
  });

  it("parses legacy rate strings", () => {
    expect(parseRateValue("4.5(1k reviews)")).toBe(5);
    expect(parseRateValue("3 stars")).toBe(3);
  });

  it("returns 0 for unparseable values", () => {
    expect(parseRateValue("")).toBe(0);
    expect(parseRateValue(null)).toBe(0);
    expect(parseRateValue(undefined)).toBe(0);
    expect(parseRateValue("no rating")).toBe(0);
  });
});

describe("formatRateForApi", () => {
  it("clamps and stringifies star count", () => {
    expect(formatRateForApi(4.6)).toBe("5");
    expect(formatRateForApi(1)).toBe("1");
  });

  it("clamps low values to 1", () => {
    expect(formatRateForApi(0)).toBe("1");
    expect(formatRateForApi(-2)).toBe("1");
  });

  it("clamps high values to 5", () => {
    expect(formatRateForApi(10)).toBe("5");
  });
});
