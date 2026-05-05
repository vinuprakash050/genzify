'use client';

import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";

export default function CollectionsPage() {
  return (
    <PageIntro
      eyebrow="Collections"
      title="Drops and collections"
      description="A dedicated place for curated edits, campaign drops, and seasonal capsules."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          ["Core Oversized", "Daily heavy silhouettes and staple colors."],
          ["Nocturne Hoodies", "Weighty fleece layers with deep structure."],
          ["Layer System", "Vests and tanktops built for stacked styling."],
        ].map(([title, description]) => (
          <SectionCard key={title}>
            <p className="text-sm uppercase tracking-[0.35em] text-secondary">{title}</p>
            <p className="mt-4 leading-8 muted-copy">{description}</p>
          </SectionCard>
        ))}
      </div>
    </PageIntro>
  );
}
