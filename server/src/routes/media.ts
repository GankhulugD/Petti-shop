import type { Hono } from "hono";

import type { WorkerEnv } from "@/env";
import { jsonError } from "@/lib/errors";
import { sanitizeMediaKey } from "@/lib/media";

type AppEnv = { Bindings: WorkerEnv };

const MEDIA_CACHE = "public, max-age=31536000, immutable";

export function registerMediaRoutes(app: Hono<AppEnv>) {
  app.get("/api/media/*", async (c) => {
    const bucket = c.env.IMAGES;
    if (!bucket) return jsonError(c, "media storage unavailable", 503);

    const prefix = "/api/media/";
    const path = c.req.path;
    if (!path.startsWith(prefix)) return jsonError(c, "not found", 404);

    const key = sanitizeMediaKey(path.slice(prefix.length));
    if (!key) return jsonError(c, "invalid key", 400);

    const object = await bucket.get(key);
    if (!object) return jsonError(c, "not found", 404);

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("Cache-Control", MEDIA_CACHE);
    headers.set("ETag", object.httpEtag);
    return new Response(object.body, { headers });
  });
}
