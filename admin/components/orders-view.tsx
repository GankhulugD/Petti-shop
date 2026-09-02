"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { OrderDisplay } from "@/lib/fetch-orders";
import { patchOrderStatus } from "@/lib/patch-order";
import { PageShell } from "@/components/page-shell";
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

const STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

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

function OrderStatusSelect({
  order,
  className,
}: {
  order: OrderDisplay;
  className?: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [saving, setSaving] = useState(false);

  async function save(next: string) {
    setStatus(next);
    setSaving(true);
    const ok = await patchOrderStatus(order.id, { status: next });
    setSaving(false);
    if (ok) router.refresh();
  }

  return (
    <select
      value={status}
      disabled={saving}
      onChange={(e) => void save(e.target.value)}
      className={
        className ??
        "h-8 rounded-lg border border-neutral-200 bg-white px-2 text-sm"
      }
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

export function OrdersPageSkeleton() {
  return (
    <PageShell>
      <Skeleton className="h-[360px] w-full rounded-2xl" />
    </PageShell>
  );
}

function OrderCard({ order }: { order: OrderDisplay }) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-xs font-medium text-neutral-900">
            {order.orderNumber}
          </p>
          <p className="mt-1 truncate font-medium text-neutral-900">
            {order.fullName}
          </p>
          <p className="truncate text-xs text-neutral-500">{order.email}</p>
        </div>
        <p className="shrink-0 text-sm font-semibold tabular-nums text-neutral-900">
          {formatMnt(order.totalMnt)}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <OrderStatusSelect
          order={order}
          className="h-10 min-w-0 flex-1 rounded-lg border border-neutral-200 bg-white px-2 text-sm"
        />
        <Badge variant={statusVariant[order.status] ?? "outline"} className="text-[10px]">
          {order.paymentStatus}
        </Badge>
      </div>
    </article>
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
      <PageShell>
        <p className="text-sm text-red-600">Захиалга татахад алдаа гарлаа.</p>
      </PageShell>
    );
  }

  return (
    <PageShell className="flex flex-col gap-4">
      <p className="text-sm text-neutral-500">{orders.length} захиалга</p>

      <div className="flex flex-col gap-2 md:hidden">
        {orders.length === 0 ? (
          <p className="rounded-2xl border border-neutral-200/80 bg-white py-12 text-center text-neutral-500">
            Захиалга байхгүй
          </p>
        ) : (
          orders.map((o) => <OrderCard key={o.id} order={o} />)
        )}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm md:block">
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
                <TableCell className="font-medium font-mono text-xs">
                  {o.orderNumber}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{o.fullName}</span>
                    <span className="text-xs text-neutral-500">{o.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <OrderStatusSelect order={o} />
                    <Badge
                      variant={statusVariant[o.status] ?? "outline"}
                      className="w-fit text-[10px]"
                    >
                      {o.paymentStatus}
                    </Badge>
                  </div>
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
    </PageShell>
  );
}
