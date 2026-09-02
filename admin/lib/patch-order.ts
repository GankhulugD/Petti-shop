import { api } from "@/lib/api-client";

export async function patchOrderStatus(
  orderId: string,
  patch: { status?: string; paymentStatus?: string },
): Promise<boolean> {
  try {
    await api.patch(`/api/admin/orders/${orderId}`, patch);
    return true;
  } catch {
    return false;
  }
}
