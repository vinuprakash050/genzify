'use client';

import AdminNav from "./AdminNav";
import PageTransition from "./PageTransition";

interface AdminPageShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

function AdminPageShell({ eyebrow, title, description, children }: AdminPageShellProps) {
  return (
    <PageTransition className="px-4 pb-20 pt-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.4em] text-secondary">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-black uppercase text-white sm:text-6xl">{title}</h1>
          <p className="mt-4 leading-8 muted-copy">{description}</p>
        </div>
        <AdminNav />
        <div className="mt-8">{children}</div>
      </div>
    </PageTransition>
  );
}

export default AdminPageShell;
