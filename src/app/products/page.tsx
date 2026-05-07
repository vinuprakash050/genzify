'use client';

import { Suspense } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import ProductGrid from "@/components/ProductGrid";
import SectionHeader from "@/components/SectionHeader";
import PageTransition from "@/components/PageTransition";
import { categories } from "@/data/products";
import { fetchProducts } from "@/utils/api";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [catalog, setCatalog] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const defaultCategory = categories[0].id;
  const activeCategory = searchParams.get("category") || defaultCategory;

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      setIsLoading(true);
      const fetchedProducts = await fetchProducts();

      if (mounted) {
        setCatalog(fetchedProducts);
        setIsLoading(false);
      }
    }

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const categoryExists = categories.some((category) => category.id === activeCategory);

    if (!categoryExists) {
      router.replace(`/products?category=${defaultCategory}`);
    }
  }, [activeCategory, defaultCategory, router]);

  const filteredProducts = useMemo(
    () => catalog.filter((product) => product.category === activeCategory),
    [activeCategory, catalog],
  );

  return (
    <PageTransition className="px-4 pb-24 pt-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Catalog"
          title="Streetwear built for the spotlight"
          description="Switch between categories with animated tabs and a responsive product grid designed for seamless future API integration."
        />

        <div className="mt-10 sm:mt-14">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={index}
                  animate={{ opacity: [0.35, 0.6, 0.35] }}
                  transition={{ repeat: Infinity, duration: 1.4, delay: index * 0.08 }}
                  className="glass-panel h-[28rem] rounded-[2rem]"
                />
              ))}
            </div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </div>
      </div>
    </PageTransition>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsContent />
    </Suspense>
  );
}
