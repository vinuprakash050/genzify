'use client';

import AccountNav from "@/components/AccountNav";
import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";

export default function AddressesPage() {
  return (
    <PageIntro
      eyebrow="Addresses"
      title="Saved addresses"
      description="Frontend-ready address book management for shipping and billing profiles."
    >
      <AccountNav />
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {["Home", "Studio"].map((label, index) => (
          <SectionCard key={label}>
            <p className="text-sm uppercase tracking-[0.35em] text-secondary">{label}</p>
            <p className="mt-4 leading-8">
              {index === 0
                ? "44 Mercer Street, Brooklyn, NY 11249"
                : "85 Howard Street, New York, NY 10013"}
            </p>
          </SectionCard>
        ))}
      </div>
    </PageIntro>
  );
}
