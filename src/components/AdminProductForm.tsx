'use client';

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminPageShell from "./AdminPageShell";
import CustomSelect from "./CustomSelect";
import SectionCard from "./SectionCard";
import { categories, products } from "@/data/products";
import Cropper from "react-easy-crop";

interface AdminProductFormProps {
  productId?: string;
}

export default function AdminProductForm({ productId }: AdminProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(productId);

  const product = useMemo(
    () => products.find((item) => item.id === productId),
    [productId],
  );

  const initialValues = product || {
    id: "",
    name: "",
    price: "",
    image: "",
    category: categories[0].id,
  };

  const [category, setCategory] = useState(initialValues.category);
  const [imageSrc, setImageSrc] = useState<string | null>(initialValues.image || null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    router.push("/admin/products");
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  async function getCroppedImage() {
    if (!imageSrc || !croppedAreaPixels) return;
    const image = new Image();
    image.src = imageSrc;

    return new Promise<string>((resolve) => {
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        canvas.width = 1200;
        canvas.height = 1200;
        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          1200,
          1200,
        );
        resolve(canvas.toDataURL("image/webp"));
      };
    });
  }

  if (isEdit && !product) {
    return (
      <AdminPageShell
        eyebrow="Admin"
        title="Product not found"
        description="This product ID is not available in the current demo dataset."
      >
        <Link href="/admin/products" className="rounded-full border border-primary/30 px-6 py-3 text-primary">
          Back to products
        </Link>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      eyebrow="Admin"
      title={isEdit ? "Edit product" : "Add product"}
      description="A lightweight admin form for product creation and editing. Hook this form to create/update product endpoints when the backend is ready."
    >
      <SectionCard className="max-w-4xl">
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm muted-copy">Product ID</span>
            <input
              defaultValue={initialValues.id}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm muted-copy">Price</span>
            <input
              type="number"
              defaultValue={initialValues.price}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm muted-copy">Product name</span>
            <input
              defaultValue={initialValues.name}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm muted-copy">Product Image</span>
            {!imageSrc && (
              <input type="file" accept="image/*" onChange={onFileChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3" />
            )}
            {imageSrc && (
              <div className="relative h-[400px] w-full overflow-hidden rounded-2xl bg-black">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
            )}
            {imageSrc && (
              <div className="mt-3 flex gap-4">
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={async () => {
                    const cropped = await getCroppedImage();
                    console.log(cropped);
                  }}
                  className="glass-button rounded-full px-4 py-2"
                >
                  Save Image
                </button>
              </div>
            )}
          </label>
          <CustomSelect
            label="Category"
            value={category}
            onChange={setCategory}
            options={categories.map((option) => ({
              value: option.id,
              label: option.label,
            }))}
          />
          <label className="block">
            <span className="mb-2 block text-sm muted-copy">Fabric / details</span>
            <input
              placeholder="240 GSM cotton, oversized fit, etc."
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm muted-copy">Description</span>
            <textarea
              rows={5}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              placeholder="Describe the product, fit, and material details."
            />
          </label>
          <div className="flex flex-wrap gap-4 pt-2 sm:col-span-2">
            <button className="glass-button rounded-full px-6 py-3 font-bold">
              {isEdit ? "Save Changes" : "Create Product"}
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
