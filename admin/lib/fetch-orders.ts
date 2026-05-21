import { api, getAxiosPayload } from "@/lib/api-client";
import {
  extractArrayFromUnknown,
  getApiErrorFromBody,
  unwrapAxiosData,
} from "@/lib/normalize-api-response";

export type OrderDisplay = {
  id: string;
  orderNumber: string;
  fullName: string;
  email: string;
  totalMnt: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  itemCount: number;
};

export type OrdersFetchResult = {
  list: OrderDisplay[];
  error: null | "api";
};

function normalizeOrder(raw: unknown): OrderDisplay | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = r.id != null ? String(r.id) : "";
  if (!id) return null;
  const items = Array.isArray(r.items) ? r.items : [];

  return {
    id,
    orderNumber: String(r.orderNumber ?? r.order_number ?? id),
    fullName: String(r.fullName ?? r.full_name ?? "—"),
    email: String(r.email ?? "—"),
    totalMnt: Number(r.totalMnt ?? r.total_mnt ?? 0),
    status: String(r.status ?? "pending"),
    paymentStatus: String(r.paymentStatus ?? r.payment_status ?? "unpaid"),
    createdAt: String(r.createdAt ?? r.created_at ?? ""),
    itemCount: items.length,
  };
}

export async function fetchOrders(): Promise<OrdersFetchResult> {
  try {
    const res = await api.get<unknown>("/api/admin/orders");
    const raw = getAxiosPayload(res);
    const apiErr = getApiErrorFromBody(raw);
    if (apiErr) return { list: [], error: "api" };

    const body = unwrapAxiosData(raw);
    const list = extractArrayFromUnknown(
      body && typeof body === "object" && "items" in (body as object)
        ? (body as { items: unknown }).items
        : body,
    );

    return {
      list: list
        .map(normalizeOrder)
        .filter((o): o is OrderDisplay => o !== null),
      error: null,
    };
  } catch {
    return { list: [], error: "api" };
  }
}
