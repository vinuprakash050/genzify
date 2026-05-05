'use client';

import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useAuth } from "./AuthContext";
import { db } from "@/lib/firebase";
import {
  collection, doc, addDoc, getDocs, deleteDoc,
  updateDoc, query, where, Timestamp
} from "firebase/firestore";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
  [key: string]: any;
}

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  itemCount: number;
  totalPrice: number;
  addToCart: (product: any, size?: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>("genzify-cart", []);
  const [isCartOpen, setCartOpen] = useState(false);
  const { user } = useAuth();

  // When user logs in, load their cart from Firestore and merge with local
  useEffect(() => {
    if (!user) return;

    async function syncFromFirestore() {
      try {
        const q = query(collection(db, "cart"), where("userId", "==", user!.id));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          // No Firestore cart — push local items to Firestore
          for (const item of items) {
            await saveItemToFirestore(user!.id, item);
          }
        } else {
          // Load Firestore cart into local state, deduplicate by id+size
          const seen = new Set<string>();
          const firestoreItems: CartItem[] = [];
          for (const d of snapshot.docs) {
            const data = d.data();
            const key = `${data.productId}-${data.size}`;
            if (seen.has(key)) continue;
            seen.add(key);
            firestoreItems.push({
              id: data.productId,
              name: data.name,
              price: data.price,
              quantity: data.quantity,
              size: data.size,
              image: data.image,
              _firestoreId: d.id,
            });
          }
          setItems(firestoreItems);
        }
      } catch (err) {
        console.error("Cart sync error:", err);
      }
    }

    syncFromFirestore();
  }, [user?.id]);

  async function saveItemToFirestore(userId: string, item: CartItem) {
    try {
      await addDoc(collection(db, "cart"), {
        userId,
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        image: item.image,
        addedAt: Timestamp.now(),
      });
    } catch (err) {
      console.error("Error saving cart item:", err);
    }
  }

  async function removeItemFromFirestore(userId: string, productId: string, size: string) {
    try {
      const q = query(
        collection(db, "cart"),
        where("userId", "==", userId),
        where("productId", "==", productId),
        where("size", "==", size),
      );
      const snapshot = await getDocs(q);
      for (const d of snapshot.docs) {
        await deleteDoc(doc(db, "cart", d.id));
      }
    } catch (err) {
      console.error("Error removing cart item:", err);
    }
  }

  async function updateItemInFirestore(userId: string, productId: string, size: string, quantity: number) {
    try {
      const q = query(
        collection(db, "cart"),
        where("userId", "==", userId),
        where("productId", "==", productId),
        where("size", "==", size),
      );
      const snapshot = await getDocs(q);
      for (const d of snapshot.docs) {
        await updateDoc(doc(db, "cart", d.id), { quantity });
      }
    } catch (err) {
      console.error("Error updating cart item:", err);
    }
  }

  function addToCart(product: any, size = "M") {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === product.id && item.size === size,
      );

      if (existingItem) {
        if (user) updateItemInFirestore(user.id, product.id, size, existingItem.quantity + 1);
        return currentItems.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      const newItem = { ...product, size, quantity: 1 };
      if (user) saveItemToFirestore(user.id, newItem);
      return [...currentItems, newItem];
    });

    setCartOpen(true);
  }

  function removeFromCart(productId: string, size: string) {
    if (user) removeItemFromFirestore(user.id, productId, size);
    setItems((currentItems) =>
      currentItems.filter((item) => !(item.id === productId && item.size === size)),
    );
  }

  function updateQuantity(productId: string, size: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    if (user) updateItemInFirestore(user.id, productId, size, quantity);
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId && item.size === size ? { ...item, quantity } : item,
      ),
    );
  }

  async function clearCart() {
    if (user) {
      try {
        const q = query(collection(db, "cart"), where("userId", "==", user.id));
        const snapshot = await getDocs(q);
        for (const d of snapshot.docs) {
          await deleteDoc(doc(db, "cart", d.id));
        }
      } catch (err) {
        console.error("Error clearing cart:", err);
      }
    }
    setItems([]);
  }

  const totals = useMemo(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { itemCount, totalPrice };
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        ...totals,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart: () => setCartOpen(true),
        closeCart: () => setCartOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
