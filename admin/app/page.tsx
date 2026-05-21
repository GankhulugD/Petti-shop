import { Suspense } from "react";

import { DashboardView } from "@/components/dashboard-view";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchDashboard } from "@/lib/fetch-dashboard";

export const dynamic = "force-dynamic";

async function DashboardData() {
  const result = await fetchDashboard();
  return <DashboardView result={result} />;
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-[1200px] p-6 lg:p-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardData />
    </Suspense>
  );
}
