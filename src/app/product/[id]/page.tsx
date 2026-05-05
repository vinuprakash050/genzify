'use client';

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/utils/format";
import PageTransition from "@/components/PageTransition";

const sizes = ["S", "M", "L", "XL"];

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("M");

  const product = useMemo(
    () => products.find((item) => item.id === productId),
    [productId],
  );

  if (!product) {
    return (
      <PageTransition className="px-4 py-20 sm:px-6 lg:px-10">
        <div className="glass-panel mx-auto max-w-2xl rounded-[2rem] p-8 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-secondary">Not Found</p>
          <h1 className="mt-3 text-4xl font-black uppercase">Product unavailable</h1>
          <Link
            href="/products"
            className="mt-6 inline-flex rounded-full border border-primary/30 px-6 py-3 text-primary"
          >
            Back to catalog
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="px-4 pb-20 pt-8 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel overflow-hidden rounded-[2.5rem]"
        >
          <img src={product.image} alt={product.name} className="h-full min-h-[28rem] w-full object-cover" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel rounded-[2.5rem] p-8"
        >
          <p className="text-sm uppercase tracking-[0.35em] text-secondary">{product.category}</p>
          <h1 className="mt-3 text-4xl font-black uppercase text-white sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 text-3xl font-bold text-primary">{formatCurrency(product.price)}</p>
          <p className="mt-6 max-w-xl leading-8 muted-copy">
            Sculpted for oversized comfort with a premium silhouette and a modular frontend experience ready to connect to product, shipping, and order services.
          </p>

          <div className="mt-8">
            <p className="mb-3 text-sm uppercase tracking-[0.35em] text-secondary">Select Size</p>
            <div className="flex flex-wrap gap-3">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-full border px-5 py-3 text-sm font-semibold transition ${
                    selectedSize === size
                      ? "border-primary bg-primary text-black"
                      : "border-white/10 bg-white/5 text-white/80 hover:border-secondary hover:text-secondary"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => addToCart(product, selectedSize)}
              className="glass-button rounded-full px-7 py-4 text-sm font-black uppercase tracking-[0.25em]"
            >
              Add to Cart
            </motion.button>
            <Link
              href="/products"
              className="rounded-full border border-secondary/30 px-7 py-4 text-sm font-black uppercase tracking-[0.25em] text-secondary transition hover:shadow-glow"
            >
              Keep Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
