'use client';

import { useEffect, useState } from "react";
import AccountNav from "@/components/AccountNav";
import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";
import ClientOnly from "@/components/ClientOnly";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";

interface Address {
  label: string;
  line: string;
}

function AddressesContent() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [newLine, setNewLine] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    async function loadAddresses() {
      try {
        const snap = await getDoc(doc(db, "users", user!.id));
        if (snap.exists() && snap.data().addresses) {
          setAddresses(snap.data().addresses);
        }
      } catch (err) {
        console.error("Error loading addresses:", err);
      }
    }
    loadAddresses();
  }, [user?.id]);

  async function handleSave() {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "users", user.id), {
        addresses,
        updatedAt: Timestamp.now(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Error saving addresses:", err);
    } finally {
      setIsSaving(false);
    }
  }

  function handleAdd() {
    if (!newLabel.trim() || !newLine.trim()) return;
    setAddresses((prev) => [...prev, { label: newLabel.trim(), line: newLine.trim() }]);
    setNewLabel("");
    setNewLine("");
  }

  function handleRemove(index: number) {
    setAddresses((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="mt-8 space-y-6">
      {addresses.length === 0 ? (
        <SectionCard>
          <p className="muted-copy">No saved addresses yet. Add one below.</p>
        </SectionCard>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {addresses.map((addr, index) => (
            <SectionCard key={index}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-secondary">{addr.label}</p>
                  <p className="mt-4 leading-8">{addr.line}</p>
                </div>
                <button
                  onClick={() => handleRemove(index)}
                  className="text-sm text-white/40 hover:text-red-400 transition"
                >
                  Remove
                </button>
              </div>
            </SectionCard>
          ))}
        </div>
      )}

      <SectionCard>
        <p className="text-sm uppercase tracking-[0.35em] text-secondary">Add New Address</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm muted-copy">Label (e.g. Home, Work)</span>
            <input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-primary"
              placeholder="Home"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm muted-copy">Full address</span>
            <input
              value={newLine}
              onChange={(e) => setNewLine(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-primary"
              placeholder="123 Main St, City, State 00000"
            />
          </label>
        </div>
        <button
          onClick={handleAdd}
          disabled={!newLabel.trim() || !newLine.trim()}
          className="mt-4 rounded-full border border-secondary/30 px-6 py-3 text-sm text-secondary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add Address
        </button>
      </SectionCard>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={isSaving || !user}
          className="glass-button rounded-full px-6 py-3 font-bold disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save Addresses"}
        </button>
        {saved && <p className="text-sm text-secondary">Saved successfully!</p>}
        {!user && <p className="text-sm muted-copy">Log in to save addresses.</p>}
      </div>
    </div>
  );
}

export default function AddressesPage() {
  return (
    <PageIntro
      eyebrow="Addresses"
      title="Saved addresses"
      description="Manage your shipping and billing addresses."
    >
      <AccountNav />
      <ClientOnly fallback={<div className="mt-8 muted-copy text-sm">Loading addresses...</div>}>
        <AddressesContent />
      </ClientOnly>
    </PageIntro>
  );
}
