import { describe, expect, it } from "vitest";
import { getVisiblePageNumbers } from "@/lib/utils/pagination";

describe("getVisiblePageNumbers", () => {
  it("returns all pages when total is within maxVisible", () => {
    expect(getVisiblePageNumbers(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("returns single page for totalPages 1", () => {
    expect(getVisiblePageNumbers(1, 1)).toEqual([1]);
  });

  it("centers window around current page", () => {
    expect(getVisiblePageNumbers(10, 20, 7)).toEqual([7, 8, 9, 10, 11, 12, 13]);
  });

  it("clamps window at start", () => {
    expect(getVisiblePageNumbers(1, 20, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("clamps window at end", () => {
    expect(getVisiblePageNumbers(20, 20, 7)).toEqual([14, 15, 16, 17, 18, 19, 20]);
  });

  it("respects custom maxVisible", () => {
    expect(getVisiblePageNumbers(5, 10, 3)).toEqual([4, 5, 6]);
  });
});
