import { Suspense } from "react";

import { ShopPageClient } from "@/components/shop/ShopPageClient";

function ShopFallback() {
  return (
    <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-24 md:px-10">
      <p className="text-sm text-muted-foreground">Ачаалж байна…</p>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopFallback />}>
      <ShopPageClient />
    </Suspense>
  );
}
