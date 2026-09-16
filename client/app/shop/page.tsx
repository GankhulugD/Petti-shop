import { ShopPageClient } from "@/components/shop/ShopPageClient";
import { fetchCatalogProducts } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await fetchCatalogProducts();
  return <ShopPageClient products={products} />;
}
