'use client';

import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";

export default function TermsPage() {
  return (
    <PageIntro
      eyebrow="Legal"
      title="Terms and conditions"
      description="A placeholder terms page for payments, refunds, product availability, and account usage."
    >
      <SectionCard className="max-w-4xl">
        <p className="leading-8 muted-copy">
          Replace this with production terms covering order placement, product descriptions, account
          responsibility, shipping limitations, and dispute handling.
        </p>
      </SectionCard>
    </PageIntro>
  );
}
