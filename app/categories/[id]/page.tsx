import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import SiteShell from "@/components/layout/SiteShell";
import Footer from "@/components/Footer";
import PageHero from "@/components/layout/PageHero";
import ProductCard from "@/components/products/ProductCard";
import {
  fetchCategoryById,
  fetchProductsForCategoryId,
} from "@/lib/services/products";

type CategoryPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { id } = await params;
  const category = await fetchCategoryById(id);
  if (!category) return { title: "Category" };
  return {
    title: category.name,
    description: category.description ?? `Products in ${category.name}`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  const [category, products] = await Promise.all([
    fetchCategoryById(id),
    fetchProductsForCategoryId(id),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <SiteShell>
      <PageHero
        eyebrow="Category"
        title={category.name}
        description={
          category.description ??
          `${products.length} product${products.length === 1 ? "" : "s"} in this category.`
        }
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {category.image ? (
          <div className="relative mb-10 h-48 w-full overflow-hidden rounded-2xl sm:h-64">
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        ) : null}

        {products.length === 0 ? (
          <p className="text-center text-slate-600 dark:text-zinc-400">
            No products in this category yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} variant="compact" />
            ))}
          </div>
        )}

        <p className="mt-10 text-center">
          <Link
            href="/products"
            className="font-semibold text-emerald-700 underline dark:text-sky-400"
          >
            ← All products
          </Link>
        </p>
      </section>
      <Footer />
    </SiteShell>
  );
}
