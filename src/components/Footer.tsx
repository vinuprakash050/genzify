'use client';

import Link from "next/link";

const footerLinks = [
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/faq", label: "FAQ" },
  { to: "/shipping-policy", label: "Shipping" },
  { to: "/returns", label: "Returns" },
  { to: "/privacy", label: "Privacy" },
  { to: "/terms", label: "Terms" },
  { to: "/size-guide", label: "Size Guide" },
];

export default function Footer() {
  return (
    <footer className="relative z-10 mt-auto w-full border-t border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-primary">GENZIFY</p>
          <p className="mt-3 max-w-md leading-7 muted-copy">
            Oversized essentials and a storefront ready for auth, orders, shipping, and customer
            account APIs.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {footerLinks.map((link) => (
            <Link
              key={link.to}
              href={link.to}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/75 transition hover:border-secondary/40 hover:text-secondary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
