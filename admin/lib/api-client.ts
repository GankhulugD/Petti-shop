import axios, { AxiosError, type AxiosInstance } from "axios";

export function getAxiosPayload(res: { data?: unknown }): unknown {
  const d = res.data;
  if (d !== undefined && d !== null) return d;
  return res;
}

function normalizeBaseUrl(url: string | undefined): string | undefined {
  if (url == null || url === "") return undefined;
  let u = url.trim();
  if (/^\/+(https?:\/\/)/i.test(u)) u = u.replace(/^\/+/, "");
  u = u.endsWith("/") ? u.slice(0, -1) : u;
  try {
    const parsed = new URL(u);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return undefined;
    return u;
  } catch {
    return undefined;
  }
}

const MISSING_BASE = "MISSING_API_BASE_URL";

function createApiClient(): AxiosInstance {
  const client = axios.create({
    headers: { "Content-Type": "application/json" },
  });

  client.interceptors.request.use((config) => {
    const base = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL);
    if (!base) {
      return Promise.reject(
        new AxiosError(
          "[api-client] NEXT_PUBLIC_API_URL тохируулаагүй. admin/.env.local үзнэ үү.",
          MISSING_BASE,
          config,
        ),
      );
    }
    config.baseURL = base;
    const secret = process.env.ADMIN_SECRET;
    if (secret) config.headers.set("x-admin-secret", secret);
    return config;
  });

  return client;
}

/** Petti Shop API (Hono + D1) */
export const api = createApiClient();

/** @deprecated — нэг API ашиглана */
export const merchantClient = api;
/** @deprecated — нэг API ашиглана */
export const platformClient = api;
