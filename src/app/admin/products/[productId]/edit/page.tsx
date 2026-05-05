'use client';

import { useParams } from "next/navigation";
import AdminProductForm from "@/components/AdminProductForm";

export default function AdminEditProductPage() {
  const params = useParams();
  return <AdminProductForm productId={params.productId as string} />;
}
