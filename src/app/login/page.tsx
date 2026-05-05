'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthFormShell from "@/components/AuthFormShell";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await login(form);
    router.push("/account");
  }

  return (
    <AuthFormShell
      eyebrow="Member Access"
      title="Login to continue"
      description="Sign in to access your orders, addresses, wishlist, and account settings."
      footerText="Need an account?"
      footerLinkLabel="Register"
      footerLinkTo="/register"
      form={
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm muted-copy">Email</span>
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-primary"
              placeholder="you@example.com"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm muted-copy">Password</span>
            <input
              required
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-secondary"
              placeholder="••••••••"
            />
          </label>
          <button
            type="submit"
            disabled={isLoading}
            className="glass-button w-full rounded-2xl px-4 py-3 font-bold transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>
      }
    />
  );
}
