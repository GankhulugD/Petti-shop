/**
 * Verified Unsplash photo paths (HEAD 200 as of project setup).
 * Many older Unsplash IDs 404 on images.unsplash.com — use only listed paths.
 * @see next.config.ts `images.remotePatterns` for images.unsplash.com
 */

const VERIFIED_PET_PHOTO_PATHS = [
  "photo-1517849845537-4d257902454a",
  "photo-1514888286974-6c03e2ca1dba",
  "photo-1574158622682-e40e69881006",
  "photo-1544551763-46a013bb70d5",
  "photo-1425082661705-1834bfd09dca",
  "photo-1534361960057-19889db9621e",
  "photo-1601758228041-f3b2795255f1",
  "photo-1545249390-6bdfa286032f",
  "photo-1524704654690-b56c05c78a00",
  "photo-1552053831-71594a27632d",
  "photo-1583337130417-3346a1be7dee",
  "photo-1560807707-8cc77767d783",
  "photo-1548199973-03cce0bbc87b",
  "photo-1494256997604-768d1f608cac",
  "photo-1516467508483-a7212febe31a",
  "photo-1450778869180-41d0601e046e",
  "photo-1526336024174-e58f5cdd8e13",
  "photo-1535591273668-578e31182c4f",
  "photo-1504593811423-6dd665756598",
] as const;

const QUERY = "auto=format&fit=crop&w=800&q=80";

function photoUrl(path: string): string {
  return `https://images.unsplash.com/${path}?${QUERY}`;
}

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Stable “random” pet photo per product. `variant` shifts which pool index is used
 * (e.g. 0 = primary, 1–2 = gallery, 5+ = alternate thumb for shop grid).
 */
export function petImageUrlForProduct(
  productId: string,
  variant: number = 0,
): string {
  const n = VERIFIED_PET_PHOTO_PATHS.length;
  const ix = (hashString(productId) + variant) % n;
  return photoUrl(VERIFIED_PET_PHOTO_PATHS[ix]!);
}

/** Shop listing cards: different variant from catalog `imageSrc` (variant 0) for variety. */
export const SHOP_GRID_PET_IMAGE_VARIANT = 5;

export function productPetGallery(id: string): {
  imageSrc: string;
  images: string[];
} {
  return {
    imageSrc: petImageUrlForProduct(id, 0),
    images: [
      petImageUrlForProduct(id, 0),
      petImageUrlForProduct(id, 1),
      petImageUrlForProduct(id, 2),
    ],
  };
}

/** Precompute shop grid thumbs on the server so SSR and client hydration use the same URLs. */
export function shopListingImageSrcMapForProductIds(
  ids: readonly string[],
): Record<string, string> {
  return Object.fromEntries(
    ids.map((id) => [
      id,
      petImageUrlForProduct(id, SHOP_GRID_PET_IMAGE_VARIANT),
    ]),
  );
}
