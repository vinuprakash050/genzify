'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminPageShell from "@/components/AdminPageShell";
import AdminGuard from "@/components/AdminGuard";
import CustomSelect from "@/components/CustomSelect";
import SectionCard from "@/components/SectionCard";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { formatCurrency } from "@/utils/format";

const statusOptions = ["pending", "paid", "packed", "shipped", "delivered", "cancelled", "refunded"];

function AdminOrderDetailContent() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("pending");
  const [tracking, setTracking] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      try {
        const snap = await getDoc(doc(db, "orders", orderId));
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() };
          setOrder(data);
          setStatus((data as any).status || "pending");
          setTracking((data as any).trackingNumber || "");
        }
      } catch (err) {
        console.error("Error loading order:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  async function handleSave() {
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status,
        trackingNumber: tracking,
        updatedAt: Timestamp.now(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Error updating order:", err);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <AdminPageShell eyebrow="Admin" title="Loading..." description="">
        <SectionCard><p className="muted-copy">Loading order...</p></SectionCard>
      </AdminPageShell>
    );
  }

  if (!order) {
    return (
      <AdminPageShell eyebrow="Admin" title="Order not found" description="This order does not exist in Firestore.">
        <Link href="/admin/orders" className="rounded-full border border-primary/30 px-6 py-3 text-primary">
          Back to orders
        </Link>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      eyebrow="Admin"
      title={`Order ${order.id.slice(0, 10).toUpperCase()}`}
      description={`Customer: ${order.userName || "Unknown"} · ${order.userEmail || ""}`}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-6">
          <SectionCard>
            <p className="text-sm uppercase tracking-[0.35em] text-secondary">Line Items</p>
            <div className="mt-5 space-y-4">
              {order.items?.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="h-12 w-10 rounded-xl object-cover" />
                    )}
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm muted-copy">{item.quantity} × Size {item.size}</p>
                    </div>
                  </div>
                  <span>{formatCurrency(item.quantity * item.price)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-lg">
              <span>Total</span>
              <span className="font-bold text-primary">{formatCurrency(order.total)}</span>
            </div>
          </SectionCard>

          <SectionCard>
            <p className="text-sm uppercase tracking-[0.35em] text-secondary">Shipping Details</p>
            <p className="mt-4 leading-7">{order.shippingAddress || "—"}</p>
            <p className="mt-2 text-sm muted-copy">Delivery: {order.deliveryMethod || "Standard"}</p>
            {order.paymentId && (
              <p className="mt-2 text-sm muted-copy">Payment ID: {order.paymentId}</p>
            )}
          </SectionCard>
        </div>

        <SectionCard>
          <p className="text-sm uppercase tracking-[0.35em] text-secondary">Order Controls</p>
          <div className="mt-5 space-y-4">
            <CustomSelect
              label="Status"
              value={status}
              onChange={setStatus}
              options={statusOptions.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
            />
            <label className="block">
              <span className="mb-2 block text-sm muted-copy">Tracking number</span>
              <input
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-primary"
                placeholder="e.g. GZX992401"
              />
            </label>
            {saved && (
              <p className="text-sm text-secondary">Saved successfully!</p>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="glass-button w-full rounded-2xl px-4 py-3 font-bold disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save Order Update"}
            </button>
            <Link href="/admin/orders" className="block text-center text-sm muted-copy hover:text-secondary transition">
              ← Back to orders
            </Link>
          </div>
        </SectionCard>
      </div>
    </AdminPageShell>
  );
}

export default function AdminOrderDetailPage() {
  return (
    <AdminGuard>
      <AdminOrderDetailContent />
    </AdminGuard>
  );
}
