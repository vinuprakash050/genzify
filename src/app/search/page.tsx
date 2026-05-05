'use client';

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import PageIntro from "@/components/PageIntro";
import ProductGrid from "@/components/ProductGrid";
import { products } from "@/data/products";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").toLowerCase();
  const results = useMemo(
    () => products.filter((product) => product.name.toLowerCase().includes(query)),
    [query],
  );

  return (
    <PageIntro
      eyebrow="Search"
      title={`Results for "${query || "all"}"`}
      description="A placeholder search results page ready for catalog search endpoints and filters."
    >
      <ProductGrid products={results.length ? results : products.slice(0, 6)} />
    </PageIntro>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchContent />
    </Suspense>
  );
}
