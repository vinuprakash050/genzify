'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
];

function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-3">
      {links.map((link) => {
        const isActive = pathname.startsWith(link.to);
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

export default AdminNav;
