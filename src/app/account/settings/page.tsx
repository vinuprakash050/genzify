'use client';

import { useEffect, useState } from "react";
import AccountNav from "@/components/AccountNav";
import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";
import ClientOnly from "@/components/ClientOnly";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";

function SettingsContent() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [prefs, setPrefs] = useState({ dropAlerts: true, restockEmails: true, smsUpdates: false });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    // Pre-fill from auth user
    setForm({ name: user.name || "", email: user.email || "", phone: "" });

    // Load full profile from Firestore
    async function loadProfile() {
      try {
        const docRef = doc(db, "users", user!.id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setForm({
            name: data.name || user!.name || "",
            email: data.email || user!.email || "",
            phone: data.phone || "",
          });
          setPrefs({
            dropAlerts: data.prefs?.dropAlerts ?? true,
            restockEmails: data.prefs?.restockEmails ?? true,
            smsUpdates: data.prefs?.smsUpdates ?? false,
          });
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    }
    loadProfile();
  }, [user?.id]);

  async function handleSave() {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "users", user.id), {
        name: form.name,
        phone: form.phone,
        prefs,
        updatedAt: Timestamp.now(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <SectionCard>
        <p className="text-sm uppercase tracking-[0.35em] text-secondary">Profile Info</p>
        <div className="mt-5 space-y-4">
          {[
            { label: "Display name", key: "name" as const, type: "text" },
            { label: "Email", key: "email" as const, type: "email", disabled: true },
            { label: "Phone", key: "phone" as const, type: "tel" },
          ].map(({ label, key, type, disabled }) => (
            <label key={key} className="block">
              <span className="mb-2 block text-sm muted-copy">{label}</span>
              <input
                type={type}
                value={form[key]}
                disabled={disabled}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </label>
          ))}
        </div>
      </SectionCard>

      <SectionCard>
        <p className="text-sm uppercase tracking-[0.35em] text-secondary">Preferences</p>
        <div className="mt-5 space-y-4">
          {[
            { label: "Drop alerts", key: "dropAlerts" as const },
            { label: "Restock emails", key: "restockEmails" as const },
            { label: "SMS shipping updates", key: "smsUpdates" as const },
          ].map(({ label, key }) => (
            <label key={key} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              <span>{label}</span>
              <input
                type="checkbox"
                checked={prefs[key]}
                onChange={(e) => setPrefs((p) => ({ ...p, [key]: e.target.checked }))}
              />
            </label>
          ))}
        </div>
      </SectionCard>

      <div className="lg:col-span-2 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={isSaving || !user}
          className="glass-button rounded-full px-6 py-3 font-bold disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
        {saved && <p className="text-sm text-secondary">Saved successfully!</p>}
        {!user && <p className="text-sm muted-copy">Log in to save your settings.</p>}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <PageIntro
      eyebrow="Settings"
      title="Account settings"
      description="Profile preferences, communication options, and notification toggles."
    >
      <AccountNav />
      <ClientOnly fallback={<div className="mt-8 muted-copy text-sm">Loading settings...</div>}>
        <SettingsContent />
      </ClientOnly>
    </PageIntro>
  );
}
