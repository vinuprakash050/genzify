'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthFormShell from "@/components/AuthFormShell";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await register(form);
      router.push("/account");
    } catch (err: any) {
      // Map Firebase error codes to readable messages
      const code = err?.code || "";
      if (code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else if (code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError(err?.message || "Something went wrong. Please try again.");
      }
    }
  }

  return (
    <AuthFormShell
      eyebrow="Register"
      title="Create your account"
      description="Set up a member profile for orders, addresses, wishlist items, and future drop alerts."
      footerText="Already have an account?"
      footerLinkLabel="Login"
      footerLinkTo="/login"
      form={
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
          {[
            { label: "Full name", key: "name" as const, type: "text" },
            { label: "Email", key: "email" as const, type: "email" },
            { label: "Password", key: "password" as const, type: "password" },
          ].map((field) => (
            <label key={field.key} className="block">
              <span className="mb-2 block text-sm muted-copy">{field.label}</span>
              <input
                required
                type={field.type}
                value={form[field.key]}
                onChange={(event) =>
                  setForm((current) => ({ ...current, [field.key]: event.target.value }))
                }
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-primary"
              />
            </label>
          ))}
          <button
            type="submit"
            className="glass-button w-full rounded-2xl px-4 py-3 font-bold"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>
      }
    />
  );
}
