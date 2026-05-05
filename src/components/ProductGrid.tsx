'use client';

import { AnimatePresence, motion } from "framer-motion";
import { useUiTheme } from "../hooks/useUiTheme";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: any[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const uiTheme = useUiTheme();
  const gridClass = {
    standard: "grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3",
    dense: "grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4",
    offset: "grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3",
  }[uiTheme.gridStyle as string] ?? "grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3";

  return (
    <motion.div layout className={gridClass}>
      <AnimatePresence mode="popLayout">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            layout
            initial={
              uiTheme.cardStyle === "tech-tilt"
                ? { opacity: 0, y: 20, scale: 0.98 }
                : { opacity: 0, y: 20 }
            }
            animate={
              uiTheme.cardStyle === "monolith-stack" && index % 3 === 1
                ? { opacity: 1, y: 18 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            exit={{ opacity: 0, y: 16 }}
            transition={{ delay: index * 0.04 }}
            className={uiTheme.gridStyle === "offset" && index % 3 === 1 ? "xl:pt-10" : ""}
          >
            <ProductCard product={product} priority={index < 2} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
