import { NextRequest } from "next/server";

import { proxyUpstreamPost } from "@/lib/bff-proxy";

export async function POST(req: NextRequest) {
  const body = await req.text();
  return proxyUpstreamPost("/api/orders", body);
}
