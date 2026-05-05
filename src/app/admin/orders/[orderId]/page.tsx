'use client';

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminPageShell from "@/components/AdminPageShell";
import CustomSelect from "@/components/CustomSelect";
import SectionCard from "@/components/SectionCard";
import { orders } from "@/data/orders";
import { formatCurrency } from "@/utils/format";

const statusOptions = ["Pending", "Paid", "Packed", "Shipped", "Delivered", "Cancelled", "Refunded"];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const order = orders.find((item) => item.id === orderId);
  const [status, setStatus] = useState(order?.status ?? statusOptions[0]);

  if (!order) {
    return (
      <AdminPageShell
        eyebrow="Admin"
        title="Order not found"
        description="This order ID is not available in the current demo dataset."
      >
        <Link href="/admin/orders" className="rounded-full border border-primary/30 px-6 py-3 text-primary">
          Back to orders
        </Link>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      eyebrow="Admin"
      title={`Manage ${order.id}`}
      description="Update order status, tracking info, and review line items. Connect this to order update endpoints later."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
        <SectionCard>
          <p className="text-sm uppercase tracking-[0.35em] text-secondary">Line Items</p>
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
          <p className="text-sm uppercase tracking-[0.35em] text-secondary">Order Controls</p>
          <div className="mt-5 space-y-4">
            <CustomSelect
              label="Status"
              value={status}
              onChange={setStatus}
              options={statusOptions.map((option) => ({ value: option, label: option }))}
            />
            <label className="block">
              <span className="mb-2 block text-sm muted-copy">Tracking number</span>
              <input
                defaultValue={order.trackingNumber}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm muted-copy">Shipping address</span>
              <textarea
                rows={4}
                defaultValue={order.shippingAddress}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              />
            </label>
            <button className="glass-button w-full rounded-2xl px-4 py-3 font-bold">
              Save Order Update
            </button>
          </div>
        </SectionCard>
      </div>
    </AdminPageShell>
  );
}
