'use client';

import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";

export default function AboutPage() {
  return (
    <PageIntro
      eyebrow="About"
      title="The brand behind the drop"
      description="A brand story page for vision, fabrication standards, and campaign positioning."
    >
      <SectionCard className="max-w-4xl">
        <p className="leading-8 muted-copy">
          Genzify is built around oversized silhouettes, strong fabrication, and confident street
          presence. This page is ready for founder copy, campaign imagery, manufacturing notes, and
          editorial storytelling.
        </p>
      </SectionCard>
    </PageIntro>
  );
}
