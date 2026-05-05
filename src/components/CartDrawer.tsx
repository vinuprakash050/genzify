'use client';

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/format";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    totalPrice,
    closeCart,
    removeFromCart,
    updateQuantity,
  } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            aria-label="Close cart"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="glass-panel fixed right-0 top-0 z-50 flex h-screen w-full max-w-xs sm:max-w-md flex-col rounded-l-[2rem] p-4 sm:p-6"
          >
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-secondary">Your Cart</p>
                <h2 className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold">Ready to wear</h2>
              </div>
              <button
                onClick={closeCart}
                className="rounded-full border border-white/10 p-2 text-white/70 transition hover:border-secondary/40 hover:text-secondary"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-1 pb-2">
              {items.length === 0 ? (
                <div className="glass-panel rounded-[1.75rem] p-5 text-center">
                  <p className="text-lg font-semibold text-primary">Your cart is empty</p>
                  <p className="mt-2 muted-copy">Add a few oversized essentials to get started.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="glass-panel flex gap-4 rounded-[1.75rem] p-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-16 sm:h-24 sm:w-20 rounded-2xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-white">{item.name}</h3>
                          <p className="mt-1 text-sm muted-copy">Size {item.size}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="text-white/60 transition hover:text-primary"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.size, item.quantity - 1)
                            }
                            className="text-white/70 transition hover:text-secondary"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-5 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.size, item.quantity + 1)
                            }
                            className="text-white/70 transition hover:text-secondary"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="font-semibold text-secondary">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-auto rounded-[1.75rem] border border-white/10 bg-white/5 p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between text-lg">
                <span className="muted-copy">Total</span>
                <span className="font-bold text-primary">{formatCurrency(totalPrice)}</span>
              </div>
              <div className="space-y-2">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="block w-full text-center rounded-xl border border-white/10 px-3 py-2.5 text-sm text-white/80 transition hover:border-secondary/40 hover:text-secondary"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="glass-button block w-full text-center rounded-xl px-3 py-2.5 text-sm font-bold"
                >
                  Continue to Checkout
                </Link>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
