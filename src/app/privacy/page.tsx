'use client';

import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";

export default function PrivacyPage() {
  return (
    <PageIntro
      eyebrow="Legal"
      title="Privacy policy"
      description="A placeholder legal page for data handling, cookies, and account privacy terms."
    >
      <SectionCard className="max-w-4xl">
        <p className="leading-8 muted-copy">
          Replace this with production legal content covering account data, checkout information,
          analytics, customer service records, and marketing preferences.
        </p>
      </SectionCard>
    </PageIntro>
  );
}
