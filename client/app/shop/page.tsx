import { Suspense } from "react";

import { ShopPageClient } from "@/components/shop/ShopPageClient";
import { fetchCatalogProducts } from "@/lib/api";

export const dynamic = "force-dynamic";

function ShopFallback() {
  return (
    <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-24 md:px-10">
      <p className="text-sm text-muted-foreground">Ачаалж байна…</p>
    </div>
  );
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string }>;
}) {
  const sp = await searchParams;
  const products = await fetchCatalogProducts({
    q: sp.q,
    cat: sp.cat,
  });

  return (
    <Suspense fallback={<ShopFallback />}>
      <ShopPageClient products={products} />
    </Suspense>
  );
}
