import { and, count, desc, eq, like, or, sql } from "drizzle-orm";

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
  serializeProductDetail,
  serializeProductList,
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

export async function listActiveProducts(
  db: Database,
  filters?: { q?: string; categorySlug?: string },
) {
  const q = filters?.q?.trim().toLowerCase();
  const categorySlug = filters?.categorySlug?.trim();

  const rows = await db
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

  const result = [];
  for (const row of rows) {
    const graph = await loadProductGraph(db, row.product.id);
    if (!graph) continue;
    result.push(
      serializeProductList(
        graph.product,
        graph.variants,
        row.categorySlug,
      ),
    );
  }
  return result;
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

  const result = [];
  for (const row of rows) {
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, row.id));
    result.push(serializeOrder(row, items));
  }
  return result;
}

export { createDb };
