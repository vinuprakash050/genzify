'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { db } from "@/lib/firebase";
import {
  collection, query, where, getDocs,
  addDoc, deleteDoc, doc, Timestamp
} from "firebase/firestore";

interface WishlistContextType {
  wishlist: string[]; // product IDs
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: any) => void;
  wishlistProducts: any[];
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      setWishlistProducts([]);
      return;
    }
    async function loadWishlist() {
      try {
        const q = query(collection(db, "wishlist"), where("userId", "==", user!.id));
        const snap = await getDocs(q);
        const ids: string[] = [];
        const prods: any[] = [];
        snap.docs.forEach((d) => {
          const data = d.data();
          ids.push(data.productId);
          prods.push({ ...data.product, _wishlistDocId: d.id });
        });
        setWishlist(ids);
        setWishlistProducts(prods);
      } catch (err) {
        console.error("Error loading wishlist:", err);
      }
    }
    loadWishlist();
  }, [user?.id]);

  function isInWishlist(productId: string) {
    return wishlist.includes(productId);
  }

  async function toggleWishlist(product: any) {
    if (!user) return;

    if (isInWishlist(product.id)) {
      // Remove
      try {
        const q = query(
          collection(db, "wishlist"),
          where("userId", "==", user.id),
          where("productId", "==", product.id),
        );
        const snap = await getDocs(q);
        for (const d of snap.docs) await deleteDoc(doc(db, "wishlist", d.id));
        setWishlist((prev) => prev.filter((id) => id !== product.id));
        setWishlistProducts((prev) => prev.filter((p) => p.id !== product.id));
      } catch (err) {
        console.error("Error removing from wishlist:", err);
      }
    } else {
      // Add
      try {
        await addDoc(collection(db, "wishlist"), {
          userId: user.id,
          productId: product.id,
          product,
          addedAt: Timestamp.now(),
        });
        setWishlist((prev) => [...prev, product.id]);
        setWishlistProducts((prev) => [...prev, product]);
      } catch (err) {
        console.error("Error adding to wishlist:", err);
      }
    }
  }

  return (
    <WishlistContext.Provider value={{ wishlist, isInWishlist, toggleWishlist, wishlistProducts }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
