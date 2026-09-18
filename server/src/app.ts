import { eq } from "drizzle-orm";
import { Hono } from "hono";

import { createDb } from "@/db/queries";
import { orderItems, orders } from "@/db/schema";
import type { WorkerEnv } from "@/env";
import { requireAdmin } from "@/lib/admin";
import { apiCorsMiddleware } from "@/lib/cors";
import { jsonError } from "@/lib/errors";
import { registerAdminDocsRoutes } from "@/routes/admin-docs";
import { registerAdminListRoutes } from "@/routes/admin-list";
import { registerAdminMediaRoutes } from "@/routes/admin-media";
import { registerAdminProductRoutes } from "@/routes/admin-products";
import { registerMediaRoutes } from "@/routes/media";
import { registerPublicCatalogRoutes } from "@/routes/public-catalog";
import { registerPublicOrderRoutes } from "@/routes/public-orders";
import { serializeOrder } from "@/lib/serialize";

type AppEnv = { Bindings: WorkerEnv };

const app = new Hono<AppEnv>();

app.use("*", async (c, next) => apiCorsMiddleware(c.env)(c, next));

app.get("/", (c) => c.json({ service: "petti-api", version: "4" }));

registerPublicCatalogRoutes(app);
registerPublicOrderRoutes(app);
registerAdminListRoutes(app);

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

registerMediaRoutes(app);
registerAdminMediaRoutes(app);
registerAdminDocsRoutes(app);
registerAdminProductRoutes(app);

export default app;
