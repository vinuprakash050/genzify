'use client';

import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";

export default function ContactPage() {
  return (
    <PageIntro
      eyebrow="Contact"
      title="Talk to the team"
      description="Support, wholesale, collabs, and customer service contact flow."
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionCard>
          <p className="text-sm uppercase tracking-[0.35em] text-secondary">Support Channels</p>
          <div className="mt-5 space-y-3 leading-8">
            <p>support@genzify.demo</p>
            <p>wholesale@genzify.demo</p>
            <p>+1 (555) 014-2400</p>
          </div>
        </SectionCard>
        <SectionCard>
          <form className="space-y-4">
            {["Name", "Email", "Subject"].map((label) => (
              <label key={label} className="block">
                <span className="mb-2 block text-sm muted-copy">{label}</span>
                <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3" />
              </label>
            ))}
            <label className="block">
              <span className="mb-2 block text-sm muted-copy">Message</span>
              <textarea className="min-h-40 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3" />
            </label>
            <button className="glass-button rounded-2xl px-6 py-3 font-bold">Send Message</button>
          </form>
        </SectionCard>
      </div>
    </PageIntro>
  );
}
