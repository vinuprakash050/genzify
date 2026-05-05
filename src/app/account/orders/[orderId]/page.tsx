'use client';

import Link from "next/link";
import { useParams } from "next/navigation";
import AccountNav from "@/components/AccountNav";
import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";
import { orders } from "@/data/orders";
import { formatCurrency } from "@/utils/format";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const order = orders.find((item) => item.id === orderId);

  if (!order) {
    return (
      <PageIntro eyebrow="Orders" title="Order not found" description="This order ID does not exist in the demo dataset.">
        <Link href="/account/orders" className="rounded-full border border-primary/30 px-6 py-3 text-primary">
          Back to orders
        </Link>
      </PageIntro>
    );
  }

  return (
    <PageIntro
      eyebrow="Order Detail"
      title={order.id}
      description="A dedicated order detail page for status, line items, shipping address, and tracking."
    >
      <AccountNav />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <SectionCard>
          <p className="text-sm uppercase tracking-[0.35em] text-secondary">{order.status}</p>
          <div className="mt-5 space-y-4">
            {order.items.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
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
        </SectionCard>
        <SectionCard>
          <p className="text-sm uppercase tracking-[0.35em] text-secondary">Tracking</p>
          <p className="mt-4 font-semibold">{order.trackingNumber}</p>
          <p className="mt-4 muted-copy">{order.shippingAddress}</p>
          <p className="mt-4 text-primary">{formatCurrency(order.total)}</p>
        </SectionCard>
      </div>
    </PageIntro>
  );
}
