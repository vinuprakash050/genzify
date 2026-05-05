'use client';

import { useEffect, useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function useRazorpay() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (window.Razorpay) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => console.error("Failed to load Razorpay SDK");
    document.body.appendChild(script);

    return () => {
      // Don't remove — may be needed by other components
    };
  }, []);

  async function openRazorpay(options: {
    amount: number; // in INR
    currency?: string;
    name: string;
    description: string;
    prefill?: { name?: string; email?: string; contact?: string };
    onSuccess: (paymentId: string, orderId: string, signature: string) => void;
    onFailure: (error: any) => void;
  }) {
    if (!isLoaded) {
      options.onFailure(new Error("Razorpay SDK not loaded yet. Please try again."));
      return;
    }

    // Step 1: Create Razorpay order server-side
    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: options.amount,
        currency: options.currency || "INR",
        receipt: `receipt_${Date.now()}`,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      options.onFailure(new Error(err.error || "Failed to create order"));
      return;
    }

    const { orderId, amount, currency, keyId } = await res.json();

    // Step 2: Open Razorpay checkout modal
    const rzp = new window.Razorpay({
      key: keyId,
      amount,
      currency,
      name: options.name,
      description: options.description,
      order_id: orderId,
      prefill: options.prefill || {},
      theme: { color: "#7c3aed" },
      handler: async (response: any) => {
        // Step 3: Verify payment server-side
        const verifyRes = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });

        const verifyData = await verifyRes.json();

        if (verifyData.verified) {
          options.onSuccess(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature,
          );
        } else {
          options.onFailure(new Error("Payment verification failed"));
        }
      },
      modal: {
        ondismiss: () => {
          options.onFailure(new Error("Payment cancelled"));
        },
      },
    });

    rzp.open();
  }

  return { isLoaded, openRazorpay };
}
