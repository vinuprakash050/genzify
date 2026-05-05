'use client';

import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";

export default function VerifyEmailPage() {
  return (
    <PageIntro
      eyebrow="Verification"
      title="Verify your email"
      description="This route is ready for token validation and resend flows once registration is backed by a real auth service."
    >
      <SectionCard className="max-w-2xl">
        <p className="leading-8 muted-copy">
          Connect this page to email verification APIs to confirm the user session and continue into
          their account dashboard.
        </p>
        <Link href="/account" className="mt-6 inline-flex rounded-full border border-primary/30 px-6 py-3 text-primary">
          Continue to account
        </Link>
      </SectionCard>
    </PageIntro>
  );
}
