'use client';

import AccountNav from "@/components/AccountNav";
import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";
import { useAuth } from "@/context/AuthContext";
import { orders } from "@/data/orders";

export default function AccountPage() {
  const { user } = useAuth();

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
          <h2 className="mt-3 text-2xl font-bold">{user?.name ?? "Guest Member"}</h2>
          <p className="mt-2 muted-copy">{user?.email ?? "Sign in to personalize this section."}</p>
        </SectionCard>
        <SectionCard>
          <p className="text-sm uppercase tracking-[0.35em] text-secondary">Recent Order</p>
          <h2 className="mt-3 text-2xl font-bold">{orders[0].id}</h2>
          <p className="mt-2 muted-copy">{orders[0].status}</p>
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
