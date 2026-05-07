'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Heart, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useUiTheme } from "../hooks/useUiTheme";
import { formatCurrency } from "../utils/format";

interface ProductCardProps {
  product: any;
  priority?: boolean;
}

const DEFAULT_SIZES = ["S", "M", "L", "XL"];

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const uiTheme = useUiTheme();
  const inWishlist = isInWishlist(product.id);

  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const sizes: string[] = product.sizes?.length ? product.sizes : DEFAULT_SIZES;

  function handleConfirm() {
    if (!selectedSize) return;
    addToCart(product, selectedSize);
    setShowSizeModal(false);
    setSelectedSize(null);
  }

  function handleOpen() {
    setSelectedSize(null);
    setShowSizeModal(true);
  }

  const cardVariants = {
    "glass-lift": {
      articleClass: "glass-panel group overflow-hidden rounded-[2rem]",
      hover: { y: -8, scale: 1.01 },
      imageWrapClass: "relative aspect-[3/4] w-full overflow-hidden",
      imageClass: "object-cover transition duration-500 group-hover:scale-105",
      contentClass: "space-y-4 p-5",
      buttonClass:
        "w-full rounded-2xl border border-secondary/35 px-4 py-3 font-semibold text-secondary transition hover:shadow-glow",
    },
    "tech-tilt": {
      articleClass:
        "group overflow-hidden rounded-md border border-secondary/25 bg-black/35 shadow-[0_18px_42px_rgba(0,0,0,0.35)]",
      hover: { y: -10, rotateX: -4, rotateY: 3 },
      imageWrapClass: "relative aspect-[3/4] w-full overflow-hidden",
      imageClass:
        "object-cover saturate-75 transition duration-500 group-hover:scale-[1.08] group-hover:saturate-100",
      contentClass: "space-y-4 border-t border-white/5 p-5",
      buttonClass:
        "w-full rounded-md border border-primary/45 bg-primary/8 px-4 py-3 font-semibold uppercase tracking-[0.2em] text-primary transition hover:border-secondary hover:text-secondary",
    },
    "monolith-stack": {
      articleClass:
        "group overflow-hidden rounded-[2.4rem] border border-white/10 bg-white/[0.04] shadow-[0_24px_60px_rgba(0,0,0,0.38)]",
      hover: { y: -6, scale: 1.015 },
      imageWrapClass: "relative aspect-[3/4] w-full overflow-hidden",
      imageClass:
        "object-cover grayscale-[0.08] transition duration-700 group-hover:scale-105",
      contentClass: "space-y-5 p-6",
      buttonClass:
        "w-full rounded-full border border-secondary/30 px-4 py-3 font-semibold text-secondary transition hover:bg-secondary hover:text-black",
    },
  };

  const styles = cardVariants[uiTheme.cardStyle as keyof typeof cardVariants] ?? cardVariants["glass-lift"];

  return (
    <>
      <motion.article
        layout
        whileHover={styles.hover}
        className={styles.articleClass}
        style={{ transformStyle: "preserve-3d" }}
      >
        <Link href={`/product/${product.id}`} className="block overflow-hidden">
          <div className={styles.imageWrapClass}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
              className={styles.imageClass}
            />
          </div>
        </Link>

        <div className={styles.contentClass}>
          <div className="flex items-start justify-between gap-2 sm:gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-secondary truncate">
                {product.category}
              </p>
              <Link href={`/product/${product.id}`}>
                <h3 className="mt-1 sm:mt-2 text-lg sm:text-xl font-semibold text-white transition group-hover:text-primary line-clamp-2">
                  {product.name}
                </h3>
              </Link>
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <span className="text-base sm:text-lg font-bold text-primary">
                {formatCurrency(product.price)}
              </span>
              <button
                onClick={() => toggleWishlist(product)}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                className="text-white/40 hover:text-red-400 transition"
              >
                <Heart size={16} fill={inWishlist ? "currentColor" : "none"} className={inWishlist ? "text-red-400" : ""} />
              </button>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleOpen}
            className={`${styles.buttonClass} text-sm sm:text-base`}
          >
            Add to Cart
          </motion.button>
        </div>
      </motion.article>

      {/* Size selection modal */}
      <AnimatePresence>
        {showSizeModal && (
          <motion.div
            key="size-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.72)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowSizeModal(false); }}
          >
            <motion.div
              key="size-modal"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="glass-panel w-full max-w-sm rounded-[2rem] p-6 space-y-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.3em] text-secondary">Select Size</p>
                  <h3 className="mt-1 text-lg font-bold text-white truncate">{product.name}</h3>
                </div>
                <button
                  onClick={() => setShowSizeModal(false)}
                  className="text-white/40 hover:text-white transition flex-shrink-0 mt-1"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Size grid */}
              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                      selectedSize === size
                        ? "border-primary bg-primary text-black"
                        : "border-white/15 bg-white/5 text-white/80 hover:border-secondary hover:text-secondary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {/* Confirm */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleConfirm}
                disabled={!selectedSize}
                className="glass-button w-full rounded-full px-6 py-3 font-bold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {selectedSize ? `Add ${selectedSize} to Cart` : "Pick a size"}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
