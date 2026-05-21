import type { InferSelectModel } from "drizzle-orm";

import { STORE } from "@/config";
import type {
  categories,
  orderItems,
  orders,
  productVariants,
  products,
  ProductDetails,
} from "@/db/schema";

export function ratingFromTenths(tenths: number): number {
  return Math.round(tenths) / 10;
}

function productImages(row: InferSelectModel<typeof products>): string[] {
  return Array.isArray(row.images) ? row.images : [];
}

function productDetails(row: InferSelectModel<typeof products>): ProductDetails {
  return (row.details as ProductDetails) ?? {};
}

export function serializeStoreConfig() {
  return {
    name: STORE.name,
    slug: STORE.slug,
    currency: STORE.currency,
    freeShippingFromMnt: STORE.freeShippingFromMnt,
    flatShippingMnt: STORE.flatShippingMnt,
  };
}

export function serializeCategory(row: InferSelectModel<typeof categories>) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    sortOrder: row.sortOrder,
    isActive: row.isActive,
  };
}

export function serializeVariant(row: InferSelectModel<typeof productVariants>) {
  return {
    id: row.id,
    productId: row.productId,
    label: row.label,
    sku: row.sku,
    priceMnt: row.priceMnt,
    stock: row.stockQty,
    stockQty: row.stockQty,
    isDefault: row.isDefault,
  };
}

export function serializeProductList(
  row: InferSelectModel<typeof products>,
  variants: InferSelectModel<typeof productVariants>[],
  categorySlug?: string | null,
) {
  const urls = productImages(row);
  const d = productDetails(row);
  return {
    id: row.id,
    slug: row.slug,
    sku: row.sku,
    name: row.name,
    brand: row.brand,
    priceMnt: row.priceMnt,
    compareAtMnt: row.compareAtMnt,
    priceLabel: `₮ ${row.priceMnt.toLocaleString("mn-MN")}`,
    rating: ratingFromTenths(row.ratingTenths),
    status: row.status,
    badge: row.badge,
    animals: row.targetAnimals ?? [],
    categorySlug: categorySlug ?? null,
    imageSrc: urls[0] ?? "",
    imageAlt: row.imageAlt ?? row.name,
    images: urls,
    variants: variants.map(serializeVariant),
    ingredients: d.ingredients ?? null,
    usage: d.usage ?? null,
    shipping: d.shipping ?? null,
  };
}

export function serializeProductDetail(
  row: InferSelectModel<typeof products>,
  variants: InferSelectModel<typeof productVariants>[],
  category: InferSelectModel<typeof categories> | null,
) {
  const d = productDetails(row);
  return {
    ...serializeProductList(row, variants, category?.slug ?? null),
    description: row.description,
    category: category ? serializeCategory(category) : null,
    sizeOptions: variants.map((v) => ({
      label: v.label,
      priceLabel: `₮ ${v.priceMnt.toLocaleString("mn-MN")}`,
      priceMnt: v.priceMnt,
      stock: v.stockQty,
    })),
    ingredients: d.ingredients ?? null,
    usage: d.usage ?? null,
    shipping: d.shipping ?? null,
  };
}

export function serializeOrder(
  row: InferSelectModel<typeof orders>,
  items: InferSelectModel<typeof orderItems>[],
) {
  return {
    id: row.id,
    orderNumber: row.orderNumber,
    email: row.customerEmail,
    fullName: row.customerName,
    phone: row.customerPhone,
    shippingAddress: row.shippingAddress,
    subtotalMnt: row.subtotalMnt,
    shippingMnt: row.shippingMnt,
    totalMnt: row.totalMnt,
    status: row.status,
    paymentStatus: row.paymentStatus,
    notes: row.notes,
    createdAt: row.createdAt,
    items: items.map(serializeOrderItem),
  };
}

export function serializeOrderItem(row: InferSelectModel<typeof orderItems>) {
  return {
    id: row.id,
    productId: row.productId,
    variantId: row.variantId,
    productName: row.productName,
    variantLabel: row.variantLabel,
    imageUrl: row.imageUrl,
    unitPriceMnt: row.unitPriceMnt,
    quantity: row.quantity,
    lineTotalMnt: row.lineTotalMnt,
  };
}
