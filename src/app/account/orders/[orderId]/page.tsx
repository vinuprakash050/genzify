'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AccountNav from "@/components/AccountNav";
import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";
import { formatCurrency } from "@/utils/format";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    async function loadOrder() {
      try {
        const docRef = doc(db, "orders", orderId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Error loading order:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [orderId, mounted]);

  if (!mounted || isLoading) {
    return (
      <PageIntro eyebrow="Order Detail" title="Loading..." description="">
        <AccountNav />
      </PageIntro>
    );
  }

  if (!order) {
    return (
      <PageIntro eyebrow="Orders" title="Order not found" description="This order ID does not exist.">
        <Link href="/account/orders" className="rounded-full border border-primary/30 px-6 py-3 text-primary">
          Back to orders
        </Link>
      </PageIntro>
    );
  }

  return (
    <PageIntro
      eyebrow="Order Detail"
      title={order.id.slice(0, 12).toUpperCase()}
      description="Order status, line items, and shipping details."
    >
      <AccountNav />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <SectionCard>
          <p className="text-sm uppercase tracking-[0.35em] text-secondary">{order.status}</p>
          <div className="mt-5 space-y-4">
            {order.items?.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm muted-copy">{item.quantity} x Size {item.size}</p>
                </div>
                <span>{formatCurrency(item.quantity * item.price)}</span>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard>
          <p className="text-sm uppercase tracking-[0.35em] text-secondary">Details</p>
          <p className="mt-4 muted-copy text-sm">Delivery</p>
          <p className="mt-1 font-semibold">{order.deliveryMethod || "Standard"}</p>
          <p className="mt-4 muted-copy text-sm">Shipping Address</p>
          <p className="mt-1 font-semibold">{order.shippingAddress}</p>
          <p className="mt-4 muted-copy text-sm">Placed on</p>
          <p className="mt-1 font-semibold">
            {order.createdAt?.toDate
              ? order.createdAt.toDate().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
              : ""}
          </p>
          <div className="mt-6 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between text-lg">
              <span>Total</span>
              <span className="font-bold text-primary">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </SectionCard>
      </div>
    </PageIntro>
  );
}
