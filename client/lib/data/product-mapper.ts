import type { AnimalKind, ShopCategory, ShopProduct } from "@/lib/shop-products";
import { SHOP_CATEGORIES, formatMnt } from "@/lib/shop-products";

export type ApiVariant = {
  id: string;
  label: string;
  priceMnt: number;
  stock?: number;
  stockQty?: number;
  isDefault?: boolean;
};

export type ApiProduct = {
  id: string;
  slug: string;
  name: string;
  brand?: string | null;
  priceMnt: number;
  priceLabel?: string;
  rating?: number;
  badge?: string | null;
  animals?: string[];
  categorySlug?: string | null;
  imageSrc?: string;
  imageAlt?: string;
  images?: string[];
  variants?: ApiVariant[];
  sizeOptions?: {
    label: string;
    priceLabel: string;
    priceMnt?: number;
    stock?: number;
  }[];
  ingredients?: string | null;
  usage?: string | null;
  shipping?: string | null;
  description?: string | null;
};

function isShopCategory(v: string | null | undefined): v is ShopCategory {
  return !!v && (SHOP_CATEGORIES as readonly string[]).includes(v);
}

function isAnimalKind(v: string): v is AnimalKind {
  return ["dog", "cat", "fish", "bird", "small"].includes(v);
}

export function mapApiProduct(raw: ApiProduct): ShopProduct {
  const priceMnt = Number(raw.priceMnt ?? 0);
  const priceLabel = raw.priceLabel ?? formatMnt(priceMnt);
  const images =
    Array.isArray(raw.images) && raw.images.length
      ? raw.images
      : raw.imageSrc
        ? [raw.imageSrc]
        : [];

  const sizeOptions =
    raw.variants?.map((v) => ({
      variantId: v.id,
      label: v.label,
      priceLabel: formatMnt(v.priceMnt),
      priceMnt: v.priceMnt,
      stock: v.stock ?? v.stockQty,
    })) ??
    raw.sizeOptions?.map((s) => ({
      label: s.label,
      priceLabel: s.priceLabel ?? formatMnt(s.priceMnt ?? priceMnt),
      priceMnt: s.priceMnt ?? priceMnt,
      stock: s.stock,
    })) ??
    [{ label: "Стандарт", priceLabel, priceMnt }];

  const categorySlug = raw.categorySlug ?? null;

  return {
    id: raw.id,
    slug: raw.slug ?? raw.id,
    name: raw.name,
    priceMnt,
    priceLabel,
    rating: Number(raw.rating ?? 4.5),
    imageSrc: images[0] ?? "",
    imageAlt: raw.imageAlt ?? raw.name,
    images,
    brand: raw.brand ?? "",
    animals: (raw.animals ?? []).filter(isAnimalKind),
    shopCategory: isShopCategory(categorySlug) ? categorySlug : "food",
    badge:
      raw.badge === "best" || raw.badge === "new" ? raw.badge : undefined,
    sizeOptions,
    ingredients: raw.ingredients ?? raw.description ?? "",
    usage: raw.usage ?? "",
    shipping: raw.shipping ?? "",
  };
}

export function mapApiProductList(
  data: { items?: ApiProduct[] } | ApiProduct[] | null,
): ShopProduct[] {
  if (!data) return [];
  const list = Array.isArray(data) ? data : (data.items ?? []);
  return list.map(mapApiProduct);
}
