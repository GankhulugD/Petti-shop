import { NextRequest, NextResponse } from "next/server";

import { getUpstreamApiUrl } from "@/lib/upstream-api";

export async function POST(req: NextRequest) {
  const upstream = getUpstreamApiUrl();
  const body = await req.text();

  try {
    const res = await fetch(`${upstream}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      cache: "no-store",
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return NextResponse.json(
      { error: "Серверт холбогдож чадсангүй" },
      { status: 502 },
    );
  }
}
