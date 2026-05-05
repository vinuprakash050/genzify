'use client';

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import AdminPageShell from "@/components/AdminPageShell";
import AdminGuard from "@/components/AdminGuard";
import SectionCard from "@/components/SectionCard";
import CustomSelect from "@/components/CustomSelect";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { formatCurrency } from "@/utils/format";

const ALL_STATUSES = ["pending", "paid", "packed", "shipped", "delivered", "cancelled", "refunded"];

function AdminOrdersContent() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest"); // newest | oldest | totalAsc | totalDesc

  useEffect(() => {
    async function loadOrders() {
      try {
        const snap = await getDocs(collection(db, "orders"));
        const loaded = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setOrders(loaded);
      } catch (err) {
        console.error("Error loading orders:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, []);

  const filtered = useMemo(() => {
    let result = [...orders];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((o) =>
        o.id?.toLowerCase().includes(q) ||
        o.userName?.toLowerCase().includes(q) ||
        o.userEmail?.toLowerCase().includes(q) ||
        o.paymentId?.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter);
    }

    switch (sortBy) {
      case "oldest":
        result.sort((a, b) => (a.createdAt?.toMillis?.() ?? 0) - (b.createdAt?.toMillis?.() ?? 0));
        break;
      case "totalAsc":
        result.sort((a, b) => (a.total ?? 0) - (b.total ?? 0));
        break;
      case "totalDesc":
        result.sort((a, b) => (b.total ?? 0) - (a.total ?? 0));
        break;
      case "newest":
      default:
        result.sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
    }

    return result;
  }, [orders, search, statusFilter, sortBy]);

  // Summary counts
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length };
    for (const s of ALL_STATUSES) {
      c[s] = orders.filter((o) => o.status === s).length;
    }
    return c;
  }, [orders]);

  const totalRevenue = useMemo(() =>
    orders.filter((o) => o.status === "paid" || o.status === "delivered" || o.status === "shipped")
      .reduce((sum, o) => sum + (o.total ?? 0), 0),
    [orders]
  );

  const inputClass = "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-primary";

  const statusColor: Record<string, string> = {
    paid: "bg-green-500/20 text-green-400",
    delivered: "bg-green-500/20 text-green-400",
    shipped: "bg-blue-500/20 text-blue-400",
    packed: "bg-yellow-500/20 text-yellow-400",
    pending: "bg-yellow-500/20 text-yellow-400",
    cancelled: "bg-red-500/20 text-red-400",
    refunded: "bg-red-500/20 text-red-400",
  };

  return (
    <AdminPageShell
      eyebrow="Admin"
      title="Order management"
      description="All customer orders from Firestore. Update status and tracking per order."
    >
      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Orders", value: orders.length },
          { label: "Revenue", value: formatCurrency(totalRevenue) },
          { label: "Pending", value: (counts.pending || 0) + (counts.paid || 0) },
          { label: "Delivered", value: counts.delivered || 0 },
        ].map(({ label, value }) => (
          <SectionCard key={label}>
            <p className="text-xs muted-copy uppercase tracking-[0.3em]">{label}</p>
            <p className="mt-2 text-2xl font-bold text-primary">{value}</p>
          </SectionCard>
        ))}
      </div>

      {/* Filters */}
      <SectionCard className="mb-6">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[160px]">
            <p className="mb-1 text-xs muted-copy">Search</p>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Order ID, name, email..."
              className={`w-full ${inputClass}`}
            />
          </div>
          <div className="min-w-[180px]">
            <CustomSelect
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "all", label: `All (${counts.all})` },
                ...ALL_STATUSES.map((s) => ({
                  value: s,
                  label: `${s.charAt(0).toUpperCase() + s.slice(1)} (${counts[s] || 0})`,
                })),
              ]}
            />
          </div>
          <div className="min-w-[180px]">
            <CustomSelect
              label="Sort by"
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: "newest", label: "Newest first" },
                { value: "oldest", label: "Oldest first" },
                { value: "totalDesc", label: "Total: High → Low" },
                { value: "totalAsc", label: "Total: Low → High" },
              ]}
            />
          </div>
        </div>
        <p className="mt-3 text-xs muted-copy">
          Showing {filtered.length} of {orders.length} orders
        </p>
      </SectionCard>

      {isLoading ? (
        <SectionCard><p className="muted-copy">Loading orders...</p></SectionCard>
      ) : filtered.length === 0 ? (
        <SectionCard><p className="muted-copy">No orders match your filters.</p></SectionCard>
      ) : (
        <SectionCard className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-[0.25em] text-secondary">
                <th className="pb-4 pr-6">Order</th>
                <th className="pb-4 pr-6">Customer</th>
                <th className="pb-4 pr-6">Status</th>
                <th className="pb-4 pr-6">Date</th>
                <th className="pb-4 pr-6">Total</th>
                <th className="pb-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-white/5">
                  <td className="py-4 pr-6">
                    <p className="font-semibold text-white text-sm">{order.id.slice(0, 10).toUpperCase()}</p>
                    {order.paymentId && <p className="text-xs muted-copy">{order.paymentId}</p>}
                  </td>
                  <td className="py-4 pr-6">
                    <p className="text-sm text-white/80">{order.userName || "—"}</p>
                    <p className="text-xs muted-copy">{order.userEmail || ""}</p>
                  </td>
                  <td className="py-4 pr-6">
                    <span className={`text-xs rounded-full px-3 py-1 capitalize ${statusColor[order.status] || "bg-white/10 text-white/60"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 pr-6 text-white/80 text-sm">
                    {order.createdAt?.toDate
                      ? order.createdAt.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                      : "—"}
                  </td>
                  <td className="py-4 pr-6 text-white font-semibold">{formatCurrency(order.total)}</td>
                  <td className="py-4">
                    <Link href={`/admin/orders/${order.id}`} className="text-secondary text-sm">
                      Manage
                    </Link>
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

export default function AdminOrdersPage() {
  return <AdminGuard><AdminOrdersContent /></AdminGuard>;
}
