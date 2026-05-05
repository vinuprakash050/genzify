'use client';

import { useMemo } from "react";
import PageIntro from "@/components/PageIntro";
import ProductGrid from "@/components/ProductGrid";
import { products } from "@/data/products";

export default function WishlistPage() {
  const wishlistProducts = useMemo(() => products.slice(2, 8), []);

  return (
    <PageIntro
      eyebrow="Wishlist"
      title="Saved pieces"
      description="A placeholder wishlist view ready for customer-specific persistence."
    >
      <ProductGrid products={wishlistProducts} />
    </PageIntro>
  );
}
