'use client';

import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";

export default function OrderSuccessPage() {
  return (
    <PageIntro
      eyebrow="Success"
      title="Order confirmed"
      description="A thank-you page ready for confirmed payment status, order IDs, and fulfillment updates."
    >
      <SectionCard className="max-w-3xl">
        <p className="leading-8 muted-copy">
          Your order has been placed. In a production flow this page would show payment confirmation,
          shipment ETA, and links into order tracking.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/account/orders" className="glass-button rounded-full px-6 py-3 font-bold">
            View Orders
          </Link>
          <Link href="/products" className="rounded-full border border-secondary/30 px-6 py-3 text-secondary">
            Continue Shopping
          </Link>
        </div>
      </SectionCard>
    </PageIntro>
  );
}
