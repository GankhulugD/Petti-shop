import { Suspense } from "react";

import { OrdersPageSkeleton, OrdersView } from "@/components/orders-view";
import { fetchOrders } from "@/lib/fetch-orders";

export const dynamic = "force-dynamic";

async function OrdersContent() {
  const { list, error } = await fetchOrders();
  return <OrdersView orders={list} fetchError={error} />;
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<OrdersPageSkeleton />}>
      <OrdersContent />
    </Suspense>
  );
}
