'use client';

import { useMemo } from "react";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import SectionHeader from "@/components/SectionHeader";
import ProductGrid from "@/components/ProductGrid";
import PageTransition from "@/components/PageTransition";
import { products } from "@/data/products";
import { useUiTheme } from "@/hooks/useUiTheme";

export default function HomePage() {
  const featuredProducts = useMemo(() => products.slice(0, 6), []);
  const uiTheme = useUiTheme();

  const sectionWrapClass = {
    "split-glass": "px-4 pb-20 pt-10 sm:px-6 lg:px-10",
    "magazine-grid": "px-4 pb-24 pt-14 sm:px-6 lg:px-10",
    "editorial-stack": "px-4 pb-24 pt-16 sm:px-6 lg:px-10",
  }[uiTheme.heroStyle as string] ?? "px-4 pb-20 pt-10 sm:px-6 lg:px-10";

  const ctaClass = {
    "split-glass":
      "rounded-full border border-primary/35 px-6 py-3 text-sm font-bold uppercase tracking-[0.25em] text-primary transition hover:shadow-glow-primary",
    "magazine-grid":
      "rounded-md border border-secondary/35 px-6 py-3 text-sm font-bold uppercase tracking-[0.3em] text-secondary transition hover:bg-secondary hover:text-black",
    "editorial-stack":
      "rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold uppercase tracking-[0.25em] text-white transition hover:border-primary hover:text-primary",
  }[uiTheme.heroStyle as string] ?? "rounded-full border border-primary/35 px-6 py-3 text-sm font-bold uppercase tracking-[0.25em] text-primary transition hover:shadow-glow-primary";

  return (
    <PageTransition>
      <HeroSection />

      <section id="featured-drop" className={sectionWrapClass}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              eyebrow="Featured Drop"
              title="Minimal, sharp, and built to move"
              description="A modular storefront experience with fluid motion, glass surfaces, and a future-ready frontend architecture."
            />
            <Link href="/products" className={ctaClass}>
              Browse All
            </Link>
          </div>

          <ProductGrid products={featuredProducts} />
        </div>
      </section>
    </PageTransition>
  );
}
