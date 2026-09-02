"use client";

import type { DashboardFetchResult } from "@/lib/fetch-dashboard";
import { PageShell } from "@/components/page-shell";

function formatMnt(n: number) {
  return `₮ ${new Intl.NumberFormat("mn-MN", { maximumFractionDigits: 0 }).format(n)}`;
}

function StatCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="h-full rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm sm:p-6">
      <p className="text-sm font-medium text-neutral-500">{title}</p>
      <p className="mt-2 break-words text-xl font-semibold tracking-tight text-neutral-900 tabular-nums sm:text-3xl">
        {value}
      </p>
      {hint ? (
        <p className="mt-2 text-xs text-neutral-500">{hint}</p>
      ) : null}
    </div>
  );
}

export function DashboardView({ result }: { result: DashboardFetchResult }) {
  const ok = result.error === null && result.stats;
  const s = result.stats;

  if (result.error === "api") {
    return (
      <PageShell>
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
        >
          API холбогдсонгүй. <code className="text-xs">server</code> ажиллуулж,{" "}
          <code className="text-xs">admin/.env.local</code> тохируулна уу.
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell className="flex flex-col gap-4 md:gap-6">
      <div className="hidden md:block">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
          Petti Admin
        </p>
        <h2 className="mt-1 text-lg font-semibold text-neutral-900">
          Дэлгүүрийн тойм
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          title="Бүтээгдэхүүн"
          value={ok ? String(s!.totalProducts) : "—"}
          hint={ok ? `${s!.activeProducts} идэвхтэй` : undefined}
        />
        <StatCard
          title="Захиалга"
          value={ok ? String(s!.totalOrders) : "—"}
          hint={ok ? `${s!.pendingOrders} хүлээгдэж буй` : undefined}
        />
        <div className="col-span-2 xl:col-span-1">
          <StatCard
            title="Орлого (нийт)"
            value={ok ? formatMnt(s!.revenueMnt) : "—"}
          />
        </div>
        <div className="col-span-2 xl:col-span-1">
          <StatCard title="Дэлгүүр" value="Petti Shop" hint="petti-shop" />
        </div>
      </div>
    </PageShell>
  );
}
