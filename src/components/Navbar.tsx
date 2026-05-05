'use client';

import { motion } from "framer-motion";
import { Heart, LogIn, ShoppingBag, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { categories } from "../data/products";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useUiTheme } from "../hooks/useUiTheme";

function HeaderActions({ isCompact }: { isCompact: boolean }) {
  const router = useRouter();
  const { user, logout, openLogin } = useAuth();
  const { itemCount, openCart } = useCart();

  return (
    <motion.div
      animate={{
        gap: isCompact ? 20 : 28,
      }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-6 sm:gap-8"
    >
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={openCart}
        animate={{
          padding: isCompact ? 11 : 13,
        }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-full border border-secondary/30 p-2 sm:p-3 text-secondary transition hover:shadow-glow"
        aria-label="Open cart"
      >
        <ShoppingBag size={16} />
        {itemCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-black">
            {itemCount}
          </span>
        )}
      </motion.button>

      {user ? (
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/wishlist")}
            className="rounded-full border border-white/10 p-3 text-white/80 transition hover:border-secondary/40 hover:text-secondary"
            aria-label="Wishlist"
          >
            <Heart size={18} />
          </button>
          <button
            onClick={() => router.push("/account")}
            className="hidden rounded-full border border-primary/30 px-4 py-2 text-sm text-primary md:block"
          >
            {user.name}
          </button>
          <button
            onClick={logout}
            className="rounded-full border border-white/10 p-3 text-white/80 transition hover:border-primary/50 hover:text-primary"
            aria-label="Log out"
          >
            <User2 size={18} />
          </button>
        </div>
      ) : (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={openLogin}
          className="flex items-center justify-center gap-2 rounded-full border border-primary/30 px-4 py-2.5 text-sm text-primary transition hover:shadow-glow-primary"
        >
          <LogIn size={16} />
          Login
        </motion.button>
      )}
    </motion.div>
  );
}

function CategoryLinks({
  activeCategory,
  isCompact,
  mobile = false,
}: {
  activeCategory: string | null;
  isCompact: boolean;
  mobile?: boolean;
}) {
  const pathname = usePathname();

  const baseClass = mobile
    ? "flex gap-2 overflow-x-auto pb-1 md:hidden"
    : "hidden items-center md:flex";

  return (
    <motion.nav
      animate={
        mobile
          ? { marginTop: isCompact ? 10 : 16, opacity: isCompact ? 0.9 : 1 }
          : { gap: isCompact ? 8 : 18 }
      }
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className={baseClass}
    >
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/products?category=${encodeURIComponent(category.id)}`}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            mobile ? "whitespace-nowrap" : ""
          } ${
            pathname === "/products" && activeCategory === category.id
              ? "bg-primary/15 text-primary"
              : "muted-copy hover:text-secondary"
          }`}
        >
          {category.label}
        </Link>
      ))}
    </motion.nav>
  );
}

function TransparentFloatHeader({
  activeCategory,
  isCompact,
}: {
  activeCategory: string | null;
  isCompact: boolean;
}) {
  return (
    <motion.header
      animate={{
        paddingLeft: isCompact ? 16 : 0,
        paddingRight: isCompact ? 16 : 0,
        paddingTop: isCompact ? 14 : 0,
      }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-30"
    >
      <motion.div
        animate={{ maxWidth: isCompact ? 1180 : 9999 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full"
      >
        <motion.div
          animate={{
            paddingLeft: isCompact ? 22 : 38,
            paddingRight: isCompact ? 22 : 38,
            paddingTop: isCompact ? 14 : 10,
            paddingBottom: isCompact ? 14 : 10,
            borderRadius: isCompact ? 30 : 0,
            borderColor: isCompact
              ? "color-mix(in srgb, var(--color-secondary) 24%, rgba(255,255,255,0.14) 76%)"
              : "transparent",
            background: isCompact
              ? "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 12%, rgba(255,255,255,0.1) 88%), color-mix(in srgb, var(--color-secondary) 10%, rgba(255,255,255,0.06) 90%))"
              : "transparent",
            boxShadow: isCompact
              ? "0 18px 60px rgba(0, 0, 0, 0.38), 0 0 32px color-mix(in srgb, var(--color-secondary) 10%, transparent)"
              : "none",
            backdropFilter: isCompact ? "blur(18px)" : "blur(0px)",
          }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="border"
        >
          <div className="flex items-center justify-between gap-4">
            <motion.div
              animate={{ scale: isCompact ? 0.96 : 1 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href="/"
                className="text-xl font-black uppercase tracking-[0.4em] text-primary"
              >
                GENZIFY
              </Link>
            </motion.div>

            <CategoryLinks activeCategory={activeCategory} isCompact={isCompact} />

            <HeaderActions isCompact={isCompact} />
          </div>

          <CategoryLinks activeCategory={activeCategory} isCompact={isCompact} mobile />
        </motion.div>
      </motion.div>
    </motion.header>
  );
}

function TechFrameHeader({
  activeCategory,
  isCompact,
}: {
  activeCategory: string | null;
  isCompact: boolean;
}) {
  return (
    <motion.header
      animate={{ paddingTop: isCompact ? 10 : 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-30"
    >
      <motion.div
        animate={{
          marginLeft: isCompact ? 18 : 0,
          marginRight: isCompact ? 18 : 0,
          borderRadius: isCompact ? 24 : 0,
          borderColor: "color-mix(in srgb, var(--color-secondary) 30%, rgba(255,255,255,0.08) 70%)",
          background: isCompact
            ? "linear-gradient(180deg, rgba(6,10,18,0.94), rgba(5,9,14,0.86))"
            : "linear-gradient(180deg, rgba(6,10,18,0.88), rgba(5,9,14,0.58))",
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="border-b md:border"
      >
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-4">
            <span className="hidden h-px w-8 bg-secondary/60 md:block" />
            <Link href="/" className="text-lg font-black uppercase tracking-[0.45em] text-secondary">
              GENZIFY
            </Link>
          </div>

          <CategoryLinks activeCategory={activeCategory} isCompact={isCompact} />

          <div className="flex items-center gap-3">
            <HeaderActions isCompact={isCompact} />
          </div>
        </div>
        <div className="mx-auto max-w-[1500px] px-5 pb-3 sm:px-8 md:hidden">
          <CategoryLinks activeCategory={activeCategory} isCompact={isCompact} mobile />
        </div>
      </motion.div>
    </motion.header>
  );
}

function EditorialRibbonHeader({
  activeCategory,
  isCompact,
}: {
  activeCategory: string | null;
  isCompact: boolean;
}) {
  return (
    <motion.header
      animate={{ paddingTop: isCompact ? 16 : 24 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-30 px-4 sm:px-6 lg:px-10"
    >
      <motion.div
        animate={{
          maxWidth: isCompact ? 1180 : 1320,
          borderRadius: isCompact ? 999 : 28,
          paddingLeft: isCompact ? 18 : 24,
          paddingRight: isCompact ? 18 : 24,
          paddingTop: isCompact ? 12 : 16,
          paddingBottom: isCompact ? 12 : 16,
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="glass-panel mx-auto"
      >
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-xl font-black uppercase tracking-[0.35em] text-white">
            <span className="text-primary">GEN</span>ZIFY
          </Link>

          <CategoryLinks activeCategory={activeCategory} isCompact={isCompact} />

          <HeaderActions isCompact={isCompact} />
        </div>
        <div className="mx-auto md:hidden">
          <CategoryLinks activeCategory={activeCategory} isCompact={isCompact} mobile />
        </div>
      </motion.div>
    </motion.header>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const uiTheme = useUiTheme();
  const [isCompact, setIsCompact] = useState(false);

  // Reads live from searchParams — updates whenever category changes without page reload
  const activeCategory = searchParams.get("category");

  useEffect(() => {
    function handleScroll() {
      setIsCompact(window.scrollY > 56);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (uiTheme.headerStyle === "tech-frame") {
    return (
      <TechFrameHeader
        activeCategory={activeCategory}
        isCompact={isCompact}
      />
    );
  }

  if (uiTheme.headerStyle === "editorial-ribbon") {
    return (
      <EditorialRibbonHeader
        activeCategory={activeCategory}
        isCompact={isCompact}
      />
    );
  }

  return (
    <TransparentFloatHeader
      activeCategory={activeCategory}
      isCompact={isCompact}
    />
  );
}
