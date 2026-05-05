'use client';

import { motion } from "framer-motion";
import { categories } from "../data/products";

interface CategoryTabsProps {
  activeCategory: string;
  onChange: (category: string) => void;
}

function CategoryTabs({ activeCategory, onChange }: CategoryTabsProps) {
  return (
    <div className="inline-flex flex-wrap gap-3 rounded-full border border-white/10 bg-white/5 p-2">
      {categories.map((category) => {
        const isActive = category.id === activeCategory;

        return (
          <button
            key={category.id}
            onClick={() => onChange(category.id)}
            className={`relative rounded-full px-5 py-3 text-sm font-semibold transition ${
              isActive ? "text-black" : "text-white/70 hover:text-secondary"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="category-pill"
                className="absolute inset-0 rounded-full bg-secondary"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{category.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default CategoryTabs;
