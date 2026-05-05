'use client';

import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/utils/format";

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();

  return (
    <PageIntro
      eyebrow="Checkout"
      title="Finish your order"
      description="A backend-ready checkout shell with shipping, delivery, payment, and review sections."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-6">
          <SectionCard>
            <p className="text-sm uppercase tracking-[0.35em] text-secondary">Shipping Address</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {["First name", "Last name", "Email", "Phone", "Address", "City", "State", "Postal code"].map((label) => (
                <label key={label} className="block">
                  <span className="mb-2 block text-sm muted-copy">{label}</span>
                  <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3" />
                </label>
              ))}
            </div>
          </SectionCard>

          <SectionCard>
            <p className="text-sm uppercase tracking-[0.35em] text-secondary">Delivery Method</p>
            <div className="mt-5 space-y-3">
              {[
                "Standard 4-6 business days",
                "Express 2-3 business days",
                "Next day metro dispatch",
              ].map((option, index) => (
                <label key={option} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <input type="radio" name="delivery" defaultChecked={index === 0} />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </SectionCard>

          <SectionCard>
            <p className="text-sm uppercase tracking-[0.35em] text-secondary">Payment</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {["Card number", "Name on card", "Expiry", "CVC"].map((label) => (
                <label key={label} className="block">
                  <span className="mb-2 block text-sm muted-copy">{label}</span>
                  <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3" />
                </label>
              ))}
            </div>
          </SectionCard>
        </div>

        <SectionCard className="h-fit">
          <p className="text-sm uppercase tracking-[0.35em] text-secondary">Order Review</p>
          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm muted-copy">
                    {item.quantity} x Size {item.size}
                  </p>
                </div>
                <span>{formatCurrency(item.quantity * item.price)}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between text-lg">
              <span>Total</span>
              <span className="font-bold text-primary">{formatCurrency(totalPrice)}</span>
            </div>
          </div>
          <div className="mt-6 grid gap-3">
            <Link href="/order/success" className="glass-button inline-flex justify-center rounded-2xl px-4 py-3 font-bold">
              Place Order
            </Link>
            <Link href="/order/failed" className="inline-flex justify-center rounded-2xl border border-secondary/30 px-4 py-3 text-secondary">
              Simulate Payment Failure
            </Link>
          </div>
        </SectionCard>
      </div>
    </PageIntro>
  );
}
