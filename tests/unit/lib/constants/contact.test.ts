import { describe, expect, it } from "vitest";
import {
  WHATSAPP_PHONE,
  buildProductOrderMessage,
  buildWhatsAppUrl,
} from "@/lib/constants/contact";
import { mockProduct } from "../../../helpers/fixtures";

describe("buildProductOrderMessage", () => {
  it("includes product name, price, and MOQ", () => {
    const message = buildProductOrderMessage(mockProduct);
    expect(message).toContain("Wireless Earbuds");
    expect(message).toContain("NPR 2,500");
    expect(message).toContain("MOQ: 10 units");
    expect(message).toContain("Could you please provide more details?");
  });
});

describe("buildWhatsAppUrl", () => {
  it("builds wa.me URL with encoded message", () => {
    const url = buildWhatsAppUrl("Hello world");
    expect(url).toBe(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Hello world")}`);
  });

  it("accepts custom phone number", () => {
    const url = buildWhatsAppUrl("Hi", "1234567890");
    expect(url).toBe(`https://wa.me/1234567890?text=${encodeURIComponent("Hi")}`);
  });
});
