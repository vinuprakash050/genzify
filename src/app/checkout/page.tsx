'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";
import ClientOnly from "@/components/ClientOnly";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/utils/format";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [isPlacing, setIsPlacing] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: user?.email || "",
    phone: "", address: "", city: "", state: "", postal: "",
    delivery: "Standard 4-6 business days",
    cardNumber: "", cardName: "", expiry: "", cvc: "",
  });

  function handleChange(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handlePlaceOrder() {
    if (!user) {
      setError("Please log in to place an order.");
      return;
    }
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setIsPlacing(true);
    setError("");

    try {
      await addDoc(collection(db, "orders"), {
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          image: item.image,
        })),
        total: totalPrice,
        status: "pending",
        shippingAddress: `${form.firstName} ${form.lastName}, ${form.address}, ${form.city}, ${form.state} ${form.postal}`,
        deliveryMethod: form.delivery,
        createdAt: Timestamp.now(),
      });

      await clearCart();
      router.push("/order/success");
    } catch (err: any) {
      console.error("Order error:", err);
      setError("Failed to place order. Please try again.");
      setIsPlacing(false);
    }
  }

  return (
    <PageIntro
      eyebrow="Checkout"
      title="Finish your order"
      description="Complete your shipping details and place your order."
    >
      <ClientOnly fallback={<SectionCard><p className="muted-copy">Loading checkout...</p></SectionCard>}>
      <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-6">
          <SectionCard>
            <p className="text-sm uppercase tracking-[0.35em] text-secondary">Shipping Address</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                { label: "First name", key: "firstName" },
                { label: "Last name", key: "lastName" },
                { label: "Email", key: "email" },
                { label: "Phone", key: "phone" },
                { label: "Address", key: "address" },
                { label: "City", key: "city" },
                { label: "State", key: "state" },
                { label: "Postal code", key: "postal" },
              ].map(({ label, key }) => (
                <label key={key} className="block">
                  <span className="mb-2 block text-sm muted-copy">{label}</span>
                  <input
                    value={form[key as keyof typeof form]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-primary"
                  />
                </label>
              ))}
            </div>
          </SectionCard>

          <SectionCard>
            <p className="text-sm uppercase tracking-[0.35em] text-secondary">Delivery Method</p>
            <div className="mt-5 space-y-3">
              {["Standard 4-6 business days", "Express 2-3 business days", "Next day metro dispatch"].map((option) => (
                <label key={option} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <input
                    type="radio"
                    name="delivery"
                    checked={form.delivery === option}
                    onChange={() => handleChange("delivery", option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </SectionCard>

          <SectionCard>
            <p className="text-sm uppercase tracking-[0.35em] text-secondary">Payment</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                { label: "Card number", key: "cardNumber" },
                { label: "Name on card", key: "cardName" },
                { label: "Expiry", key: "expiry" },
                { label: "CVC", key: "cvc" },
              ].map(({ label, key }) => (
                <label key={key} className="block">
                  <span className="mb-2 block text-sm muted-copy">{label}</span>
                  <input
                    value={form[key as keyof typeof form]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-primary"
                  />
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
                  <p className="text-sm muted-copy">{item.quantity} x Size {item.size}</p>
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
          {error && (
            <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
          <div className="mt-6 grid gap-3">
            <button
              onClick={handlePlaceOrder}
              disabled={isPlacing || items.length === 0}
              className="glass-button inline-flex w-full justify-center rounded-2xl px-4 py-3 font-bold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPlacing ? "Placing order..." : "Place Order"}
            </button>
          </div>
          {!user && (
            <p className="mt-3 text-center text-sm muted-copy">
              You need to <a href="/login" className="text-primary">log in</a> to place an order.
            </p>
          )}
        </SectionCard>
      </div>
      </ClientOnly>
    </PageIntro>
  );
}
