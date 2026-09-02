"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";

import { ProductCard } from "@/components/products/ProductCard";
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

type ShopPageClientProps = {
  products: ShopProduct[];
};

export function ShopPageClient({ products }: ShopPageClientProps) {
  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand).filter(Boolean))].sort(),
    [products],
  );
  const router = useRouter();
  const sp = useSearchParams();
  const spString = sp.toString();
  const openCartSheet = useCart((s) => s.openSheet);
  const openCartHandledRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(spString);
    if (params.get("openCart") !== "1") {
      openCartHandledRef.current = false;
      return;
    }
    if (openCartHandledRef.current) return;
    openCartHandledRef.current = true;
    openCartSheet();
    params.delete("openCart");
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `/shop?${qs}` : "/shop", { scroll: false });
    });
  }, [spString, router, openCartSheet]);

  const filters = useMemo(
    () => parseShopSearchParams(new URLSearchParams(spString || "")),
    [spString],
  );

  const pushFilters = useCallback(
    (patch: Partial<ShopUrlFilters>) => {
      const qsRaw =
        typeof window !== "undefined"
          ? window.location.search.replace(/^\?/, "")
          : spString;
      const current = parseShopSearchParams(new URLSearchParams(qsRaw));
      const next: ShopUrlFilters = { ...current, ...patch };
      startTransition(() => {
        router.replace(shopPathFromFilters(next), { scroll: false });
      });
    },
    [router, spString],
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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-8 md:flex-row md:items-start"
      >
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
                {filtered.length} бүтээгдэхүүн
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
                  <SheetHeader className="border-b border-foreground/[0.06] px-4 py-3 text-left">
                    <SheetTitle>Шүүлтүүр</SheetTitle>
                  </SheetHeader>
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="max-h-[calc(100dvh-5rem)] overflow-y-auto p-4"
                  >
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

          <div
            key={`${spString}-${filtered.map((p) => p.id).join(",")}`}
            className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
          >
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                productId={p.id}
                name={p.name}
                price={p.priceLabel}
                rating={p.rating}
                imageSrc={p.imageSrc}
                imageAlt={p.imageAlt}
                href={`/product/${p.slug}`}
                badge={p.badge}
                brand={p.brand}
              />
            ))}
          </div>

          {products.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center text-sm text-muted-foreground"
            >
              Бараа олдсонгүй. Сервер асаасан эсэхээ шалгана уу (
              <code className="text-xs">server → npm run dev</code>).
            </motion.p>
          ) : filtered.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center text-sm text-muted-foreground"
            >
              Шүүлтүүрт тохирох бараа олдсонгүй. Шүүлтүүрийг өөрчилж үзнэ үү.
            </motion.p>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
