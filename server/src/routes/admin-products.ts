import { eq } from "drizzle-orm";
import type { Hono } from "hono";

import { createDb, loadProductGraph } from "@/db/queries";
import { categories, productVariants, products } from "@/db/schema";
import type { WorkerEnv } from "@/env";
import { requireAdmin } from "@/lib/admin";
import { jsonError } from "@/lib/errors";
import { serializeProductDetail } from "@/lib/serialize";

type AppEnv = { Bindings: WorkerEnv };

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0400-\u04FF]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function registerAdminProductRoutes(app: Hono<AppEnv>) {
  app.post("/api/admin/products", async (c) => {
    const denied = requireAdmin(c);
    if (denied) return denied;

    let body: {
      name?: string;
      slug?: string;
      categorySlug?: string;
      priceMnt?: number;
      brand?: string;
      description?: string;
      status?: string;
      images?: string[];
      targetAnimals?: string[];
      variants?: { label: string; priceMnt: number; stockQty?: number }[];
    };
    try {
      body = await c.req.json();
    } catch {
      return jsonError(c, "Invalid JSON body", 400);
    }

    const name = body.name?.trim();
    const priceMnt = Number(body.priceMnt);
    if (!name || !Number.isFinite(priceMnt) || priceMnt < 0) {
      return jsonError(c, "name and priceMnt are required", 400);
    }

    const db = createDb(c.env.DB);
    const id = crypto.randomUUID();
    const slug = body.slug?.trim() || slugify(name) || id;

    let categoryId: string | null = null;
    if (body.categorySlug) {
      const cat = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, body.categorySlug))
        .get();
      categoryId = cat?.id ?? null;
    }

    const now = new Date().toISOString();
    await db.insert(products).values({
      id,
      categoryId,
      slug,
      name,
      description: body.description?.trim() ?? null,
      brand: body.brand?.trim() ?? null,
      priceMnt,
      status: (body.status as "draft" | "active" | "archived") ?? "draft",
      targetAnimals: body.targetAnimals ?? [],
      images: body.images ?? [],
      createdAt: now,
      updatedAt: now,
    });

    const variants = body.variants?.length
      ? body.variants
      : [{ label: "Стандарт", priceMnt, stockQty: 0 }];

    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      await db.insert(productVariants).values({
        id: crypto.randomUUID(),
        productId: id,
        label: v.label.trim(),
        priceMnt: v.priceMnt,
        stockQty: v.stockQty ?? 0,
        isDefault: i === variants.length - 1,
      });
    }

    const graph = await loadProductGraph(db, id);
    if (!graph) return jsonError(c, "Failed to load product", 500);
    return c.json(
      serializeProductDetail(graph.product, graph.variants, graph.category),
      201,
    );
  });

  app.patch("/api/admin/products/:id", async (c) => {
    const denied = requireAdmin(c);
    if (denied) return denied;

    let body: {
      name?: string;
      priceMnt?: number;
      status?: string;
      brand?: string;
      description?: string;
      images?: string[];
      categorySlug?: string;
      targetAnimals?: string[];
      badge?: string | null;
      details?: { ingredients?: string; usage?: string; shipping?: string };
      variants?: { label: string; priceMnt: number; stockQty?: number }[];
    };
    try {
      body = await c.req.json();
    } catch {
      return jsonError(c, "Invalid JSON body", 400);
    }

    const db = createDb(c.env.DB);
    const existing = await db
      .select()
      .from(products)
      .where(eq(products.id, c.req.param("id")))
      .get();
    if (!existing) return jsonError(c, "product not found", 404);

    const patch: Partial<typeof products.$inferInsert> = {
      updatedAt: new Date().toISOString(),
    };
    if (body.name?.trim()) patch.name = body.name.trim();
    if (body.brand !== undefined) patch.brand = body.brand?.trim() ?? null;
    if (body.description !== undefined) {
      patch.description = body.description?.trim() ?? null;
    }
    if (body.images) patch.images = body.images;
    if (body.status) patch.status = body.status as typeof existing.status;
    if (body.priceMnt !== undefined && Number.isFinite(body.priceMnt)) {
      patch.priceMnt = body.priceMnt;
    }
    if (body.categorySlug !== undefined) {
      if (body.categorySlug) {
        const cat = await db
          .select()
          .from(categories)
          .where(eq(categories.slug, body.categorySlug))
          .get();
        patch.categoryId = cat?.id ?? null;
      } else {
        patch.categoryId = null;
      }
    }
    if (body.images) patch.images = body.images;
    if (Array.isArray(body.targetAnimals)) patch.targetAnimals = body.targetAnimals;
    if (body.badge !== undefined) patch.badge = body.badge;
    if (body.details) patch.details = body.details;

    await db.update(products).set(patch).where(eq(products.id, existing.id));

    if (body.variants?.length) {
      const current = await db
        .select()
        .from(productVariants)
        .where(eq(productVariants.productId, existing.id));
      for (const v of body.variants) {
        const match = current.find((row) => row.label === v.label.trim());
        if (match) {
          await db
            .update(productVariants)
            .set({
              priceMnt: v.priceMnt,
              stockQty: v.stockQty ?? match.stockQty,
            })
            .where(eq(productVariants.id, match.id));
        } else {
          await db.insert(productVariants).values({
            id: crypto.randomUUID(),
            productId: existing.id,
            label: v.label.trim(),
            priceMnt: v.priceMnt,
            stockQty: v.stockQty ?? 0,
            isDefault: false,
          });
        }
      }
    }

    const graph = await loadProductGraph(db, existing.id);
    if (!graph) return jsonError(c, "Failed to load product", 500);
    return c.json(
      serializeProductDetail(graph.product, graph.variants, graph.category),
    );
  });

  app.get("/api/admin/products/:id", async (c) => {
    const denied = requireAdmin(c);
    if (denied) return denied;
    const graph = await loadProductGraph(createDb(c.env.DB), c.req.param("id"));
    if (!graph) return jsonError(c, "product not found", 404);
    return c.json(
      serializeProductDetail(graph.product, graph.variants, graph.category),
    );
  });
}
