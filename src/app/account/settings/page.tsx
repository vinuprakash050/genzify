'use client';

import AccountNav from "@/components/AccountNav";
import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";

export default function SettingsPage() {
  return (
    <PageIntro
      eyebrow="Settings"
      title="Account settings"
      description="Profile preferences, communication options, and future notification toggles."
    >
      <AccountNav />
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <SectionCard>
          <p className="text-sm uppercase tracking-[0.35em] text-secondary">Profile Info</p>
          <div className="mt-5 space-y-4">
            {["Display name", "Email", "Phone"].map((label) => (
              <label key={label} className="block">
                <span className="mb-2 block text-sm muted-copy">{label}</span>
                <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3" />
              </label>
            ))}
          </div>
        </SectionCard>
        <SectionCard>
          <p className="text-sm uppercase tracking-[0.35em] text-secondary">Preferences</p>
          <div className="mt-5 space-y-4">
            {["Drop alerts", "Restock emails", "SMS shipping updates"].map((label) => (
              <label key={label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                <span>{label}</span>
                <input type="checkbox" defaultChecked />
              </label>
            ))}
          </div>
        </SectionCard>
      </div>
    </PageIntro>
  );
}
