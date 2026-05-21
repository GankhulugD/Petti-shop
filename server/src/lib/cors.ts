import { cors } from "hono/cors";

export const apiCors = cors({
  origin: "*",
  allowMethods: ["GET", "HEAD", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "x-admin-secret"],
});
