import { and, count, desc, eq, inArray, like, or, sql } from "drizzle-orm";

import { createDb, type Database } from "./client";
import {
  categories,
  orderItems,
  orders,
  products,
  productVariants,
} from "./schema";
import {
  serializeOrder,
  serializeProductCard,
  serializeProductDetail,
} from "@/lib/serialize";

export async function loadProductGraph(db: Database, productId: string) {
  const product = await db
    .select()
    .from(products)
    .where(eq(products.id, productId))
    .get();
  if (!product) return null;

  const variants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, productId));

  let category = null;
  if (product.categoryId) {
    category =
      (await db
        .select()
        .from(categories)
        .where(eq(categories.id, product.categoryId))
        .get()) ?? null;
  }

  return { product, variants, category };
}

export async function loadProductBySlug(db: Database, slug: string) {
  const product = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .get();
  if (!product) return null;
  return loadProductGraph(db, product.id);
}

export type ProductGraph = NonNullable<Awaited<ReturnType<typeof loadProductGraph>>>;

export async function loadProductGraphs(
  db: Database,
  productIds: string[],
): Promise<Map<string, ProductGraph>> {
  const unique = [...new Set(productIds.filter(Boolean))];
  const result = new Map<string, ProductGraph>();
  if (!unique.length) return result;

  const productRows = await db
    .select()
    .from(products)
    .where(inArray(products.id, unique));
  if (!productRows.length) return result;

  const variantRows = await db
    .select()
    .from(productVariants)
    .where(inArray(productVariants.productId, unique));

  const categoryIds = [
    ...new Set(
      productRows
        .map((p) => p.categoryId)
        .filter((id): id is string => !!id),
    ),
  ];
  const categoryRows = categoryIds.length
    ? await db
        .select()
        .from(categories)
        .where(inArray(categories.id, categoryIds))
    : [];
  const categoryById = new Map(categoryRows.map((c) => [c.id, c]));

  const variantsByProduct = new Map<string, (typeof variantRows)[number][]>();
  for (const variant of variantRows) {
    const list = variantsByProduct.get(variant.productId) ?? [];
    list.push(variant);
    variantsByProduct.set(variant.productId, list);
  }

  for (const product of productRows) {
    result.set(product.id, {
      product,
      variants: variantsByProduct.get(product.id) ?? [],
      category: product.categoryId
        ? (categoryById.get(product.categoryId) ?? null)
        : null,
    });
  }

  return result;
}

export async function listProductsByIds(db: Database, ids: string[]) {
  const unique = [...new Set(ids.filter(Boolean))].slice(0, 50);
  if (!unique.length) return [];

  const rows = await db
    .select({
      product: products,
      categorySlug: categories.slug,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(eq(products.status, "active"), inArray(products.id, unique)),
    )
    .orderBy(desc(products.updatedAt));

  return rows.map((row) =>
    serializeProductCard(row.product, row.categorySlug),
  );
}

export async function listAdminProductDetails(db: Database) {
  const rows = await db
    .select({
      product: products,
      categoryName: categories.name,
      category: categories,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(desc(products.updatedAt));

  if (!rows.length) return [];

  const productIds = rows.map((row) => row.product.id);
  const variantRows = await db
    .select()
    .from(productVariants)
    .where(inArray(productVariants.productId, productIds));

  const variantsByProduct = new Map<string, (typeof variantRows)[number][]>();
  for (const variant of variantRows) {
    const list = variantsByProduct.get(variant.productId) ?? [];
    list.push(variant);
    variantsByProduct.set(variant.productId, list);
  }

  return rows.map((row) => ({
    ...serializeProductDetail(
      row.product,
      variantsByProduct.get(row.product.id) ?? [],
      row.category,
    ),
    categoryName: row.categoryName,
  }));
}

export async function listActiveProducts(
  db: Database,
  filters?: { q?: string; categorySlug?: string; limit?: number },
) {
  const q = filters?.q?.trim().toLowerCase();
  const categorySlug = filters?.categorySlug?.trim();
  const limit =
    filters?.limit != null
      ? Math.max(1, Math.min(100, Math.floor(filters.limit)))
      : undefined;

  const base = db
    .select({
      product: products,
      categorySlug: categories.slug,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(products.status, "active"),
        categorySlug ? eq(categories.slug, categorySlug) : undefined,
        q
          ? or(
              like(products.name, `%${q}%`),
              like(products.brand, `%${q}%`),
              like(products.slug, `%${q}%`),
            )
          : undefined,
      ),
    )
    .orderBy(desc(products.updatedAt));

  const rows = limit ? await base.limit(limit) : await base;

  return rows.map((row) =>
    serializeProductCard(row.product, row.categorySlug),
  );
}

export async function getDashboardStats(db: Database) {
  const [productCount] = await db.select({ value: count() }).from(products);
  const [orderCount] = await db.select({ value: count() }).from(orders);
  const [pendingOrders] = await db
    .select({ value: count() })
    .from(orders)
    .where(eq(orders.status, "pending"));
  const [revenue] = await db
    .select({ value: sql<number>`coalesce(sum(${orders.totalMnt}), 0)` })
    .from(orders)
    .where(sql`${orders.status} != 'cancelled'`);
  const [activeProducts] = await db
    .select({ value: count() })
    .from(products)
    .where(eq(products.status, "active"));

  return {
    totalProducts: productCount?.value ?? 0,
    activeProducts: activeProducts?.value ?? 0,
    totalOrders: orderCount?.value ?? 0,
    pendingOrders: pendingOrders?.value ?? 0,
    revenueMnt: Number(revenue?.value ?? 0),
  };
}

export async function listOrdersAdmin(db: Database) {
  const rows = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt));

  if (!rows.length) return [];

  const allItems = await db
    .select()
    .from(orderItems)
    .where(inArray(orderItems.orderId, rows.map((row) => row.id)));

  const itemsByOrder = new Map<string, (typeof allItems)[number][]>();
  for (const item of allItems) {
    const list = itemsByOrder.get(item.orderId) ?? [];
    list.push(item);
    itemsByOrder.set(item.orderId, list);
  }

  return rows.map((row) =>
    serializeOrder(row, itemsByOrder.get(row.id) ?? []),
  );
}

export { createDb };
