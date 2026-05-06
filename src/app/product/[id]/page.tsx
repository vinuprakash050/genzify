'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/utils/format";
import PageTransition from "@/components/PageTransition";
import ClientOnly from "@/components/ClientOnly";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { products as localProducts } from "@/data/products";

const sizes = ["S", "M", "L", "XL"];

function ProductDetailContent() {
  const params = useParams();
  const productId = params.id as string;
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("M");
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        // Try Firestore first (Firestore auto-generated ID)
        const snap = await getDoc(doc(db, "products", productId));
        if (snap.exists()) {
          setProduct({ id: snap.id, ...snap.data() });
          return;
        }
        // Fallback: check local products (for seeded products with ts-001 etc.)
        const local = localProducts.find((p) => p.id === productId);
        if (local) {
          setProduct(local);
          return;
        }
        setProduct(null);
      } catch (err) {
        // Firestore failed — try local fallback
        const local = localProducts.find((p) => p.id === productId);
        setProduct(local || null);
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  if (isLoading) {
    return (
      <PageTransition className="px-4 py-20 sm:px-6 lg:px-10">
        <div className="glass-panel mx-auto max-w-2xl rounded-[2rem] p-8 text-center">
          <p className="muted-copy">Loading product...</p>
        </div>
      </PageTransition>
    );
  }

  if (!product) {
    return (
      <PageTransition className="px-4 py-20 sm:px-6 lg:px-10">
        <div className="glass-panel mx-auto max-w-2xl rounded-[2rem] p-8 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-secondary">Not Found</p>
          <h1 className="mt-3 text-4xl font-black uppercase">Product unavailable</h1>
          <Link href="/products" className="mt-6 inline-flex rounded-full border border-primary/30 px-6 py-3 text-primary">
            Back to catalog
          </Link>
        </div>
      </PageTransition>
    );
  }

  const productSizes = product.sizes || sizes;

  return (
    <PageTransition className="px-4 pb-20 pt-8 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel overflow-hidden rounded-[2.5rem]"
        >
          <img
            src={product.image}
            alt={product.name}
            className="h-full min-h-[28rem] w-full object-cover"
          />
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
            {product.description || "Sculpted for oversized comfort with a premium silhouette."}
          </p>
          {product.fabric && (
            <p className="mt-2 text-sm muted-copy">{product.fabric}</p>
          )}

          <div className="mt-8">
            <p className="mb-3 text-sm uppercase tracking-[0.35em] text-secondary">Select Size</p>
            <div className="flex flex-wrap gap-3">
              {productSizes.map((size: string) => (
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

export default function ProductDetailPage() {
  return (
    <ClientOnly fallback={
      <PageTransition className="px-4 py-20 sm:px-6 lg:px-10">
        <div className="glass-panel mx-auto max-w-2xl rounded-[2rem] p-8 text-center">
          <p className="muted-copy">Loading...</p>
        </div>
      </PageTransition>
    }>
      <ProductDetailContent />
    </ClientOnly>
  );
}
