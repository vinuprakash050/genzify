'use client';

import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";

export default function UnauthorizedPage() {
  return (
    <PageIntro
      eyebrow="Access"
      title="Unauthorized"
      description="A simple guard page for protected routes when auth and permissions are enforced."
    >
      <SectionCard className="max-w-2xl">
        <p className="leading-8 muted-copy">
          You need the right session or account access to view this page.
        </p>
        <Link href="/" className="mt-6 inline-flex rounded-full border border-primary/30 px-6 py-3 text-primary">
          Return Home
        </Link>
      </SectionCard>
    </PageIntro>
  );
}
