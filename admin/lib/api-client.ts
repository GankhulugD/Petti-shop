import "server-only";

import axios, { AxiosError, type AxiosInstance } from "axios";

import { getAdminSecret, getApiBase } from "@/lib/server-api";

export function getAxiosPayload(res: { data?: unknown }): unknown {
  const d = res.data;
  if (d !== undefined && d !== null) return d;
  return res;
}

const MISSING_BASE = "MISSING_API_BASE_URL";

function createApiClient(): AxiosInstance {
  const client = axios.create({
    headers: { "Content-Type": "application/json" },
  });

  client.interceptors.request.use((config) => {
    try {
      config.baseURL = getApiBase();
      config.headers.set("x-admin-secret", getAdminSecret());
    } catch (err) {
      const message = err instanceof Error ? err.message : "API config error";
      return Promise.reject(
        new AxiosError(message, MISSING_BASE, config),
      );
    }
    return config;
  });

  return client;
}

/** Server-only Petti Shop API client (RSC, route handlers). Client UI → `@/lib/actions/*`. */
export const api = createApiClient();

/** @deprecated — нэг API ашиглана */
export const merchantClient = api;
/** @deprecated — нэг API ашиглана */
export const platformClient = api;
