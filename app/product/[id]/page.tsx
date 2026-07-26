import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteShell from "@/components/layout/SiteShell";
import ProductDetail from "@/components/product/ProductDetail";
import Footer from "@/components/Footer";
import { fetchProductById, fetchRelatedProducts } from "@/lib/services/products";
import { productImage } from "@/lib/utils/product-display";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamicParams = true;

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductById(id);
  if (!product) {
    return { title: "Product" };
  }
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [productImage(product)],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await fetchRelatedProducts(product, 2);

  return (
    <SiteShell>
      <ProductDetail product={product} relatedProducts={relatedProducts} />
      <Footer />
    </SiteShell>
  );
}
