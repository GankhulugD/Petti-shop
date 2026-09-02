import { cors } from "hono/cors";

import type { WorkerEnv } from "@/env";

const DEV_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
];

export function getAllowedOrigins(env: WorkerEnv): string[] {
  const raw = env.ALLOWED_ORIGINS?.trim();
  if (!raw) return DEV_ORIGINS;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function apiCorsMiddleware(env: WorkerEnv) {
  const allowed = getAllowedOrigins(env);
  return cors({
    origin: (origin) => {
      if (!origin) return allowed[0] ?? "*";
      return allowed.includes(origin) ? origin : null;
    },
    allowMethods: ["GET", "HEAD", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "x-admin-secret"],
  });
}

export const apiCors = apiCorsMiddleware;
