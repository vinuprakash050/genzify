'use client';

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import PageIntro from "@/components/PageIntro";
import ProductGrid from "@/components/ProductGrid";
import { fetchProducts } from "@/utils/api";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").toLowerCase();
  const [allProducts, setAllProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts().then(setAllProducts);
  }, []);

  const results = useMemo(
    () => allProducts.filter((product) => product.name.toLowerCase().includes(query)),
    [query, allProducts],
  );

  return (
    <PageIntro
      eyebrow="Search"
      title={`Results for "${query || "all"}"`}
      description="A placeholder search results page ready for catalog search endpoints and filters."
    >
      <ProductGrid products={results.length ? results : allProducts.slice(0, 6)} />
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
