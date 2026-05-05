'use client';

import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";

export default function ShippingPolicyPage() {
  return (
    <PageIntro
      eyebrow="Policy"
      title="Shipping policy"
      description="Prepared for fulfillment timelines, dispatch cutoffs, and carrier details."
    >
      <SectionCard className="max-w-4xl">
        <p className="leading-8 muted-copy">
          Orders are typically packed within 1-2 business days. Standard, express, and next-day
          options can be calculated by region and inventory availability once shipping services are
          connected.
        </p>
      </SectionCard>
    </PageIntro>
  );
}
