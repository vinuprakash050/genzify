'use client';

import Link from "next/link";
import AdminPageShell from "@/components/AdminPageShell";
import SectionCard from "@/components/SectionCard";
import { orders } from "@/data/orders";
import { formatCurrency } from "@/utils/format";

export default function AdminOrdersPage() {
  return (
    <AdminPageShell
      eyebrow="Admin"
      title="Order management"
      description="Track current orders, view customer shipments, and move into order-level management."
    >
      <SectionCard className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-white/10 text-sm uppercase tracking-[0.25em] text-secondary">
              <th className="pb-4 pr-6">Order</th>
              <th className="pb-4 pr-6">Status</th>
              <th className="pb-4 pr-6">Date</th>
              <th className="pb-4 pr-6">Total</th>
              <th className="pb-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-white/5">
                <td className="py-4 pr-6">
                  <div>
                    <p className="font-semibold text-white">{order.id}</p>
                    <p className="text-sm muted-copy">{order.trackingNumber}</p>
                  </div>
                </td>
                <td className="py-4 pr-6 text-primary">{order.status}</td>
                <td className="py-4 pr-6 text-white/80">{order.date}</td>
                <td className="py-4 pr-6 text-white">{formatCurrency(order.total)}</td>
                <td className="py-4">
                  <Link href={`/admin/orders/${order.id}`} className="text-secondary">
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </AdminPageShell>
  );
}
