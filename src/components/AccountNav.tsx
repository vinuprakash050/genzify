'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { to: "/account", label: "Overview" },
  { to: "/account/orders", label: "Orders" },
  { to: "/account/addresses", label: "Addresses" },
  { to: "/wishlist", label: "Wishlist" },
  { to: "/account/settings", label: "Settings" },
];

function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-3">
      {links.map((link) => {
        const isActive = link.to === "/account" ? pathname === "/account" : pathname.startsWith(link.to);
        return (
          <Link
            key={link.to}
            href={link.to}
            className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
              isActive
                ? "bg-primary text-black"
                : "border border-white/10 bg-white/5 text-white/80 hover:text-secondary"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default AccountNav;
