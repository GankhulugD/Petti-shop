import { desc, eq } from "drizzle-orm";
import type { Hono } from "hono";

import {
  createDb,
  getDashboardStats,
  listAdminProductDetails,
  listOrdersAdmin,
  loadProductGraph,
} from "@/db/queries";
import { categories, products } from "@/db/schema";
import type { WorkerEnv } from "@/env";
import { requireAdmin } from "@/lib/admin";
import { serializeCategory } from "@/lib/serialize";

type AppEnv = { Bindings: WorkerEnv };

export function registerAdminListRoutes(app: Hono<AppEnv>) {
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
    const items = await listAdminProductDetails(createDb(c.env.DB));
    return c.json({ items });
  });

  app.get("/api/admin/orders", async (c) => {
    const denied = requireAdmin(c);
    if (denied) return denied;
    return c.json({ items: await listOrdersAdmin(createDb(c.env.DB)) });
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
}
