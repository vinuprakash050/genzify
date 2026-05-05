'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import AccountNav from "@/components/AccountNav";
import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/utils/format";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

interface Order {
  id: string;
  status: string;
  createdAt: any;
  total: number;
  items: any[];
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!user) {
      setIsLoading(false);
      return;
    }

    async function loadOrders() {
      try {
        // No orderBy to avoid requiring a composite index — sort client-side instead
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user!.id),
        );
        const snapshot = await getDocs(q);
        const loaded = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Order[];
        // Sort by createdAt descending client-side
        loaded.sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() ?? 0;
          const bTime = b.createdAt?.toMillis?.() ?? 0;
          return bTime - aTime;
        });
        setOrders(loaded);
      } catch (err) {
        console.error("Error loading orders:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, [user?.id, mounted]);

  return (
    <PageIntro
      eyebrow="Orders"
      title="Order history"
      description="Your placed orders and their current status."
    >
      <AccountNav />
      <div className="mt-8 space-y-4">
        {!mounted || isLoading ? (
          <SectionCard>
            <p className="muted-copy">Loading orders...</p>
          </SectionCard>
        ) : !user ? (
          <SectionCard>
            <p className="muted-copy">Please <Link href="/login" className="text-primary">log in</Link> to view your orders.</p>
          </SectionCard>
        ) : orders.length === 0 ? (
          <SectionCard>
            <p className="text-lg font-semibold text-primary">No orders yet.</p>
            <p className="mt-2 muted-copy">Once you place an order it will appear here.</p>
            <Link href="/products" className="mt-6 inline-flex rounded-full border border-secondary/30 px-6 py-3 text-secondary">
              Start Shopping
            </Link>
          </SectionCard>
        ) : (
          orders.map((order) => (
            <SectionCard key={order.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-secondary">{order.status}</p>
                  <h2 className="mt-2 text-xl font-bold">{order.id.slice(0, 12).toUpperCase()}</h2>
                  <p className="mt-2 muted-copy">
                    {order.createdAt?.toDate
                      ? order.createdAt.toDate().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                      : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">{formatCurrency(order.total)}</p>
                  <Link href={`/account/orders/${order.id}`} className="mt-3 inline-flex text-secondary">
                    View details
                  </Link>
                </div>
              </div>
            </SectionCard>
          ))
        )}
      </div>
    </PageIntro>
  );
}
