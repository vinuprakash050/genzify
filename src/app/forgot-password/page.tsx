'use client';

import AuthFormShell from "@/components/AuthFormShell";

export default function ForgotPasswordPage() {
  return (
    <AuthFormShell
      eyebrow="Recovery"
      title="Forgot your password?"
      description="Enter your email and this can later connect to a real password reset endpoint."
      footerText="Need an account instead?"
      footerLinkLabel="Register"
      footerLinkTo="/register"
      form={
        <form className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm muted-copy">Email</span>
            <input
              type="email"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-primary"
            />
          </label>
          <button className="glass-button w-full rounded-2xl px-4 py-3 font-bold">
            Send Reset Link
          </button>
        </form>
      }
    />
  );
}
