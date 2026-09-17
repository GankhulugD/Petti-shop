import type { Hono } from "hono";

import type { WorkerEnv } from "@/env";
import { requireAdmin } from "@/lib/admin";
import { jsonError } from "@/lib/errors";
import {
  ALLOWED_IMAGE_MIME,
  extensionForMime,
  getApiPublicBase,
  MAX_IMAGE_BYTES,
  resolveMediaUrl,
} from "@/lib/media";

type AppEnv = { Bindings: WorkerEnv };

export function registerAdminMediaRoutes(app: Hono<AppEnv>) {
  app.post("/api/admin/media", async (c) => {
    const denied = requireAdmin(c);
    if (denied) return denied;

    const bucket = c.env.IMAGES;
    if (!bucket) {
      return jsonError(
        c,
        "R2 хадгалалт идэвхгүй. Cloudflare Dashboard → R2 идэвхжүүлээд petti-images bucket үүсгэнэ үү.",
        503,
      );
    }

    const form = await c.req.formData();
    const file = form.get("file");
    if (
      !file ||
      typeof file === "string" ||
      typeof (file as File).arrayBuffer !== "function"
    ) {
      return jsonError(c, "file field required", 400);
    }
    const upload = file as File;
    if (!ALLOWED_IMAGE_MIME.includes(upload.type)) {
      return jsonError(c, "Зөвхөн JPEG, PNG, WebP, GIF зөвшөөрнө", 400);
    }
    if (upload.size > MAX_IMAGE_BYTES) {
      return jsonError(c, "Файл 5MB-аас их байж болохгүй", 400);
    }

    const ext = extensionForMime(upload.type);
    if (!ext) return jsonError(c, "unsupported image type", 400);

    const key = `products/${crypto.randomUUID()}.${ext}`;
    await bucket.put(key, await upload.arrayBuffer(), {
      httpMetadata: { contentType: upload.type },
    });

    const base = getApiPublicBase(c.env, c.req.url);
    return c.json({
      key,
      url: resolveMediaUrl(key, base),
    });
  });
}
