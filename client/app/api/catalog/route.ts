import { NextRequest, NextResponse } from "next/server";

import {
  getUpstreamApiUrl,
  UPSTREAM_REVALIDATE_SEC,
} from "@/lib/upstream-api";

export async function GET(req: NextRequest) {
  const upstream = getUpstreamApiUrl();
  const qs = req.nextUrl.searchParams.toString();
  const url = `${upstream}/api/products${qs ? `?${qs}` : ""}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: UPSTREAM_REVALIDATE_SEC },
    });
    const body = await res.text();
    if (!res.ok) {
      return new NextResponse(body || "Upstream error", { status: res.status });
    }
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, s-maxage=${UPSTREAM_REVALIDATE_SEC}, stale-while-revalidate=120`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Каталог татахад алдаа гарлаа" },
      { status: 502 },
    );
  }
}
