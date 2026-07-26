import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteShell from "@/components/layout/SiteShell";
import ProductDetail from "@/components/product/ProductDetail";
import Footer from "@/components/Footer";
import ProductReviews from "@/components/product/ProductReviews";
import { fetchProductById, fetchRelatedProducts } from "@/lib/services/products";
import { fetchReviewsForProduct } from "@/lib/services/reviews";
import { averageRatingFromReviews, productImage } from "@/lib/utils/product-display";

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
  const [product, reviews] = await Promise.all([
    fetchProductById(id),
    fetchReviewsForProduct(id),
  ]);

  if (!product) {
    notFound();
  }

  const relatedProducts = await fetchRelatedProducts(product, 2);

  const reviewAverage = averageRatingFromReviews(reviews);

  return (
    <SiteShell>
      <ProductDetail
        product={product}
        relatedProducts={relatedProducts}
        reviewAverage={reviewAverage}
        reviewCount={reviews.length}
      />
      <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 md:px-10">
        <ProductReviews productId={id} initialReviews={reviews} />
      </div>
      <Footer />
    </SiteShell>
  );
}
