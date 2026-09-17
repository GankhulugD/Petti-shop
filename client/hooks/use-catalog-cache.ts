"use client";

import { useSyncExternalStore } from "react";

import {
  readCatalogCache,
  subscribeCatalogCache,
} from "@/lib/catalog-client";
import type { ShopProduct } from "@/lib/shop-products";

type CatalogFilters = { q?: string; cat?: string; limit?: number };

export function useCatalogCache(
  filters?: CatalogFilters,
): ShopProduct[] | null {
  return useSyncExternalStore(
    subscribeCatalogCache,
    () => readCatalogCache(filters),
    () => null,
  );
}
