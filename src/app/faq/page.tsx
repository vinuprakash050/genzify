'use client';

import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";

export default function FAQPage() {
  return (
    <PageIntro
      eyebrow="FAQ"
      title="Frequently asked questions"
      description="Support content that can later be backed by a CMS or help center."
    >
      <div className="space-y-4">
        {[
          ["How oversized is the fit?", "Each product is intentionally cut relaxed. Use the size guide for exact measurements."],
          ["How long does shipping take?", "Standard shipping is 4-6 business days, with faster options at checkout."],
          ["Can I return worn items?", "Items must be unworn and returned within the policy window unless defective."],
        ].map(([question, answer]) => (
          <SectionCard key={question}>
            <h2 className="text-xl font-semibold">{question}</h2>
            <p className="mt-3 leading-8 muted-copy">{answer}</p>
          </SectionCard>
        ))}
      </div>
    </PageIntro>
  );
}
