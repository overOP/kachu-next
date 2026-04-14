import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteShell from "@/components/layout/SiteShell";
import ProductDetail from "@/components/product/ProductDetail";
import Footer from "@/components/Footer";
import { fetchProductById, fetchRelatedProducts } from "@/lib/services/products";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const parsedId = Number(id);
  const product = Number.isFinite(parsedId)
    ? await fetchProductById(parsedId)
    : undefined;
  if (!product) {
    return { title: "Product" };
  }
  return {
    title: product.name,
    description: product.Description,
    openGraph: {
      title: product.name,
      description: product.Description,
      images: [product.img],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const parsedId = Number(id);

  if (!Number.isFinite(parsedId)) {
    notFound();
  }

  const product = await fetchProductById(parsedId);

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
