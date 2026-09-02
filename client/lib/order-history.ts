export const ORDER_HISTORY_KEY = "petti-order-history";

export function createOrderHistoryId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `ord-${Date.now()}`;
}

export type OrderHistoryEntry = {
  id: string;
  orderNumber?: string;
  at: string;
  total: number;
  subtotal: number;
  shipping: number;
  itemCount: number;
  preview: string;
};

export function appendOrderHistory(entry: OrderHistoryEntry): void {
  if (typeof window === "undefined") return;
  try {
    const raw = sessionStorage.getItem(ORDER_HISTORY_KEY);
    const list: OrderHistoryEntry[] = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) return;
    list.unshift(entry);
    sessionStorage.setItem(
      ORDER_HISTORY_KEY,
      JSON.stringify(list.slice(0, 25)),
    );
  } catch {
    /* ignore */
  }
}

export function readOrderHistory(): OrderHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(ORDER_HISTORY_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as unknown;
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}
