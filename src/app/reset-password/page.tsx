'use client';

import AuthFormShell from "@/components/AuthFormShell";

export default function ResetPasswordPage() {
  return (
    <AuthFormShell
      eyebrow="Reset"
      title="Create a new password"
      description="This page is ready for token-based password reset once auth APIs are connected."
      form={
        <form className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm muted-copy">New password</span>
            <input
              type="password"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm muted-copy">Confirm password</span>
            <input
              type="password"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-secondary"
            />
          </label>
          <button className="glass-button w-full rounded-2xl px-4 py-3 font-bold">
            Update Password
          </button>
        </form>
      }
    />
  );
}
