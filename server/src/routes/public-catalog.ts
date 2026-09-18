import { eq } from "drizzle-orm";
import type { Hono } from "hono";

import { categories } from "@/db/schema";
import {
  createDb,
  listActiveProducts,
  listProductsByIds,
  loadProductBySlug,
} from "@/db/queries";
import type { WorkerEnv } from "@/env";
import { jsonError } from "@/lib/errors";
import { getApiPublicBase, withProductMedia } from "@/lib/media";
import {
  serializeCategory,
  serializeProductDetail,
  serializeStoreConfig,
} from "@/lib/serialize";

type AppEnv = { Bindings: WorkerEnv };

export const PUBLIC_CACHE = "public, s-maxage=60, stale-while-revalidate=120";

export function registerPublicCatalogRoutes(app: Hono<AppEnv>) {
  app.get("/api/shop", (c) => {
    c.header("Cache-Control", PUBLIC_CACHE);
    return c.json(serializeStoreConfig());
  });

  app.get("/api/categories", async (c) => {
    const db = createDb(c.env.DB);
    const rows = await db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(categories.sortOrder);
    c.header("Cache-Control", PUBLIC_CACHE);
    return c.json(rows.map(serializeCategory));
  });

  app.get("/api/products", async (c) => {
    const db = createDb(c.env.DB);
    const apiBase = getApiPublicBase(c.env, c.req.url);
    const idsRaw = c.req.query("ids");

    if (idsRaw) {
      const ids = idsRaw
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);
      const items = await listProductsByIds(db, ids);
      c.header("Cache-Control", PUBLIC_CACHE);
      return c.json({
        items: items.map((item) => withProductMedia(item, apiBase)),
      });
    }

    const q = c.req.query("q") ?? undefined;
    const categorySlug = c.req.query("cat") ?? c.req.query("category") ?? undefined;
    const limitRaw = c.req.query("limit");
    const limit = limitRaw ? Number(limitRaw) : undefined;
    const items = await listActiveProducts(db, {
      q,
      categorySlug,
      limit: Number.isFinite(limit) ? limit : undefined,
    });
    c.header("Cache-Control", PUBLIC_CACHE);
    return c.json({
      items: items.map((item) => withProductMedia(item, apiBase)),
    });
  });

  app.get("/api/products/:slug", async (c) => {
    const db = createDb(c.env.DB);
    const graph = await loadProductBySlug(db, c.req.param("slug"));
    if (!graph) return jsonError(c, "product not found", 404);
    const apiBase = getApiPublicBase(c.env, c.req.url);
    c.header("Cache-Control", PUBLIC_CACHE);
    return c.json(
      withProductMedia(
        serializeProductDetail(graph.product, graph.variants, graph.category),
        apiBase,
      ),
    );
  });
}
