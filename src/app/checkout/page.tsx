'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";
import ClientOnly from "@/components/ClientOnly";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRazorpay } from "@/hooks/useRazorpay";
import { formatCurrency } from "@/utils/format";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { sendOrderConfirmationEmail } from "@/lib/emailjs";

function CheckoutContent() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { isLoaded, openRazorpay } = useRazorpay();
  const [isPlacing, setIsPlacing] = useState(false);
  const [error, setError] = useState("");
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");

  const [form, setForm] = useState({
    firstName: "", lastName: "",
    email: user?.email || "", phone: "",
    address: "", city: "", state: "", postal: "",
    delivery: "Standard 4-6 business days",
  });

  function handleChange(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function fetchLocationAddress() {
    setLocationError("");
    if (!navigator.geolocation) {
      setLocationError("GPS not supported on this device.");
      return;
    }

    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "en" } },
          );
          const data = await res.json();
          const addr = data.address || {};

          setForm((f) => ({
            ...f,
            address: [addr.road, addr.suburb, addr.neighbourhood]
              .filter(Boolean).join(", ") || addr.display_name?.split(",")[0] || "",
            city: addr.city || addr.town || addr.village || addr.county || "",
            state: addr.state || "",
            postal: addr.postcode || "",
          }));
        } catch (err) {
          setLocationError("Could not fetch address. Please fill manually.");
        } finally {
          setIsFetchingLocation(false);
        }
      },
      (err) => {
        setIsFetchingLocation(false);
        if (err.code === 1) setLocationError("Location permission denied. Please allow access.");
        else if (err.code === 2) setLocationError("Location unavailable. Please fill manually.");
        else setLocationError("Could not get location. Please fill manually.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  async function saveOrderToFirestore(paymentId: string, razorpayOrderId: string) {
    const shippingAddress = `${form.firstName} ${form.lastName}, ${form.address}, ${form.city}, ${form.state} ${form.postal}`;

    await addDoc(collection(db, "orders"), {
      userId: user!.id,
      userEmail: user!.email,
      userName: user!.name,
      items: items.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        image: item.image,
      })),
      total: totalPrice,
      status: "paid",
      paymentId,
      razorpayOrderId,
      shippingAddress,
      deliveryMethod: form.delivery,
      createdAt: Timestamp.now(),
    });

    // Auto-save address to user profile
    if (form.address && form.city) {
      try {
        const userRef = doc(db, "users", user!.id);
        const userSnap = await getDoc(userRef);
        const existing: any[] = userSnap.exists() ? (userSnap.data().addresses || []) : [];
        const alreadySaved = existing.some((a: any) => a.line === shippingAddress);
        if (!alreadySaved) {
          await updateDoc(userRef, {
            addresses: [...existing, { label: "Shipping", line: shippingAddress }],
          });
        }
      } catch (err) {
        console.error("Error saving address:", err);
      }
    }

    // Send order confirmation email via EmailJS (non-blocking)
    sendOrderConfirmationEmail({
      to_name: user!.name,
      to_email: user!.email,
      order_id: paymentId.slice(0, 12).toUpperCase(),
      order_date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
      items_summary: items.map((item) => `${item.name} x${item.quantity} (${item.size})`).join(", "),
      order_total: formatCurrency(totalPrice),
      shipping_address: shippingAddress,
      delivery_method: form.delivery,
      payment_id: paymentId,
    });
  }

  async function handlePayment() {
    if (!user) { setError("Please log in to place an order."); return; }
    if (items.length === 0) { setError("Your cart is empty."); return; }
    if (!form.firstName || !form.address || !form.city) {
      setError("Please fill in your shipping address.");
      return;
    }

    setIsPlacing(true);
    setError("");

    openRazorpay({
      amount: totalPrice,          // INR amount
      currency: "INR",
      name: "Genzify",
      description: `Order of ${items.length} item${items.length > 1 ? "s" : ""}`,
      prefill: {
        name: user.name,
        email: user.email,
        contact: form.phone,
      },
      onSuccess: async (paymentId, razorpayOrderId) => {
        try {
          await saveOrderToFirestore(paymentId, razorpayOrderId);
          await clearCart();
          router.push("/order/success");
        } catch (err) {
          console.error("Post-payment error:", err);
          setError("Payment succeeded but order save failed. Contact support with payment ID: " + paymentId);
          setIsPlacing(false);
        }
      },
      onFailure: (err) => {
        if (err.message !== "Payment cancelled") {
          setError(err.message || "Payment failed. Please try again.");
        }
        setIsPlacing(false);
      },
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
      <div className="space-y-6">
        <SectionCard>
          <div className="flex items-center justify-between">
            <p className="text-sm uppercase tracking-[0.35em] text-secondary">Shipping Address</p>
            <button
              type="button"
              onClick={fetchLocationAddress}
              disabled={isFetchingLocation}
              className="flex items-center gap-2 rounded-full border border-secondary/30 px-4 py-2 text-xs text-secondary transition hover:bg-secondary/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFetchingLocation ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border border-secondary border-t-transparent" />
                  Fetching...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
                    <path d="m4.93 4.93 2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/>
                  </svg>
                  Use My Location
                </>
              )}
            </button>
          </div>
          {locationError && (
            <p className="mt-2 text-xs text-red-400">{locationError}</p>
          )}
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
            {[
              "Standard 4-6 business days",
              "Express 2-3 business days",
              "Next day metro dispatch",
            ].map((option) => (
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

        {/* Payment handled by Razorpay modal — no card fields needed */}
        <SectionCard>
          <p className="text-sm uppercase tracking-[0.35em] text-secondary">Payment</p>
          <p className="mt-4 muted-copy text-sm">
            Secure payment powered by Razorpay. Supports UPI, cards, net banking, and wallets.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {["UPI", "Cards", "Net Banking", "Wallets"].map((method) => (
              <span key={method} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
                {method}
              </span>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard className="h-fit">
        <p className="text-sm uppercase tracking-[0.35em] text-secondary">Order Review</p>
        <div className="mt-5 space-y-4">
          {items.map((item, i) => (
            <div key={`${item.id}-${item.size}-${i}`} className="flex items-center justify-between gap-3">
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

        <div className="mt-6">
          <button
            onClick={handlePayment}
            disabled={isPlacing || items.length === 0 || !isLoaded}
            className="glass-button inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 font-bold disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPlacing ? "Processing..." : !isLoaded ? "Loading..." : `Pay ${formatCurrency(totalPrice)}`}
          </button>
        </div>

        {!user && (
          <p className="mt-3 text-center text-sm muted-copy">
            <a href="/login" className="text-primary">Log in</a> to place an order.
          </p>
        )}
      </SectionCard>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <PageIntro
      eyebrow="Checkout"
      title="Finish your order"
      description="Complete your shipping details and pay securely with Razorpay."
    >
      <ClientOnly fallback={<SectionCard><p className="muted-copy">Loading checkout...</p></SectionCard>}>
        <CheckoutContent />
      </ClientOnly>
    </PageIntro>
  );
}
