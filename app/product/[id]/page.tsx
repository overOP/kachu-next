import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteShell from "@/components/layout/SiteShell";
import ProductDetail from "@/components/product/ProductDetail";
import Footer from "@/components/Footer";
import { fetchProductById, fetchRelatedProducts } from "@/lib/services/products";
import { fetchReviewsForProduct } from "@/lib/services/reviews";
import ProductReviews from "@/components/product/ProductReviews";

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

  const [relatedProducts, reviews] = await Promise.all([
    fetchRelatedProducts(product, 2),
    fetchReviewsForProduct(parsedId),
  ]);

  const reviewAverage =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  return (
    <SiteShell>
      <ProductDetail
        product={product}
        relatedProducts={relatedProducts}
        reviewAverage={reviewAverage}
      />
      <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 md:px-10">
        <ProductReviews productId={parsedId} initialReviews={reviews} />
      </div>
      <Footer />
    </SiteShell>
  );
}
