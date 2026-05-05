'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useUiTheme } from "../hooks/useUiTheme";
import { formatCurrency } from "../utils/format";

interface ProductCardProps {
  product: any;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const uiTheme = useUiTheme();

  const cardVariants = {
    "glass-lift": {
      articleClass: "glass-panel group overflow-hidden rounded-[2rem]",
      hover: { y: -8, scale: 1.01 },
      imageClass: "h-80 w-full object-cover transition duration-500 group-hover:scale-105",
      contentClass: "space-y-4 p-5",
      buttonClass:
        "w-full rounded-2xl border border-secondary/35 px-4 py-3 font-semibold text-secondary transition hover:shadow-glow",
    },
    "tech-tilt": {
      articleClass:
        "group overflow-hidden rounded-md border border-secondary/25 bg-black/35 shadow-[0_18px_42px_rgba(0,0,0,0.35)]",
      hover: { y: -10, rotateX: -4, rotateY: 3 },
      imageClass:
        "h-72 w-full object-cover saturate-75 transition duration-500 group-hover:scale-[1.08] group-hover:saturate-100",
      contentClass: "space-y-4 border-t border-white/5 p-5",
      buttonClass:
        "w-full rounded-md border border-primary/45 bg-primary/8 px-4 py-3 font-semibold uppercase tracking-[0.2em] text-primary transition hover:border-secondary hover:text-secondary",
    },
    "monolith-stack": {
      articleClass:
        "group overflow-hidden rounded-[2.4rem] border border-white/10 bg-white/[0.04] shadow-[0_24px_60px_rgba(0,0,0,0.38)]",
      hover: { y: -6, scale: 1.015 },
      imageClass:
        "h-[22rem] w-full object-cover grayscale-[0.08] transition duration-700 group-hover:scale-105",
      contentClass: "space-y-5 p-6",
      buttonClass:
        "w-full rounded-full border border-secondary/30 px-4 py-3 font-semibold text-secondary transition hover:bg-secondary hover:text-black",
    },
  };

  const styles = cardVariants[uiTheme.cardStyle as keyof typeof cardVariants] ?? cardVariants["glass-lift"];

  return (
    <motion.article
      layout
      whileHover={styles.hover}
      className={styles.articleClass}
      style={{ transformStyle: "preserve-3d" }}
    >
      <Link href={`/product/${product.id}`} className="block overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading={priority ? "eager" : "lazy"}
          className={styles.imageClass}
        />
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
          <span className="text-base sm:text-lg font-bold text-primary flex-shrink-0">
            {formatCurrency(product.price)}
          </span>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => addToCart(product, "M")}
          className={`${styles.buttonClass} text-sm sm:text-base`}
        >
          Add to Cart
        </motion.button>
      </div>
    </motion.article>
  );
}
