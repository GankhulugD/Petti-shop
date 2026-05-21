/** Домэйн төрөл — өгөгдөл API-аас ирнэ (`@/lib/api`) */

export type AnimalKind = "dog" | "cat" | "fish" | "bird" | "small";

export const SHOP_CATEGORIES = ["food", "litter", "toys", "supplies"] as const;
export type ShopCategory = (typeof SHOP_CATEGORIES)[number];

export type ShopProduct = {
  id: string;
  slug: string;
  name: string;
  priceMnt: number;
  priceLabel: string;
  rating: number;
  imageSrc: string;
  imageAlt: string;
  images: string[];
  brand: string;
  animals: AnimalKind[];
  shopCategory: ShopCategory;
  badge?: "best" | "new";
  sizeOptions: { label: string; priceLabel: string }[];
  ingredients: string;
  usage: string;
  shipping: string;
};

export function formatMnt(n: number): string {
  return `₮ ${n.toLocaleString("mn-MN")}`;
}
