"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";

import { ProductGrid } from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  FilterSidebar,
  type AnimalFilterState,
} from "@/components/shop/FilterSidebar";
import type { AnimalKind, ShopCategory, ShopProduct } from "@/lib/shop-products";
import {
  parseShopSearchParams,
  shopPathFromFilters,
  type ShopSortKey,
  type ShopUrlFilters,
} from "@/lib/shop-url";
import { useCart } from "@/store/useCart";

function sortProducts(list: ShopProduct[], sort: ShopSortKey): ShopProduct[] {
  const next = [...list];
  switch (sort) {
    case "price-asc":
      return next.sort((a, b) => a.priceMnt - b.priceMnt);
    case "price-desc":
      return next.sort((a, b) => b.priceMnt - a.priceMnt);
    case "name":
      return next.sort((a, b) => a.name.localeCompare(b.name, "mn"));
    default:
      return next;
  }
}

function filterShopProducts(
  catalog: ShopProduct[],
  f: ShopUrlFilters,
): ShopProduct[] {
  let list = [...catalog];
  if (f.cat) {
    list = list.filter((p) => p.shopCategory === f.cat);
  }
  if (f.q) {
    const q = f.q.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q),
    );
  }
  if (f.animals.length) {
    list = list.filter((p) =>
      p.animals.some((a) => f.animals.includes(a)),
    );
  }
  if (f.brands.length) {
    list = list.filter((p) => f.brands.includes(p.brand));
  }
  list = list.filter(
    (p) => p.priceMnt >= f.priceMin && p.priceMnt <= f.priceMax,
  );
  return sortProducts(list, f.sort);
}

function animalsToRecord(animals: AnimalKind[]): AnimalFilterState {
  const r: AnimalFilterState = {};
  for (const a of animals) r[a] = true;
  return r;
}

function brandsToRecord(
  allBrands: string[],
  brands: string[],
): Record<string, boolean> {
  return Object.fromEntries(allBrands.map((b) => [b, brands.includes(b)]));
}

function readShopSearch(): string {
  if (typeof window === "undefined") return "";
  return window.location.search.replace(/^\?/, "");
}

function writeShopPath(path: string) {
  if (typeof window === "undefined") return;
  const current = `${window.location.pathname}${window.location.search}`;
  if (current === path) return;
  window.history.replaceState(window.history.state, "", path);
  window.dispatchEvent(new Event("petti:shop-url"));
}

type ShopPageClientProps = {
  products: ShopProduct[];
  loading?: boolean;
  children?: ReactNode;
};

export function ShopPageClient({
  products,
  loading = false,
  children,
}: ShopPageClientProps) {
  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand).filter(Boolean))].sort(),
    [products],
  );
  const [spString, setSpString] = useState("");
  const openCartSheet = useCart((s) => s.openSheet);
  const openCartHandledRef = useRef(false);

  useEffect(() => {
    const sync = () => setSpString(readShopSearch());
    sync();
    window.addEventListener("popstate", sync);
    window.addEventListener("petti:shop-url", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("petti:shop-url", sync);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(spString);
    if (params.get("openCart") !== "1") return;
    if (openCartHandledRef.current) return;
    openCartHandledRef.current = true;
    openCartSheet();
    params.delete("openCart");
    const qs = params.toString();
    writeShopPath(qs ? `/shop?${qs}` : "/shop");
  }, [spString, openCartSheet]);

  const filters = useMemo(
    () => parseShopSearchParams(new URLSearchParams(spString || "")),
    [spString],
  );

  const pushFilters = useCallback(
    (patch: Partial<ShopUrlFilters>) => {
      const current = parseShopSearchParams(new URLSearchParams(readShopSearch()));
      const next: ShopUrlFilters = { ...current, ...patch };
      const nextPath = shopPathFromFilters(next);
      writeShopPath(nextPath);
      setSpString(nextPath.includes("?") ? nextPath.slice(nextPath.indexOf("?") + 1) : "");
    },
    [],
  );

  const animalState = useMemo(
    () => animalsToRecord(filters.animals),
    [filters],
  );
  const brandState = useMemo(
    () => brandsToRecord(brands, filters.brands),
    [brands, filters.brands],
  );

  const filtered = useMemo(
    () => filterShopProducts(products, filters),
    [products, filters],
  );

  const [sheetOpen, setSheetOpen] = useState(false);

  const onAnimalChange = (id: AnimalKind, checked: boolean) => {
    const set = new Set(filters.animals);
    if (checked) set.add(id);
    else set.delete(id);
    pushFilters({ animals: [...set] });
  };

  const onBrandChange = (brand: string, checked: boolean) => {
    const set = new Set(filters.brands);
    if (checked) set.add(brand);
    else set.delete(brand);
    pushFilters({ brands: [...set] });
  };

  const onCategoryChange = (cat: ShopCategory | null) => {
    pushFilters({ cat });
  };

  const onPriceRangeChange = (range: [number, number]) => {
    pushFilters({ priceMin: range[0], priceMax: range[1] });
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-10 md:py-10">
      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        <aside className="hidden shrink-0 md:block md:w-[17.5rem] lg:w-72">
          <div className="md:sticky md:top-24">
            <FilterSidebar
              brands={brands}
              filters={filters}
              animalState={animalState}
              onAnimalChange={onAnimalChange}
              brandState={brandState}
              onBrandChange={onBrandChange}
              onPriceRangeChange={onPriceRangeChange}
              onCategoryChange={onCategoryChange}
              priceMin={0}
              priceMax={500_000}
            />
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Бүх бараа
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {loading ? "…" : `${filtered.length} бүтээгдэхүүн`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="default"
                    className="md:hidden rounded-full border-0 bg-muted/60 text-foreground shadow-none active:scale-[0.97]"
                  >
                    <SlidersHorizontal className="size-4" />
                    Шүүлтүүр
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[min(100%,22rem)] border-0 bg-background p-0 sm:max-w-md"
                >
                  <motion.div
                    className="flex h-full min-h-0 flex-col"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <SheetHeader className="border-b border-foreground/[0.06] px-4 py-3 text-left">
                      <SheetTitle>Шүүлтүүр</SheetTitle>
                    </SheetHeader>
                    <div className="max-h-[calc(100dvh-5rem)] overflow-y-auto p-4">
                      <FilterSidebar
                        brands={brands}
                        filters={filters}
                        animalState={animalState}
                        onAnimalChange={onAnimalChange}
                        brandState={brandState}
                        onBrandChange={onBrandChange}
                        onPriceRangeChange={onPriceRangeChange}
                        onCategoryChange={onCategoryChange}
                        priceMin={0}
                        priceMax={500_000}
                      />
                    </div>
                  </motion.div>
                </SheetContent>
              </Sheet>

              <Select
                value={filters.sort}
                onValueChange={(v) =>
                  pushFilters({ sort: v as ShopSortKey })
                }
              >
                <SelectTrigger
                  size="default"
                  className="h-10 w-full min-w-[12rem] rounded-full border-0 bg-muted/60 text-foreground shadow-none sm:w-52"
                >
                  <SelectValue placeholder="Эрэмбэлэх" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-0 shadow-lg ring-1 ring-foreground/10">
                  <SelectItem value="default">Анхдагч</SelectItem>
                  <SelectItem value="price-asc">Үнэ ↑</SelectItem>
                  <SelectItem value="price-desc">Үнэ ↓</SelectItem>
                  <SelectItem value="name">Нэрээр (А-Я)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading && children ? (
            children
          ) : (
            <ProductGrid
              products={filtered}
              className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
            />
          )}

          {!loading && products.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Бараа олдсонгүй. Сервер асаасан эсэхээ шалгана уу (
              <code className="text-xs">server → npm run dev</code>).
            </p>
          ) : !loading && filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Шүүлтүүрт тохирох бараа олдсонгүй. Шүүлтүүрийг өөрчилж үзнэ үү.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
