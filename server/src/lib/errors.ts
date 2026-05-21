import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export function jsonError(
  c: Context,
  message: string,
  status: ContentfulStatusCode,
  details?: unknown,
) {
  const body: { error: string; details?: unknown } = { error: message };
  if (details !== undefined) body.details = details;
  return c.json(body, status);
}
