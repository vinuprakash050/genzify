'use client';

import { useState, useEffect } from "react";

const ADMIN_KEY = "genzify-admin-auth";

export function useAdminAuth() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsAuthed(sessionStorage.getItem(ADMIN_KEY) === "true");
  }, []);

  function login(username: string, password: string): boolean {
    if (
      username === process.env.NEXT_PUBLIC_ADMIN_USERNAME &&
      password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    ) {
      sessionStorage.setItem(ADMIN_KEY, "true");
      setIsAuthed(true);
      return true;
    }
    return false;
  }

  function logout() {
    sessionStorage.removeItem(ADMIN_KEY);
    setIsAuthed(false);
  }

  return { isAuthed, mounted, login, logout };
}

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { isAuthed, mounted, login, logout } = useAdminAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!mounted) return null;

  if (!isAuthed) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="glass-panel w-full max-w-sm rounded-[2rem] p-8">
          <p className="text-sm uppercase tracking-[0.4em] text-secondary">Admin</p>
          <h1 className="mt-3 text-3xl font-black uppercase text-white">Access Panel</h1>
          <p className="mt-2 muted-copy text-sm">Enter admin credentials to continue.</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setError("");
              if (!login(username, password)) {
                setError("Invalid username or password.");
              }
            }}
            className="mt-6 space-y-4"
          >
            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}
            <label className="block">
              <span className="mb-2 block text-sm muted-copy">Username</span>
              <input
                required
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-primary"
                placeholder="Username"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm muted-copy">Password</span>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-secondary"
                placeholder="••••••••"
              />
            </label>
            <button
              type="submit"
              className="glass-button w-full rounded-2xl px-4 py-3 font-bold"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="fixed right-4 top-4 z-50">
        <button
          onClick={logout}
          className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs text-white/60 hover:text-red-400 transition"
        >
          Admin Logout
        </button>
      </div>
      {children}
    </div>
  );
}
