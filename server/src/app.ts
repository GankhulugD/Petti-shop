import { and, desc, eq } from "drizzle-orm";
import { Hono } from "hono";

import { STORE } from "@/config";
import {
  createDb,
  getDashboardStats,
  listActiveProducts,
  listOrdersAdmin,
  loadProductBySlug,
  loadProductGraph,
} from "@/db/queries";
import { categories, orderItems, orders, products } from "@/db/schema";
import type { WorkerEnv } from "@/env";
import { requireAdmin } from "@/lib/admin";
import { apiCors } from "@/lib/cors";
import { jsonError } from "@/lib/errors";
import {
  serializeCategory,
  serializeOrder,
  serializeProductDetail,
  serializeStoreConfig,
} from "@/lib/serialize";

type AppEnv = { Bindings: WorkerEnv };

const app = new Hono<AppEnv>();

app.use("*", apiCors);

app.get("/", (c) => c.json({ service: "petti-api", version: "3" }));

app.get("/api/shop", (c) => c.json(serializeStoreConfig()));

app.get("/api/categories", async (c) => {
  const db = createDb(c.env.DB);
  const rows = await db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(categories.sortOrder);
  return c.json(rows.map(serializeCategory));
});

app.get("/api/products", async (c) => {
  const db = createDb(c.env.DB);
  return c.json({ items: await listActiveProducts(db) });
});

app.get("/api/products/:slug", async (c) => {
  const db = createDb(c.env.DB);
  const graph = await loadProductBySlug(db, c.req.param("slug"));
  if (!graph) return jsonError(c, "product not found", 404);
  return c.json(
    serializeProductDetail(graph.product, graph.variants, graph.category),
  );
});

app.post("/api/orders", async (c) => {
  let body: {
    email?: string;
    fullName?: string;
    phone?: string;
    shippingAddress?: Record<string, unknown>;
    items?: { productId: string; variantId?: string; quantity: number }[];
    notes?: string;
  };
  try {
    body = await c.req.json();
  } catch {
    return jsonError(c, "Invalid JSON body", 400);
  }

  const email = body.email?.trim();
  const fullName = body.fullName?.trim();
  if (!email || !fullName || !body.items?.length) {
    return jsonError(c, "email, fullName and items are required", 400);
  }

  const db = createDb(c.env.DB);
  const orderId = crypto.randomUUID();
  const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

  let subtotal = 0;
  const lineRows: (typeof orderItems.$inferInsert)[] = [];

  for (const line of body.items) {
    const qty = Math.max(1, Math.min(99, Math.floor(line.quantity)));
    const graph = await loadProductGraph(db, line.productId);
    if (!graph || graph.product.status !== "active") {
      return jsonError(c, `product not available: ${line.productId}`, 400);
    }

    let unitPrice = graph.product.priceMnt;
    let variantLabel: string | null = null;
    let variantId: string | null = null;

    if (line.variantId) {
      const variant = graph.variants.find((v) => v.id === line.variantId);
      if (!variant) return jsonError(c, "variant not found", 400);
      unitPrice = variant.priceMnt;
      variantLabel = variant.label;
      variantId = variant.id;
    } else {
      const def = graph.variants.find((v) => v.isDefault) ?? graph.variants[0];
      if (def) {
        unitPrice = def.priceMnt;
        variantLabel = def.label;
        variantId = def.id;
      }
    }

    const lineTotal = unitPrice * qty;
    subtotal += lineTotal;
    const urls = graph.product.images ?? [];

    lineRows.push({
      id: crypto.randomUUID(),
      orderId,
      productId: graph.product.id,
      variantId,
      productName: graph.product.name,
      variantLabel,
      imageUrl: urls[0] ?? null,
      unitPriceMnt: unitPrice,
      quantity: qty,
      lineTotalMnt: lineTotal,
    });
  }

  const shippingMnt =
    subtotal >= STORE.freeShippingFromMnt
      ? 0
      : subtotal > 0
        ? STORE.flatShippingMnt
        : 0;

  await db.insert(orders).values({
    id: orderId,
    orderNumber,
    customerEmail: email,
    customerName: fullName,
    customerPhone: body.phone?.trim() ?? null,
    shippingAddress: (body.shippingAddress ?? {}) as typeof orders.$inferInsert.shippingAddress,
    subtotalMnt: subtotal,
    shippingMnt,
    totalMnt: subtotal + shippingMnt,
    status: "pending",
    paymentStatus: "unpaid",
    notes: body.notes ?? null,
  });

  if (lineRows.length) await db.insert(orderItems).values(lineRows);

  const created = await db.select().from(orders).where(eq(orders.id, orderId)).get();
  return c.json(
    {
      id: created!.id,
      orderNumber: created!.orderNumber,
      totalMnt: created!.totalMnt,
      status: created!.status,
    },
    201,
  );
});

app.get("/api/admin/dashboard", async (c) => {
  const denied = requireAdmin(c);
  if (denied) return denied;
  return c.json(await getDashboardStats(createDb(c.env.DB)));
});

app.get("/api/admin/categories", async (c) => {
  const denied = requireAdmin(c);
  if (denied) return denied;
  const db = createDb(c.env.DB);
  const rows = await db
    .select()
    .from(categories)
    .orderBy(categories.sortOrder);
  return c.json(rows.map(serializeCategory));
});

app.get("/api/admin/products", async (c) => {
  const denied = requireAdmin(c);
  if (denied) return denied;
  const db = createDb(c.env.DB);
  const rows = await db
    .select({ product: products, categoryName: categories.name })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(desc(products.updatedAt));

  const items = [];
  for (const row of rows) {
    const graph = await loadProductGraph(db, row.product.id);
    if (!graph) continue;
    items.push({
      ...serializeProductDetail(
        graph.product,
        graph.variants,
        graph.category,
      ),
      categoryName: row.categoryName,
    });
  }
  return c.json({ items });
});

app.get("/api/admin/orders", async (c) => {
  const denied = requireAdmin(c);
  if (denied) return denied;
  return c.json({ items: await listOrdersAdmin(createDb(c.env.DB)) });
});

app.patch("/api/admin/orders/:id", async (c) => {
  const denied = requireAdmin(c);
  if (denied) return denied;

  let body: { status?: string; paymentStatus?: string };
  try {
    body = await c.req.json();
  } catch {
    return jsonError(c, "Invalid JSON body", 400);
  }

  const db = createDb(c.env.DB);
  const existing = await db
    .select()
    .from(orders)
    .where(eq(orders.id, c.req.param("id")))
    .get();
  if (!existing) return jsonError(c, "order not found", 404);

  const patch: Partial<typeof orders.$inferInsert> = {
    updatedAt: new Date().toISOString(),
  };
  if (body.status) patch.status = body.status as typeof existing.status;
  if (body.paymentStatus) {
    patch.paymentStatus = body.paymentStatus as typeof existing.paymentStatus;
  }

  await db.update(orders).set(patch).where(eq(orders.id, existing.id));
  const updated = await db
    .select()
    .from(orders)
    .where(eq(orders.id, existing.id))
    .get();
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, existing.id));
  return c.json(serializeOrder(updated!, items));
});

/** Admin panel backward compat */
app.get("/admin/stats", async (c) => {
  const denied = requireAdmin(c);
  if (denied) return denied;
  const s = await getDashboardStats(createDb(c.env.DB));
  return c.json({
    totalProducts: s.totalProducts,
    activeProducts: s.activeProducts,
    totalOrders: s.totalOrders,
    pendingOrders: s.pendingOrders,
    revenueMnt: s.revenueMnt,
  });
});

app.get("/admin/products", async (c) => {
  const denied = requireAdmin(c);
  if (denied) return denied;
  const db = createDb(c.env.DB);
  const rows = await db.select().from(products).orderBy(desc(products.updatedAt));
  const items = [];
  for (const row of rows) {
    const graph = await loadProductGraph(db, row.id);
    if (!graph) continue;
    const urls = row.images ?? [];
    items.push({
      id: row.id,
      name: row.name,
      price: row.priceMnt,
      description: row.description,
      images: urls,
      imageSrc: urls[0] ?? "",
      status: row.status,
      slug: row.slug,
    });
  }
  return c.json(items);
});

export default app;
