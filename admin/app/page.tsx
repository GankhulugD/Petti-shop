import { Suspense } from "react";

import { DashboardView } from "@/components/dashboard-view";
import { PageShell } from "@/components/page-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchDashboard } from "@/lib/fetch-dashboard";

export const dynamic = "force-dynamic";

async function DashboardData() {
  const result = await fetchDashboard();
  return <DashboardView result={result} />;
}

function DashboardSkeleton() {
  return (
    <PageShell>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
    </PageShell>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardData />
    </Suspense>
  );
}
