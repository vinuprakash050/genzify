'use client';

import { useState } from "react";
import AuthFormShell from "@/components/AuthFormShell";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      // Firebase sends the reset email natively
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthFormShell
      eyebrow="Recovery"
      title="Forgot your password?"
      description="Enter your email and we'll send you a reset link."
      footerText="Need an account instead?"
      footerLinkLabel="Register"
      footerLinkTo="/register"
      form={
        sent ? (
          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-6 text-center">
            <p className="font-semibold text-green-400">Reset link sent!</p>
            <p className="mt-2 text-sm muted-copy">Check your inbox at <strong>{email}</strong></p>
          </div>
        ) : (
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-primary"
                placeholder="you@example.com"
              />
            </label>
            <button
              type="submit"
              disabled={isLoading}
              className="glass-button w-full rounded-2xl px-4 py-3 font-bold disabled:opacity-60"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )
      }
    />
  );
}
