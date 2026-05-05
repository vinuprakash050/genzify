'use client';

import { useEffect, useState } from "react";
import AccountNav from "@/components/AccountNav";
import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { formatCurrency } from "@/utils/format";

export default function AccountPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [recentOrder, setRecentOrder] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !user) return;
    async function loadRecentOrder() {
      try {
        // No orderBy to avoid composite index — sort client-side
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user!.id),
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const orders = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as any));
          orders.sort((a: any, b: any) => {
            const aTime = a.createdAt?.toMillis?.() ?? 0;
            const bTime = b.createdAt?.toMillis?.() ?? 0;
            return bTime - aTime;
          });
          setRecentOrder(orders[0]);
        }
      } catch (err) {
        console.error("Error loading recent order:", err);
      }
    }
    loadRecentOrder();
  }, [user?.id, mounted]);

  // Always render same content on server and client until mounted
  const displayName = mounted ? (user?.name ?? "Guest Member") : "Guest Member";
  const displayEmail = mounted ? (user?.email ?? "Sign in to personalize this section.") : "Sign in to personalize this section.";

  return (
    <PageIntro
      eyebrow="Account"
      title="Member dashboard"
      description="A central overview for profile data, recent orders, and saved customer information."
    >
      <AccountNav />
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <SectionCard>
          <p className="text-sm uppercase tracking-[0.35em] text-secondary">Profile</p>
          <h2 className="mt-3 text-2xl font-bold">{displayName}</h2>
          <p className="mt-2 muted-copy">{displayEmail}</p>
        </SectionCard>
        <SectionCard>
          <p className="text-sm uppercase tracking-[0.35em] text-secondary">Recent Order</p>
          {mounted && recentOrder ? (
            <>
              <h2 className="mt-3 text-xl font-bold">{recentOrder.id.slice(0, 12).toUpperCase()}</h2>
              <p className="mt-2 muted-copy capitalize">{recentOrder.status}</p>
              {recentOrder.total && (
                <p className="mt-1 font-semibold text-primary">{formatCurrency(recentOrder.total)}</p>
              )}
            </>
          ) : (
            <>
              <h2 className="mt-3 text-2xl font-bold">—</h2>
              <p className="mt-2 muted-copy">No orders placed yet.</p>
            </>
          )}
        </SectionCard>
        <SectionCard>
          <p className="text-sm uppercase tracking-[0.35em] text-secondary">Saved Addresses</p>
          <h2 className="mt-3 text-2xl font-bold">2</h2>
          <p className="mt-2 muted-copy">Prepared for address book API integration.</p>
        </SectionCard>
      </div>
    </PageIntro>
  );
}
