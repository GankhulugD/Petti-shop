"use client";

import type { OrderDisplay } from "@/lib/fetch-orders";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function formatMnt(n: number) {
  return `₮ ${new Intl.NumberFormat("mn-MN", { maximumFractionDigits: 0 }).format(n)}`;
}

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  pending: "outline",
  confirmed: "default",
  processing: "secondary",
  shipped: "default",
  delivered: "default",
  cancelled: "outline",
};

export function OrdersPageSkeleton() {
  return (
    <div className="mx-auto max-w-[1200px] p-6 lg:p-8">
      <Skeleton className="h-[360px] w-full rounded-2xl" />
    </div>
  );
}

export function OrdersView({
  orders,
  fetchError,
}: {
  orders: OrderDisplay[];
  fetchError: null | "api";
}) {
  if (fetchError === "api" && orders.length === 0) {
    return (
      <div className="mx-auto max-w-[1200px] p-6 lg:p-8">
        <p className="text-sm text-red-600">Захиалга татахад алдаа гарлаа.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 p-6 lg:p-8">
      <p className="text-sm text-neutral-500">{orders.length} захиалга</p>
      <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дугаар</TableHead>
              <TableHead>Хэрэглэгч</TableHead>
              <TableHead>Төлөв</TableHead>
              <TableHead className="text-right">Дүн</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-medium">{o.orderNumber}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{o.fullName}</span>
                    <span className="text-xs text-neutral-500">{o.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[o.status] ?? "outline"}>
                    {o.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatMnt(o.totalMnt)}
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center text-neutral-500">
                  Захиалга байхгүй
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
