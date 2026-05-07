'use client';

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminPageShell from "./AdminPageShell";
import AdminGuard from "./AdminGuard";
import CustomSelect from "./CustomSelect";
import SectionCard from "./SectionCard";
import { categories } from "@/data/products";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, addDoc, collection, Timestamp } from "firebase/firestore";
import Cropper from "react-easy-crop";

interface AdminProductFormProps {
  productId?: string;
}

function AdminProductFormContent({ productId }: AdminProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(productId);

  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: "", price: "", description: "", fabric: "",
    category: categories[0].id,
    inStock: true,
    image: "",
  });
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit || !productId) return;
    async function loadProduct() {
      try {
        const snap = await getDoc(doc(db, "products", productId!));
        if (snap.exists()) {
          const data = snap.data();
          setForm({
            name: data.name || "",
            price: String(data.price || ""),
            description: data.description || "",
            fabric: data.fabric || "",
            category: data.category || categories[0].id,
            inStock: data.inStock !== false,
            image: data.image || "",
          });
          if (data.image) setImageSrc(data.image);
        }
      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [productId, isEdit]);

  const onCropComplete = useCallback((_: any, pixels: any) => {
    setCroppedAreaPixels(pixels);
  }, []);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setCroppedImage(null);
      };
      reader.readAsDataURL(file);
    }
  }

  async function getCroppedImageData(): Promise<string | null> {
    if (!imageSrc) return null;
    // If no crop interaction happened, return original image as-is
    if (!croppedAreaPixels) return imageSrc;

    return new Promise((resolve) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = imageSrc!;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        // Preserve the cropped area's natural aspect ratio
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
        );
        resolve(canvas.toDataURL("image/webp", 0.9));
      };
    });
  }

  async function uploadToImgBB(base64: string): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) throw new Error("ImgBB API key not configured");

    // Strip the data:image/...;base64, prefix
    const base64Data = base64.split(",")[1];

    const formData = new FormData();
    formData.append("image", base64Data);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!data.success) throw new Error("ImgBB upload failed: " + data.error?.message);
    return data.data.url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.price) { setError("Name and price are required."); return; }

    setIsSaving(true);
    setError("");

    try {
      let imageUrl = form.image;

      // Upload image to ImgBB if a new one was selected
      if (imageSrc && imageSrc !== form.image) {
        const cropped = await getCroppedImageData();
        if (cropped) {
          imageUrl = await uploadToImgBB(cropped);
        }
      }

      const productData = {
        name: form.name,
        price: Number(form.price),
        description: form.description,
        fabric: form.fabric,
        category: form.category,
        inStock: form.inStock,
        image: imageUrl,
        sizes: ["S", "M", "L", "XL"],
        updatedAt: Timestamp.now(),
      };

      if (isEdit && productId) {
        await setDoc(doc(db, "products", productId), { ...productData, createdAt: Timestamp.now() }, { merge: true });
      } else {
        await addDoc(collection(db, "products"), { ...productData, createdAt: Timestamp.now() });
      }

      setSaved(true);
      setTimeout(() => router.push("/admin/products"), 1000);
    } catch (err: any) {
      console.error("Error saving product:", err);
      setError(err.message || "Failed to save product.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <AdminPageShell eyebrow="Admin" title="Loading..." description="">
        <SectionCard><p className="muted-copy">Loading product...</p></SectionCard>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      eyebrow="Admin"
      title={isEdit ? "Edit product" : "Add product"}
      description={isEdit ? "Update product details. Changes save to Firestore and reflect in the storefront immediately." : "Add a new product to the storefront. It will appear immediately after saving."}
    >
      <SectionCard className="max-w-4xl">
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          {error && (
            <div className="sm:col-span-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
          {saved && (
            <div className="sm:col-span-2 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              Saved! Redirecting...
            </div>
          )}

          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm muted-copy">Product name *</span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-primary"
              placeholder="e.g. Static Drift Tee"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm muted-copy">Price (₹) *</span>
            <input
              required
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-primary"
              placeholder="e.g. 1499"
            />
          </label>

          <div className="block">
            <CustomSelect
              label="Category"
              value={form.category}
              onChange={(val) => setForm((f) => ({ ...f, category: val }))}
              options={categories.map((c) => ({ value: c.id, label: c.label }))}
            />
          </div>

          <label className="block">
            <span className="mb-2 block text-sm muted-copy">Fabric / details</span>
            <input
              value={form.fabric}
              onChange={(e) => setForm((f) => ({ ...f, fabric: e.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-primary"
              placeholder="240 GSM cotton, oversized fit"
            />
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => setForm((f) => ({ ...f, inStock: e.target.checked }))}
            />
            <span className="text-sm text-white/80">In Stock</span>
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm muted-copy">Description</span>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-primary"
              placeholder="Describe the product..."
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm muted-copy">Product Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/70"
            />
          </label>

          {imageSrc && (
            <div className="sm:col-span-2 space-y-3">
              <div className="relative h-[480px] w-full overflow-hidden rounded-2xl bg-black">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={3 / 4}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs muted-copy">Zoom</span>
                <input
                  type="range" min={1} max={3} step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1"
                />
              </div>
            </div>
          )}

          {/* Show current image if editing and no new file selected */}
          {!imageSrc && form.image && (
            <div className="sm:col-span-2">
              <p className="mb-2 text-xs muted-copy">Current image</p>
              <img src={form.image} alt="Current" className="h-32 w-24 rounded-2xl object-cover" />
            </div>
          )}

          <div className="flex flex-wrap gap-4 pt-2 sm:col-span-2">
            <button
              type="submit"
              disabled={isSaving}
              className="glass-button rounded-full px-6 py-3 font-bold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
            </button>
            <Link href="/admin/products" className="rounded-full border border-secondary/30 px-6 py-3 text-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </SectionCard>
    </AdminPageShell>
  );
}

export default function AdminProductForm({ productId }: AdminProductFormProps) {
  return (
    <AdminGuard>
      <AdminProductFormContent productId={productId} />
    </AdminGuard>
  );
}
