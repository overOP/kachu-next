import type { SanityImageSource } from "@sanity/image-url";
import { getSanityClient, urlForImage } from "@/lib/sanity/client";
import type { Category, Product } from "@/lib/types/api";

type SanityCategoryDoc = {
  name: string;
  slug: string;
  description?: string | null;
  image?: SanityImageSource | null;
  isActive?: boolean;
};

type SanityProductDoc = {
  name: string;
  slug: string;
  price: number;
  description: string;
  minimumOrder?: number;
  stock?: number | null;
  images?: SanityImageSource[];
  isActive?: boolean;
  category?: SanityCategoryDoc | null;
};

const CATEGORY_PROJECTION = `{ name, "slug": slug.current, description, image, isActive }`;
const PRODUCT_PROJECTION = `{
  name,
  "slug": slug.current,
  price,
  description,
  minimumOrder,
  stock,
  images,
  isActive,
  category->${CATEGORY_PROJECTION}
}`;

function toCategory(doc: SanityCategoryDoc): Category {
  return {
    id: doc.slug,
    name: doc.name,
    description: doc.description ?? null,
    image: doc.image ? urlForImage(doc.image) : null,
    isActive: doc.isActive ?? true,
  };
}

function toProduct(doc: SanityProductDoc): Product {
  return {
    id: doc.slug,
    name: doc.name,
    price: doc.price,
    description: doc.description,
    minimumOrder: doc.minimumOrder ?? 1,
    stock: doc.stock ?? null,
    images: (doc.images ?? []).map(urlForImage),
    categoryId: doc.category?.slug ?? "",
    category: doc.category ? toCategory(doc.category) : undefined,
    isActive: doc.isActive ?? true,
  };
}

export async function fetchSanityProducts(categorySlug?: string): Promise<Product[]> {
  const query = categorySlug
    ? `*[_type == "product" && isActive != false && category->slug.current == $categorySlug] ${PRODUCT_PROJECTION}`
    : `*[_type == "product" && isActive != false] ${PRODUCT_PROJECTION}`;
  const docs = await getSanityClient().fetch<SanityProductDoc[]>(query, { categorySlug: categorySlug ?? "" });
  return docs.map(toProduct);
}

export async function fetchSanityProductBySlug(slug: string): Promise<Product | undefined> {
  const doc = await getSanityClient().fetch<SanityProductDoc | null>(
    `*[_type == "product" && slug.current == $slug][0] ${PRODUCT_PROJECTION}`,
    { slug }
  );
  return doc ? toProduct(doc) : undefined;
}

export async function fetchSanityCategories(): Promise<Category[]> {
  const docs = await getSanityClient().fetch<SanityCategoryDoc[]>(
    `*[_type == "category" && isActive != false] ${CATEGORY_PROJECTION}`
  );
  return docs.map(toCategory);
}

export async function fetchSanityCategoryBySlug(slug: string): Promise<Category | undefined> {
  const doc = await getSanityClient().fetch<SanityCategoryDoc | null>(
    `*[_type == "category" && slug.current == $slug][0] ${CATEGORY_PROJECTION}`,
    { slug }
  );
  return doc ? toCategory(doc) : undefined;
}
