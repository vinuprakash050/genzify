'use client';

import Link from "next/link";
import AccountNav from "@/components/AccountNav";
import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";
import { orders } from "@/data/orders";
import { formatCurrency } from "@/utils/format";

export default function OrdersPage() {
  return (
    <PageIntro
      eyebrow="Orders"
      title="Order history"
      description="Ready to connect to user order APIs, tracking updates, and return requests."
    >
      <AccountNav />
      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <SectionCard key={order.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-secondary">{order.status}</p>
                <h2 className="mt-2 text-2xl font-bold">{order.id}</h2>
                <p className="mt-2 muted-copy">{order.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-primary">{formatCurrency(order.total)}</p>
                <Link href={`/account/orders/${order.id}`} className="mt-3 inline-flex text-secondary">
                  View details
                </Link>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>
    </PageIntro>
  );
}
