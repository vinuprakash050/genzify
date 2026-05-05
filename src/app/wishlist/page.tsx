'use client';

import PageIntro from "@/components/PageIntro";
import ProductGrid from "@/components/ProductGrid";
import SectionCard from "@/components/SectionCard";
import ClientOnly from "@/components/ClientOnly";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

function WishlistContent() {
  const { user } = useAuth();
  const { wishlistProducts } = useWishlist();

  if (!user) {
    return (
      <SectionCard>
        <p className="muted-copy">Please <Link href="/login" className="text-primary">log in</Link> to view your saved pieces.</p>
      </SectionCard>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <SectionCard>
        <p className="text-lg font-semibold text-primary">No saved pieces yet.</p>
        <p className="mt-2 muted-copy">Tap the heart icon on any product to save it here.</p>
        <Link href="/products" className="mt-6 inline-flex rounded-full border border-secondary/30 px-6 py-3 text-secondary">
          Browse Products
        </Link>
      </SectionCard>
    );
  }

  return <ProductGrid products={wishlistProducts} />;
}

export default function WishlistPage() {
  return (
    <PageIntro
      eyebrow="Wishlist"
      title="Saved pieces"
      description="Products you've saved. Tap the heart on any product to add or remove."
    >
      <ClientOnly fallback={<div className="muted-copy text-sm">Loading wishlist...</div>}>
        <WishlistContent />
      </ClientOnly>
    </PageIntro>
  );
}
