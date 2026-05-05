'use client';

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import AdminPageShell from "@/components/AdminPageShell";
import AdminGuard from "@/components/AdminGuard";
import SectionCard from "@/components/SectionCard";
import CustomSelect from "@/components/CustomSelect";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { formatCurrency } from "@/utils/format";
import { categories } from "@/data/products";

function AdminProductsContent() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all"); // all | inStock | outOfStock
  const [sortBy, setSortBy] = useState("newest"); // newest | priceAsc | priceDesc | name

  useEffect(() => { loadProducts(); }, []);

  async function loadProducts() {
    setIsLoading(true);
    try {
      const snap = await getDocs(collection(db, "products"));
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(productId: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setDeleting(productId);
    try {
      await deleteDoc(doc(db, "products", productId));
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
    } finally {
      setDeleting(null);
    }
  }

  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== "all") {
      result = result.filter((p) => p.category === categoryFilter);
    }
    if (stockFilter === "inStock") {
      result = result.filter((p) => p.inStock !== false);
    } else if (stockFilter === "outOfStock") {
      result = result.filter((p) => p.inStock === false);
    }

    switch (sortBy) {
      case "priceAsc":  result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0)); break;
      case "priceDesc": result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0)); break;
      case "name":      result.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "")); break;
      case "newest":
      default:
        result.sort((a, b) => {
          const aT = a.createdAt?.toMillis?.() ?? 0;
          const bT = b.createdAt?.toMillis?.() ?? 0;
          return bT - aT;
        });
    }

    return result;
  }, [products, search, categoryFilter, stockFilter, sortBy]);

  const inputClass = "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-primary";

  return (
    <AdminPageShell
      eyebrow="Admin"
      title="Product management"
      description="Manage products from Firestore. Changes reflect immediately in the storefront."
    >
      {/* Filters */}
      <SectionCard className="mb-6">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[160px]">
            <p className="mb-1 text-xs muted-copy">Search</p>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name or category..."
              className={`w-full ${inputClass}`}
            />
          </div>
          <div className="min-w-[160px]">
            <CustomSelect
              label="Category"
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={[
                { value: "all", label: "All Categories" },
                ...categories.map((c) => ({ value: c.id, label: c.label })),
              ]}
            />
          </div>
          <div className="min-w-[140px]">
            <CustomSelect
              label="Stock"
              value={stockFilter}
              onChange={setStockFilter}
              options={[
                { value: "all", label: "All" },
                { value: "inStock", label: "In Stock" },
                { value: "outOfStock", label: "Out of Stock" },
              ]}
            />
          </div>
          <div className="min-w-[160px]">
            <CustomSelect
              label="Sort by"
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: "newest", label: "Newest" },
                { value: "priceAsc", label: "Price: Low → High" },
                { value: "priceDesc", label: "Price: High → Low" },
                { value: "name", label: "Name A–Z" },
              ]}
            />
          </div>
          <Link
            href="/admin/products/new"
            className="glass-button rounded-full px-5 py-2 text-sm font-bold uppercase tracking-[0.18em]"
          >
            + Add Product
          </Link>
        </div>
        <p className="mt-3 text-xs muted-copy">
          Showing {filtered.length} of {products.length} products
        </p>
      </SectionCard>

      {isLoading ? (
        <SectionCard><p className="muted-copy">Loading products...</p></SectionCard>
      ) : filtered.length === 0 ? (
        <SectionCard><p className="muted-copy">No products match your filters.</p></SectionCard>
      ) : (
        <SectionCard className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-[0.25em] text-secondary">
                <th className="pb-4 pr-6">Product</th>
                <th className="pb-4 pr-6">Category</th>
                <th className="pb-4 pr-6">Price</th>
                <th className="pb-4 pr-6">Stock</th>
                <th className="pb-4 pr-6">Image</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-white/5">
                  <td className="py-4 pr-6">
                    <p className="font-semibold text-white">{product.name}</p>
                    <p className="text-xs muted-copy">{product.id}</p>
                  </td>
                  <td className="py-4 pr-6 text-white/80 capitalize text-sm">{product.category}</td>
                  <td className="py-4 pr-6 text-primary font-semibold">{formatCurrency(product.price)}</td>
                  <td className="py-4 pr-6">
                    <span className={`text-xs rounded-full px-3 py-1 ${product.inStock !== false ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                      {product.inStock !== false ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="py-4 pr-6">
                    <img src={product.image} alt={product.name} className="h-14 w-12 rounded-xl object-cover" />
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/products/${product.id}/edit`} className="text-secondary text-sm">Edit</Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deleting === product.id}
                        className="text-red-400/70 text-sm hover:text-red-400 transition disabled:opacity-40"
                      >
                        {deleting === product.id ? "..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      )}
    </AdminPageShell>
  );
}

export default function AdminProductsPage() {
  return <AdminGuard><AdminProductsContent /></AdminGuard>;
}
