import type { AnimalKind, ShopCategory } from "@/lib/shop-products";
import { SHOP_CATEGORIES } from "@/lib/shop-products";

export const SHOP_PRICE_MIN = 0;
export const SHOP_PRICE_MAX = 500_000;

export type ShopSortKey = "default" | "price-asc" | "price-desc" | "name";

const SORT_VALUES: ShopSortKey[] = [
  "default",
  "price-asc",
  "price-desc",
  "name",
];

const URL_ANIMALS: AnimalKind[] = ["dog", "cat", "fish", "bird", "small"];

export type ShopUrlFilters = {
  cat: ShopCategory | null;
  q: string;
  animals: AnimalKind[];
  brands: string[];
  priceMin: number;
  priceMax: number;
  sort: ShopSortKey;
};

export function parseShopSearchParams(sp: URLSearchParams): ShopUrlFilters {
  const catRaw = sp.get("cat");
  const cat = SHOP_CATEGORIES.includes(catRaw as ShopCategory)
    ? (catRaw as ShopCategory)
    : null;

  const q = (sp.get("q") ?? "").trim();

  const animals = (sp.get("animals") ?? "")
    .split(",")
    .filter((a): a is AnimalKind =>
      URL_ANIMALS.includes(a as AnimalKind),
    );

  const brands = (sp.get("brands") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const minRaw = sp.get("min");
  const maxRaw = sp.get("max");
  let priceMin =
    minRaw != null && minRaw !== ""
      ? parseInt(minRaw, 10)
      : SHOP_PRICE_MIN;
  let priceMax =
    maxRaw != null && maxRaw !== ""
      ? parseInt(maxRaw, 10)
      : SHOP_PRICE_MAX;
  if (Number.isNaN(priceMin)) priceMin = SHOP_PRICE_MIN;
  if (Number.isNaN(priceMax)) priceMax = SHOP_PRICE_MAX;
  priceMin = Math.max(SHOP_PRICE_MIN, Math.min(priceMin, SHOP_PRICE_MAX));
  priceMax = Math.max(SHOP_PRICE_MIN, Math.min(priceMax, SHOP_PRICE_MAX));
  if (priceMin > priceMax) {
    const t = priceMin;
    priceMin = priceMax;
    priceMax = t;
  }

  const sortRaw = sp.get("sort");
  const sort = SORT_VALUES.includes(sortRaw as ShopSortKey)
    ? (sortRaw as ShopSortKey)
    : "default";

  return {
    cat,
    q,
    animals,
    brands,
    priceMin,
    priceMax,
    sort,
  };
}

export function buildShopSearchParams(f: ShopUrlFilters): string {
  const p = new URLSearchParams();
  if (f.cat) p.set("cat", f.cat);
  if (f.q) p.set("q", f.q);
  if (f.animals.length) p.set("animals", f.animals.join(","));
  if (f.brands.length) p.set("brands", f.brands.join(","));
  if (f.priceMin !== SHOP_PRICE_MIN) p.set("min", String(f.priceMin));
  if (f.priceMax !== SHOP_PRICE_MAX) p.set("max", String(f.priceMax));
  if (f.sort !== "default") p.set("sort", f.sort);
  return p.toString();
}

export function shopPathFromFilters(f: ShopUrlFilters): string {
  const qs = buildShopSearchParams(f);
  return qs ? `/shop?${qs}` : "/shop";
}
