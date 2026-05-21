import { WishlistPageClient } from "@/components/wishlist/WishlistPageClient";
import { fetchCatalogProducts } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const catalog = await fetchCatalogProducts();
  return <WishlistPageClient catalog={catalog} />;
}
