/** Re-export canonical types; seed data kept as offline fallback. */
export type { Product, ProductCore, Category as ProductCategory } from "@/lib/types/api";

import type { Product, ProductCore } from "@/lib/types/api";

export const PRODUCTS_DATA: Record<string, ProductCore[]> = {
  coco: [
    {
      id: 1,
      name: "Coco Powder",
      brand: "Coco",
      price: "NPR 13,641",
      img: "https://5.imimg.com/data5/SELLER/Default/2023/5/308328905/KB/KA/VP/798985/cocoa-powder-1-kg-1000x1000.jpg",
      rate: "4.5(1k reviews)",
      quantity: "MOQ: 50 units",
      logo: "https://i.pinimg.com/originals/1e/c1/d2/1ec1d2ce366d1f603b1bde70ae508063.png",
      Description: "High-quality cocoa powder perfect for baking and beverages.",
    },
    {
      id: 2,
      name: "Dark Chocolate",
      brand: "Coco",
      price: "NPR 1,500",
      img: "https://tse1.mm.bing.net/th/id/OIP.VeVdBK9dzHdUR6Lcadl1fwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
      rate: "4.5(1k reviews)",
      quantity: "MOQ: 50 units",
      logo: "https://i.pinimg.com/originals/1e/c1/d2/1ec1d2ce366d1f603b1bde70ae508063.png",
      Description: "Rich and delicious dark chocolate for desserts and snacks.",
    },
  ],
  kraft: [
    {
      id: 3,
      name: "Kraft Cheese",
      brand: "Kraft",
      price: "NPR 800",
      img: "https://kraftnaturalcheese.com/wp-content/uploads/2022/07/shredded_sharp-cheddar_fine_8oz.jpg",
      rate: "4.5(1k reviews)",
      quantity: "MOQ: 50 units",
      logo: "https://logos-world.net/wp-content/uploads/2023/03/Kraft-Foods-Logo-1960-500x281.png",
      Description: "Creamy and flavorful cheese for your meals.",
    },
  ],
  pepsi: [
    {
      id: 5,
      name: "Pepsi Can",
      brand: "Pepsi",
      price: "NPR 200",
      img: "https://www.pizzaboxbanksiagrove.com.au/wp-content/uploads/2023/02/Can-Pepsi.jpg",
      rate: "4.5(1k reviews)",
      quantity: "MOQ: 50 units",
      logo: "https://1000logos.net/wp-content/uploads/2017/05/Pepsi-Logo-1969-2048x1152.png",
      Description: "Refreshing and carbonated soft drink in a can.",
    },
  ],
  nestle: [
    {
      id: 7,
      name: "Nestle Milk",
      brand: "Nestle",
      price: "NPR 500",
      img: "https://pbs.twimg.com/media/E4pfDxPWEAQ7aGb.jpg",
      rate: "4.5(1k reviews)",
      quantity: "MOQ: 50 units",
      logo: "https://logoeps.com/wp-content/uploads/2013/04/nestle-deserts-vector-logo.png",
      Description: "Fresh and nutritious milk for your family.",
    },
  ],
};

const CATEGORY_LABELS: Record<string, string> = {
  coco: "Coco & chocolate",
  kraft: "Kraft",
  pepsi: "Pepsi",
  nestle: "Nestlé",
};

export function getSeedProductCategories(): { slug: string; label: string }[] {
  return Object.keys(PRODUCTS_DATA).map((slug) => ({
    slug,
    label: CATEGORY_LABELS[slug] ?? slug,
  }));
}

export const allProducts: Product[] = (
  Object.entries(PRODUCTS_DATA) as [string, ProductCore[]][]
).flatMap(([slug, items]) => items.map((p) => ({ ...p, categorySlug: slug })));

export function filterProductsByCategorySlug(
  products: Product[],
  slug: string | null,
  validSlugs?: ReadonlySet<string>
): Product[] {
  if (!slug || slug === "all") return products;
  if (validSlugs && validSlugs.size > 0 && !validSlugs.has(slug)) {
    return products;
  }
  return products.filter((p) => p.categorySlug === slug);
}

/** @deprecated Prefer fetchProductById from @/lib/services/products */
export const getProductById = (id: number) => allProducts.find((item) => item.id === id);
