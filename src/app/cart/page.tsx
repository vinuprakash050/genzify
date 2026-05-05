'use client';

import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/utils/format";

export default function CartPage() {
  const { items, totalPrice, updateQuantity, removeFromCart } = useCart();

  return (
    <PageIntro
      eyebrow="Cart"
      title="Your bag"
      description="Review line items, adjust quantity, and move into checkout."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_24rem] xl:grid-cols-[1fr_28rem]">
        <div className="space-y-4">
          {items.length === 0 ? (
            <SectionCard>
              <p className="text-lg font-semibold text-primary">Your bag is empty.</p>
              <p className="mt-3 muted-copy">Browse the current drop and add a few pieces here.</p>
              <Link href="/products" className="mt-6 inline-flex rounded-full border border-secondary/30 px-6 py-3 text-secondary">
                Continue Shopping
              </Link>
            </SectionCard>
          ) : (
            items.map((item) => (
              <SectionCard key={`${item.id}-${item.size}`} className="flex flex-col gap-4 sm:flex-row">
                <img src={item.image} alt={item.name} className="h-24 w-20 sm:h-32 sm:w-28 rounded-2xl object-cover" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold">{item.name}</h3>
                      <p className="mt-1 muted-copy">Size {item.size}</p>
                    </div>
                    <span className="font-bold text-primary">{formatCurrency(item.price)}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(event) =>
                        updateQuantity(item.id, item.size, Number(event.target.value))
                      }
                      className="w-20 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                    />
                    <button
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="text-sm text-secondary"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </SectionCard>
            ))
          )}
        </div>

        <SectionCard className="h-fit">
          <p className="text-sm uppercase tracking-[0.35em] text-secondary">Summary</p>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="muted-copy">Subtotal</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="muted-copy">Shipping</span>
              <span>Calculated at checkout</span>
            </div>
          </div>
          <div className="mt-6 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between text-lg">
              <span>Total</span>
              <span className="font-bold text-primary">{formatCurrency(totalPrice)}</span>
            </div>
          </div>
          <Link href="/checkout" className="glass-button mt-6 inline-flex w-full justify-center rounded-2xl px-4 py-3 font-bold">
            Continue to Checkout
          </Link>
        </SectionCard>
      </div>
    </PageIntro>
  );
}
