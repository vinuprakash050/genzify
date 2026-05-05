'use client';

import Link from "next/link";
import AdminPageShell from "@/components/AdminPageShell";
import SectionCard from "@/components/SectionCard";
import { products } from "@/data/products";
import { formatCurrency } from "@/utils/format";

export default function AdminProductsPage() {
  return (
    <AdminPageShell
      eyebrow="Admin"
      title="Product management"
      description="Manage product data, preview images, and move into add/edit flows. This is ready to connect to product CRUD APIs later."
    >
      <div className="mb-6 flex justify-end">
        <Link
          href="/admin/products/new"
          className="glass-button rounded-full px-6 py-3 text-sm font-bold uppercase tracking-[0.22em]"
        >
          Add Product
        </Link>
      </div>

      <SectionCard className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-white/10 text-sm uppercase tracking-[0.25em] text-secondary">
              <th className="pb-4 pr-6">Product</th>
              <th className="pb-4 pr-6">Category</th>
              <th className="pb-4 pr-6">Price</th>
              <th className="pb-4 pr-6">Image</th>
              <th className="pb-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-white/5">
                <td className="py-4 pr-6">
                  <div>
                    <p className="font-semibold text-white">{product.name}</p>
                    <p className="text-sm muted-copy">{product.id}</p>
                  </div>
                </td>
                <td className="py-4 pr-6 text-white/80">{product.category}</td>
                <td className="py-4 pr-6 text-primary">{formatCurrency(product.price)}</td>
                <td className="py-4 pr-6">
                  <img src={product.image} alt={product.name} className="h-14 w-12 rounded-xl object-cover" />
                </td>
                <td className="py-4">
                  <Link href={`/admin/products/${product.id}/edit`} className="text-secondary">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </AdminPageShell>
  );
}
