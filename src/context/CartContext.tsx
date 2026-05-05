'use client';

import { createContext, useContext, useMemo, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

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
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>("genzify-cart", []);
  const [isCartOpen, setCartOpen] = useState(false);

  function addToCart(product: any, size = "M") {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === product.id && item.size === size,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          size,
          quantity: 1,
        },
      ];
    });

    setCartOpen(true);
  }

  function removeFromCart(productId: string, size: string) {
    setItems((currentItems) =>
      currentItems.filter((item) => !(item.id === productId && item.size === size)),
    );
  }

  function updateQuantity(productId: string, size: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId && item.size === size
          ? { ...item, quantity }
          : item,
      ),
    );
  }

  const totals = useMemo(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

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

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
