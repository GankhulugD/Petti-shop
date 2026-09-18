import { NextRequest } from "next/server";

import { proxyUpstreamGet } from "@/lib/bff-proxy";

export async function GET(req: NextRequest) {
  const qs = req.nextUrl.searchParams.toString();
  return proxyUpstreamGet(
    qs ? `/api/orders/lookup?${qs}` : "/api/orders/lookup",
    { revalidate: false },
  );
}
