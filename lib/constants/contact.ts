import type { Product } from "@/lib/types/api";
import { productMoqLabel, productPriceLabel } from "@/lib/utils/product-display";

/** WhatsApp business line for order inquiries. */
export const WHATSAPP_PHONE = "9779857043288";

export function buildProductOrderMessage(product: Product): string {
  return [
    "Hello! I'm interested in the following product:",
    "",
    `Product: ${product.name}`,
    `Price: ${productPriceLabel(product)}`,
    `MOQ: ${productMoqLabel(product)}`,
    "",
    "Could you please provide more details?",
  ].join("\n");
}

export function buildWhatsAppUrl(message: string, phone: string = WHATSAPP_PHONE): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
