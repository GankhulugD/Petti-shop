import type { Context } from "hono";

import type { WorkerEnv } from "@/env";
import { jsonError } from "./errors";

export function requireAdmin(c: Context<{ Bindings: WorkerEnv }>) {
  const secret = c.env.ADMIN_SECRET;
  if (!secret) return null;
  const header = c.req.header("x-admin-secret");
  if (header !== secret) {
    return jsonError(c, "Unauthorized", 401);
  }
  return null;
}
