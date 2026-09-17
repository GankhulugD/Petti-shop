"use server";

import { adminFetch } from "@/lib/server-api";

export async function patchOrderStatus(
  orderId: string,
  patch: { status?: string; paymentStatus?: string },
): Promise<boolean> {
  try {
    const res = await adminFetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    return res.ok;
  } catch {
    return false;
  }
}
