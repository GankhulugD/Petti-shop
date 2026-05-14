"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { AnimalKind, ShopCategory } from "@/lib/shop-products";
import { formatMnt } from "@/lib/shop-products";
import type { ShopUrlFilters } from "@/lib/shop-url";

const ANIMAL_OPTIONS: { id: AnimalKind; label: string }[] = [
  { id: "dog", label: "Нохой" },
  { id: "cat", label: "Муур" },
  { id: "fish", label: "Загас" },
  { id: "bird", label: "\u0428\u0443\u0432\u0443\u0443\u0443\u043d" },
  { id: "small", label: "Жижиг амьтан" },
];

const CATEGORY_OPTIONS: { id: ShopCategory; label: string }[] = [
  { id: "food", label: "Хоол" },
  { id: "litter", label: "Элс" },
  { id: "toys", label: "Тоглоом" },
  { id: "supplies", label: "Хэрэгсэл" },
];

export type AnimalFilterState = Partial<Record<AnimalKind, boolean>>;

export type FilterSidebarProps = {
  brands: readonly string[];
  filters: ShopUrlFilters;
  animalState: AnimalFilterState;
  onAnimalChange: (id: AnimalKind, checked: boolean) => void;
  brandState: Record<string, boolean>;
  onBrandChange: (brand: string, checked: boolean) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onCategoryChange: (cat: ShopCategory | null) => void;
  priceMin: number;
  priceMax: number;
};

export function FilterSidebar({
  brands,
  filters,
  animalState,
  onAnimalChange,
  brandState,
  onBrandChange,
  onPriceRangeChange,
  onCategoryChange,
  priceMin,
  priceMax,
}: FilterSidebarProps) {
  const searchParams = useSearchParams();
  const urlQ = searchParams.get("q");

  const priceRange: [number, number] = [filters.priceMin, filters.priceMax];

  return (
    <motion.aside
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="w-full shrink-0 md:max-w-[17.5rem]"
    >
      <div className="rounded-2xl bg-muted/50 p-4 shadow-none ring-0">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-foreground">Шүүлтүүр</p>
          {urlQ ? (
            <span className="max-w-[10rem] truncate rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              «{urlQ}»
            </span>
          ) : null}
        </div>

        <div className="mb-4 space-y-2">
          <p className="text-xs font-medium text-foreground/70">Ангилал</p>
          <div className="flex flex-wrap gap-1.5">
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => onCategoryChange(null)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                filters.cat == null
                  ? "bg-foreground text-background"
                  : "bg-background/60 text-foreground/80 hover:bg-background"
              }`}
            >
              Бүгд
            </motion.button>
            {CATEGORY_OPTIONS.map(({ id, label }) => {
              const on = filters.cat === id;
              return (
                <motion.button
                  key={id}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onCategoryChange(on ? null : id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    on
                      ? "bg-foreground text-background"
                      : "bg-background/60 text-foreground/80 hover:bg-background"
                  }`}
                >
                  {label}
                </motion.button>
              );
            })}
          </div>
        </div>

        <Accordion
          type="multiple"
          defaultValue={["animal", "brand", "price"]}
          className="space-y-2"
        >
          <AccordionItem
            value="animal"
            className="rounded-xl border-0 bg-background/60 px-3 py-0.5 not-last:border-0"
          >
            <AccordionTrigger className="py-3 text-sm font-medium text-foreground hover:no-underline">
              Амьтны төрөл
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <div className="flex flex-col gap-3 pt-1">
                {ANIMAL_OPTIONS.map(({ id, label }) => (
                  <motion.div
                    key={id}
                    className="flex items-center gap-3"
                    whileTap={{ scale: 0.98 }}
                  >
                    <Checkbox
                      id={`animal-${id}`}
                      checked={!!animalState[id]}
                      onCheckedChange={(c) => onAnimalChange(id, c === true)}
                    />
                    <Label
                      htmlFor={`animal-${id}`}
                      className="cursor-pointer text-sm font-normal text-foreground/85"
                    >
                      {label}
                    </Label>
                  </motion.div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="brand"
            className="rounded-xl border-0 bg-background/60 px-3 py-0.5 not-last:border-0"
          >
            <AccordionTrigger className="py-3 text-sm font-medium text-foreground hover:no-underline">
              Брэнд
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <div className="flex max-h-48 flex-col gap-3 overflow-y-auto pt-1 pr-1">
                {brands.map((brand) => (
                  <motion.div
                    key={brand}
                    className="flex items-center gap-3"
                    whileTap={{ scale: 0.98 }}
                  >
                    <Checkbox
                      id={`brand-${brand}`}
                      checked={!!brandState[brand]}
                      onCheckedChange={(c) => onBrandChange(brand, c === true)}
                    />
                    <Label
                      htmlFor={`brand-${brand}`}
                      className="cursor-pointer text-sm font-normal text-foreground/85"
                    >
                      {brand}
                    </Label>
                  </motion.div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="price"
            className="rounded-xl border-0 bg-background/60 px-3 py-0.5 not-last:border-0"
          >
            <AccordionTrigger className="py-3 text-sm font-medium text-foreground hover:no-underline">
              Үнэ
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <div className="space-y-4 pt-1">
                <p className="text-xs tabular-nums text-muted-foreground">
                  {formatMnt(priceRange[0])} — {formatMnt(priceRange[1])}
                </p>
                <Slider
                  min={priceMin}
                  max={priceMax}
                  step={5000}
                  value={priceRange}
                  onValueChange={(v) => {
                    if (v.length >= 2) {
                      onPriceRangeChange([v[0]!, v[1]!]);
                    }
                  }}
                  className="py-1"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </motion.aside>
  );
}
