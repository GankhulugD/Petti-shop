import { SwaggerUI } from "@hono/swagger-ui";
import type { Hono } from "hono";

import type { WorkerEnv } from "@/env";
import { pettiApiDocsSpec } from "@/lib/api-docs-spec";
import { requireAdmin } from "@/lib/admin";

type AppEnv = { Bindings: WorkerEnv };

export function registerAdminDocsRoutes(app: Hono<AppEnv>) {
  app.get("/api/admin/docs", (c) => {
    const denied = requireAdmin(c);
    if (denied) return denied;

    const body = SwaggerUI({
      title: "Petti Shop API",
      spec: pettiApiDocsSpec,
      validatorUrl: "",
      persistAuthorization: true,
      docExpansion: "list",
      // Inline spec ашиглана — тусдаа OpenAPI JSON endpoint байхгүй.
      url: "/api/admin/docs",
    });

    return c.html(`
      <!doctype html>
      <html lang="mn">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="robots" content="noindex, nofollow" />
          <title>Petti Shop API</title>
        </head>
        <body>
          ${body}
        </body>
      </html>
    `);
  });
}
