'use client';

import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";

export default function OrderFailurePage() {
  return (
    <PageIntro
      eyebrow="Payment"
      title="Order could not be completed"
      description="A failure state for declined payments or checkout API errors."
    >
      <SectionCard className="max-w-3xl">
        <p className="leading-8 muted-copy">
          Once checkout is connected, this page can show processor errors, retry guidance, and
          support escalation options.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/checkout" className="glass-button rounded-full px-6 py-3 font-bold">
            Try Again
          </Link>
          <Link href="/contact" className="rounded-full border border-secondary/30 px-6 py-3 text-secondary">
            Contact Support
          </Link>
        </div>
      </SectionCard>
    </PageIntro>
  );
}
