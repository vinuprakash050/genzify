'use client';

import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";

export default function ReturnsPage() {
  return (
    <PageIntro
      eyebrow="Policy"
      title="Returns and exchanges"
      description="A return policy page ready for backend RMA and status integration."
    >
      <SectionCard className="max-w-4xl">
        <p className="leading-8 muted-copy">
          Demo policy: returns are accepted within 14 days of delivery if items remain unworn and in
          original condition. This page can later connect to return request workflows and order lookups.
        </p>
      </SectionCard>
    </PageIntro>
  );
}
