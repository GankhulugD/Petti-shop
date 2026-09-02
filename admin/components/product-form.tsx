"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api-client";

const CATEGORIES = [
  { slug: "food", name: "Хоол" },
  { slug: "litter", name: "Элс" },
  { slug: "toys", name: "Тоглоом" },
  { slug: "supplies", name: "Хэрэгсэл" },
] as const;

const ANIMALS = [
  { id: "dog", label: "Нохой" },
  { id: "cat", label: "Муур" },
  { id: "fish", label: "Загас" },
  { id: "bird", label: "Шувуу" },
  { id: "small", label: "Жижиг" },
] as const;

export type ProductFormValues = {
  id?: string;
  name: string;
  brand: string;
  priceMnt: number;
  categorySlug: string;
  status: string;
  images: string;
  animals: string[];
  description: string;
  ingredients: string;
  usage: string;
  shipping: string;
  variantLabel: string;
  variantStock: number;
};

const empty: ProductFormValues = {
  name: "",
  brand: "",
  priceMnt: 0,
  categorySlug: "food",
  status: "active",
  images: "",
  animals: [],
  description: "",
  ingredients: "",
  usage: "",
  shipping: "",
  variantLabel: "Стандарт",
  variantStock: 10,
};

export function ProductForm({ initial }: { initial?: Partial<ProductFormValues> }) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormValues>({ ...empty, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit() {
    setError(null);
    if (!form.name.trim() || form.priceMnt < 0) {
      setError("Нэр болон үнэ заавал.");
      return;
    }
    setSaving(true);
    const images = form.images
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim() || undefined,
      priceMnt: form.priceMnt,
      categorySlug: form.categorySlug,
      status: form.status,
      images,
      targetAnimals: form.animals,
      description: form.description.trim() || undefined,
      details: {
        ingredients: form.ingredients.trim() || undefined,
        usage: form.usage.trim() || undefined,
        shipping: form.shipping.trim() || undefined,
      },
      variants: [
        {
          label: form.variantLabel.trim() || "Стандарт",
          priceMnt: form.priceMnt,
          stockQty: form.variantStock,
        },
      ],
    };

    try {
      if (form.id) {
        await api.patch(`/api/admin/products/${form.id}`, payload);
      } else {
        await api.post("/api/admin/products", payload);
      }
      router.push("/products");
      router.refresh();
    } catch {
      setError("Хадгалахад алдаа гарлаа. API болон ADMIN_SECRET шалгана уу.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-4 pb-28 sm:px-5 md:p-6 md:pb-8 lg:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      <h1 className="hidden text-2xl font-semibold tracking-tight md:block">
        {form.id ? "Бараа засах" : "Шинэ бараа"}
      </h1>

      <label className="space-y-1 text-sm">
        <span className="font-medium">Нэр</span>
        <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-medium">Брэнд</span>
          <Input value={form.brand} onChange={(e) => set("brand", e.target.value)} />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">Үнэ (₮)</span>
          <Input
            type="number"
            min={0}
            value={form.priceMnt || ""}
            onChange={(e) => set("priceMnt", Number(e.target.value) || 0)}
          />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-medium">Ангилал</span>
          <select
            className="h-11 w-full rounded-lg border border-neutral-200 bg-white px-2 text-sm"
            value={form.categorySlug}
            onChange={(e) => set("categorySlug", e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">Төлөв</span>
          <select
            className="h-11 w-full rounded-lg border border-neutral-200 bg-white px-2 text-sm"
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
          >
            <option value="active">Идэвхтэй</option>
            <option value="draft">Ноорог</option>
            <option value="archived">Архив</option>
          </select>
        </label>
      </div>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Амьтан</legend>
        <div className="flex flex-wrap gap-2">
          {ANIMALS.map((a) => {
            const on = form.animals.includes(a.id);
            return (
              <button
                key={a.id}
                type="button"
                onClick={() =>
                  set(
                    "animals",
                    on
                      ? form.animals.filter((id) => id !== a.id)
                      : [...form.animals, a.id],
                  )
                }
                className={`min-h-10 rounded-full px-3 py-2 text-sm font-medium ${
                  on ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-700"
                }`}
              >
                {a.label}
              </button>
            );
          })}
        </div>
      </fieldset>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-medium">Хэмжээ / хувилбар</span>
          <Input
            value={form.variantLabel}
            onChange={(e) => set("variantLabel", e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="font-medium">Нөөц</span>
          <Input
            type="number"
            min={0}
            value={form.variantStock}
            onChange={(e) => set("variantStock", Number(e.target.value) || 0)}
          />
        </label>
      </div>
      <label className="space-y-1 text-sm">
        <span className="font-medium">Зургийн URL (мөр бүрт нэг)</span>
        <textarea
          className="min-h-24 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          value={form.images}
          onChange={(e) => set("images", e.target.value)}
          placeholder="https://…"
        />
      </label>
      <label className="space-y-1 text-sm">
        <span className="font-medium">Тайлбар</span>
        <textarea
          className="min-h-20 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </label>
      <label className="space-y-1 text-sm">
        <span className="font-medium">Орц</span>
        <Input value={form.ingredients} onChange={(e) => set("ingredients", e.target.value)} />
      </label>
      <label className="space-y-1 text-sm">
        <span className="font-medium">Хэрэглэх заавар</span>
        <Input value={form.usage} onChange={(e) => set("usage", e.target.value)} />
      </label>
      <label className="space-y-1 text-sm">
        <span className="font-medium">Хүргэлт</span>
        <Input value={form.shipping} onChange={(e) => set("shipping", e.target.value)} />
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex flex-col-reverse gap-2 sm:flex-row">
        <Button type="submit" disabled={saving} className="min-h-11 w-full rounded-full sm:w-auto">
          {saving ? "Хадгалж байна…" : "Хадгалах"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="min-h-11 w-full rounded-full sm:w-auto"
          onClick={() => router.push("/products")}
        >
          Буцах
        </Button>
      </div>
    </form>
  );
}
