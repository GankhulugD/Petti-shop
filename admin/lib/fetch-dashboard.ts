import { api, getAxiosPayload } from "@/lib/api-client";
import { getApiErrorFromBody, unwrapAxiosData } from "@/lib/normalize-api-response";

export type DashboardStats = {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  revenueMnt: number;
};

export type DashboardFetchResult = {
  stats: DashboardStats | null;
  error: null | "api" | "no_data";
};

function parseStats(body: unknown): DashboardStats | null {
  const o = unwrapAxiosData(body);
  if (!o || typeof o !== "object" || Array.isArray(o)) return null;
  const r = o as Record<string, unknown>;
  return {
    totalProducts: Number(r.totalProducts ?? 0),
    activeProducts: Number(r.activeProducts ?? 0),
    totalOrders: Number(r.totalOrders ?? 0),
    pendingOrders: Number(r.pendingOrders ?? 0),
    revenueMnt: Number(r.revenueMnt ?? 0),
  };
}

export async function fetchDashboard(): Promise<DashboardFetchResult> {
  try {
    const res = await api.get<unknown>("/api/admin/dashboard");
    const raw = getAxiosPayload(res);
    const apiErr = getApiErrorFromBody(raw);
    if (apiErr) return { stats: null, error: "api" };
    const stats = parseStats(raw);
    if (!stats) return { stats: null, error: "no_data" };
    return { stats, error: null };
  } catch {
    return { stats: null, error: "api" };
  }
}
