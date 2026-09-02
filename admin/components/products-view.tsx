"use client";

import Link from "next/link";

import type { ProductDisplay } from "@/lib/fetch-products";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function formatPriceMnt(n: number) {
  return `₮ ${new Intl.NumberFormat("mn-MN", { maximumFractionDigits: 0 }).format(n)}`;
}

function ProductThumb({ src, className }: { src: string; className?: string }) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-neutral-100 text-[10px] text-neutral-400 ${className ?? "size-11"}`}
      >
        —
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={44}
      height={44}
      className={`rounded-lg object-cover ${className ?? "size-11"}`}
    />
  );
}

export function ProductsPageSkeleton() {
  return (
    <PageShell>
      <Skeleton className="h-[420px] w-full rounded-2xl" />
    </PageShell>
  );
}

function ProductCard({ p }: { p: ProductDisplay }) {
  return (
    <Link
      href={`/products/${p.id}`}
      className="flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white p-3 shadow-sm"
    >
      <ProductThumb src={p.imageSrc} className="size-14 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-neutral-900">{p.name}</p>
        <p className="truncate text-xs text-neutral-500">
          {[p.brand, p.categoryName].filter(Boolean).join(" · ") || "—"}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold tabular-nums text-neutral-900">
            {formatPriceMnt(p.priceMnt)}
          </span>
          <span className="text-xs text-neutral-500">нөөц {p.stockTotal}</span>
          <Badge variant={p.status === "active" ? "default" : "outline"}>
            {p.status}
          </Badge>
        </div>
      </div>
    </Link>
  );
}

export function ProductsView({
  products,
  fetchError,
}: {
  products: ProductDisplay[];
  fetchError: null | "api";
}) {
  if (fetchError === "api" && products.length === 0) {
    return (
      <PageShell className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold text-red-800">API холбогдсонгүй</p>
        <p className="max-w-md text-center text-sm text-neutral-600">
          <code className="rounded bg-neutral-100 px-1">NEXT_PUBLIC_API_URL</code>{" "}
          болон <code className="rounded bg-neutral-100 px-1">npm run dev</code> (server)
          шалгана уу.
        </p>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/">Тойм руу</Link>
        </Button>
      </PageShell>
    );
  }

  return (
    <PageShell className="flex flex-col gap-4 md:gap-6">
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="rounded-full">
          {products.length}
        </Badge>
        <Button asChild className="ml-auto min-h-10 rounded-full px-4">
          <Link href="/products/new">Шинэ бараа</Link>
        </Button>
      </div>

      <div className="flex flex-col gap-2 md:hidden">
        {products.length === 0 ? (
          <p className="rounded-2xl border border-neutral-200/80 bg-white py-12 text-center text-neutral-500">
            Бүтээгдэхүүн байхгүй
          </p>
        ) : (
          products.map((p) => <ProductCard key={p.id} p={p} />)
        )}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14" />
              <TableHead>Нэр</TableHead>
              <TableHead className="hidden lg:table-cell">Ангилал</TableHead>
              <TableHead>Үнэ</TableHead>
              <TableHead>Нөөц</TableHead>
              <TableHead>Төлөв</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <ProductThumb src={p.imageSrc} />
                </TableCell>
                <TableCell>
                  <Link
                    href={`/products/${p.id}`}
                    className="font-medium hover:underline"
                  >
                    {p.name}
                  </Link>
                  {p.brand ? (
                    <span className="mt-0.5 block text-xs text-neutral-500">
                      {p.brand}
                    </span>
                  ) : null}
                </TableCell>
                <TableCell className="hidden text-neutral-600 lg:table-cell">
                  {p.categoryName ?? "—"}
                </TableCell>
                <TableCell className="tabular-nums">
                  {formatPriceMnt(p.priceMnt)}
                </TableCell>
                <TableCell className="tabular-nums">{p.stockTotal}</TableCell>
                <TableCell>
                  <Badge variant={p.status === "active" ? "default" : "outline"}>
                    {p.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-neutral-500">
                  Бүтээгдэхүүн байхгүй
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </PageShell>
  );
}
