import type { ShopProduct } from "@/lib/shop-products";
import { getApiBaseUrl } from "@/lib/api";
import { SHOP_CATEGORIES, formatMnt } from "@/lib/shop-products";

type CatalogFilters = { q?: string; cat?: string; limit?: number };

type CacheEntry = { data: ShopProduct[]; ts: number };
const memory = new Map<string, CacheEntry>();
const TTL_MS = 5 * 60_000;

type ApiProduct = {
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
};

function cacheKey(filters?: CatalogFilters): string {
  return JSON.stringify(filters ?? {});
}

function mapProduct(raw: ApiProduct): ShopProduct {
  const priceMnt = Number(raw.priceMnt ?? 0);
  const images =
    Array.isArray(raw.images) && raw.images.length
      ? raw.images
      : raw.imageSrc
        ? [raw.imageSrc]
        : [];
  const categorySlug = raw.categorySlug ?? null;
  const isCat = (v: string | null) =>
    !!v && (SHOP_CATEGORIES as readonly string[]).includes(v);

  return {
    id: raw.id,
    slug: raw.slug ?? raw.id,
    name: raw.name,
    priceMnt,
    priceLabel: raw.priceLabel ?? formatMnt(priceMnt),
    rating: Number(raw.rating ?? 4.5),
    imageSrc: images[0] ?? "",
    imageAlt: raw.imageAlt ?? raw.name,
    images,
    brand: raw.brand ?? "",
    animals: (raw.animals ?? []).filter((a) =>
      ["dog", "cat", "fish", "bird", "small"].includes(a),
    ) as ShopProduct["animals"],
    shopCategory: isCat(categorySlug) ? (categorySlug as ShopProduct["shopCategory"]) : "food",
    badge: raw.badge === "best" || raw.badge === "new" ? raw.badge : undefined,
    sizeOptions: [{ label: "Стандарт", priceLabel: raw.priceLabel ?? formatMnt(priceMnt), priceMnt }],
    ingredients: "",
    usage: "",
    shipping: "",
  };
}

function readCacheEntry(key: string): ShopProduct[] | null {
  const hit = memory.get(key);
  if (hit && Date.now() - hit.ts < TTL_MS) return hit.data;
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(`petti:${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEntry;
    if (Date.now() - parsed.ts > TTL_MS) return null;
    memory.set(key, parsed);
    return parsed.data;
  } catch {
    return null;
  }
}

export function readCatalogCache(filters?: CatalogFilters): ShopProduct[] | null {
  const direct = readCacheEntry(cacheKey(filters));
  if (direct) return direct;
  if (filters?.limit) {
    const full = readCacheEntry(cacheKey());
    if (full?.length) return full.slice(0, filters.limit);
  }
  return null;
}

export async function fetchCatalogCached(
  filters?: CatalogFilters,
): Promise<ShopProduct[]> {
  const key = cacheKey(filters);
  const cached = readCatalogCache(filters);
  if (cached) return cached;

  const params = new URLSearchParams();
  if (filters?.q) params.set("q", filters.q);
  if (filters?.cat) params.set("cat", filters.cat);
  if (filters?.limit) params.set("limit", String(filters.limit));
  const qs = params.toString();

  const res = await fetch(
    `${getApiBaseUrl()}${qs ? `/api/products?${qs}` : "/api/products"}`,
    { cache: "default" },
  );
  if (!res.ok) throw new Error("catalog fetch failed");
  const body = (await res.json()) as { items?: ApiProduct[] } | ApiProduct[];
  const list = Array.isArray(body) ? body : (body.items ?? []);
  const data = list.map(mapProduct);

  const entry = { data, ts: Date.now() };
  memory.set(key, entry);
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(`petti:${key}`, JSON.stringify(entry));
    } catch {
      /* quota */
    }
  }
  return data;
}
