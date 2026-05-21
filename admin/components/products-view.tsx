"use client";

import Link from "next/link";

import type { ProductDisplay } from "@/lib/fetch-products";
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

function ProductThumb({ src }: { src: string }) {
  if (!src) {
    return (
      <div className="flex size-11 items-center justify-center rounded-lg bg-neutral-100 text-[10px] text-neutral-400">
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
      className="size-11 rounded-lg object-cover"
    />
  );
}

export function ProductsPageSkeleton() {
  return (
    <div className="mx-auto max-w-[1200px] p-6 lg:p-8">
      <Skeleton className="h-[420px] w-full rounded-2xl" />
    </div>
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
      <div className="mx-auto flex min-h-[50vh] max-w-[1200px] flex-col items-center justify-center gap-4 p-6">
        <p className="text-lg font-semibold text-red-800">API холбогдсонгүй</p>
        <p className="max-w-md text-center text-sm text-neutral-600">
          <code className="rounded bg-neutral-100 px-1">NEXT_PUBLIC_API_URL</code>{" "}
          болон <code className="rounded bg-neutral-100 px-1">npm run dev</code> (server)
          шалгана уу.
        </p>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/">Тойм руу</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 p-6 lg:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Бүтээгдэхүүн
        </h1>
        <Badge variant="secondary" className="rounded-full">
          {products.length}
        </Badge>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14" />
              <TableHead>Нэр</TableHead>
              <TableHead className="hidden md:table-cell">Ангилал</TableHead>
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
                  <span className="font-medium">{p.name}</span>
                  {p.brand ? (
                    <span className="mt-0.5 block text-xs text-neutral-500">
                      {p.brand}
                    </span>
                  ) : null}
                </TableCell>
                <TableCell className="hidden text-neutral-600 md:table-cell">
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
    </div>
  );
}
