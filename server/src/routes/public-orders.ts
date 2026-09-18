import { eq } from "drizzle-orm";
import type { Hono } from "hono";

import { STORE } from "@/config";
import { createDb, loadProductGraphs } from "@/db/queries";
import { orderItems, orders, productVariants } from "@/db/schema";
import type { WorkerEnv } from "@/env";
import { jsonError } from "@/lib/errors";
import { serializeOrder } from "@/lib/serialize";

type AppEnv = { Bindings: WorkerEnv };

export function registerPublicOrderRoutes(app: Hono<AppEnv>) {
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
    const productGraphs = await loadProductGraphs(
      db,
      body.items.map((line) => line.productId),
    );

    const orderId = crypto.randomUUID();
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

    let subtotal = 0;
    const lineRows: (typeof orderItems.$inferInsert)[] = [];

    for (const line of body.items) {
      const qty = Math.max(1, Math.min(99, Math.floor(line.quantity)));
      const graph = productGraphs.get(line.productId);
      if (!graph || graph.product.status !== "active") {
        return jsonError(c, `product not available: ${line.productId}`, 400);
      }

      let unitPrice = graph.product.priceMnt;
      let variantLabel: string | null = null;
      let variantId: string | null = null;

      if (line.variantId) {
        const variant = graph.variants.find((v) => v.id === line.variantId);
        if (!variant) return jsonError(c, "variant not found", 400);
        if (variant.stockQty < qty) {
          return jsonError(
            c,
            `${graph.product.name} (${variant.label}) нөөц хүрэлцэхгүй`,
            400,
          );
        }
        unitPrice = variant.priceMnt;
        variantLabel = variant.label;
        variantId = variant.id;
      } else {
        const def = graph.variants.find((v) => v.isDefault) ?? graph.variants[0];
        if (def) {
          if (def.stockQty < qty) {
            return jsonError(c, `${graph.product.name} нөөц хүрэлцэхгүй`, 400);
          }
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

    const variantQty = new Map<string, number>();
    for (const line of lineRows) {
      if (!line.variantId) continue;
      variantQty.set(
        line.variantId,
        (variantQty.get(line.variantId) ?? 0) + line.quantity,
      );
    }

    for (const [variantId, qty] of variantQty) {
      const variant = await db
        .select()
        .from(productVariants)
        .where(eq(productVariants.id, variantId))
        .get();
      if (!variant) continue;
      await db
        .update(productVariants)
        .set({ stockQty: Math.max(0, variant.stockQty - qty) })
        .where(eq(productVariants.id, variant.id));
    }

    const created = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .get();
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

  app.get("/api/orders/lookup", async (c) => {
    const orderNumber = c.req.query("orderNumber")?.trim();
    const email = c.req.query("email")?.trim().toLowerCase();
    if (!orderNumber || !email) {
      return jsonError(c, "orderNumber and email are required", 400);
    }

    const db = createDb(c.env.DB);
    const row = await db
      .select()
      .from(orders)
      .where(eq(orders.orderNumber, orderNumber))
      .get();
    if (!row || row.customerEmail.toLowerCase() !== email) {
      return jsonError(c, "order not found", 404);
    }
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, row.id));
    return c.json(serializeOrder(row, items));
  });
}
