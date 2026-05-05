'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthFormShell from "@/components/AuthFormShell";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await login(form);
      router.push("/account");
    } catch (err: any) {
      const code = err?.code || "";
      if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else if (code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError(err?.message || "Something went wrong. Please try again.");
      }
    }
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
          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
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
          <div className="flex items-center justify-between text-sm">
            <a href="/forgot-password" className="text-secondary">
              Forgot password?
            </a>
            <a href="/register" className="text-primary">
              Create account
            </a>
          </div>
        </form>
      }
    />
  );
}
