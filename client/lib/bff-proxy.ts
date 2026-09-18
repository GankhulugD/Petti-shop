import { NextResponse } from "next/server";

import {
  getUpstreamApiUrl,
  UPSTREAM_REVALIDATE_SEC,
} from "@/lib/upstream-api";

export async function proxyUpstreamGet(
  pathWithQuery: string,
  options?: { revalidate?: number | false },
): Promise<NextResponse> {
  const upstream = getUpstreamApiUrl();
  const revalidate = options?.revalidate ?? UPSTREAM_REVALIDATE_SEC;

  try {
    const res = await fetch(`${upstream}${pathWithQuery}`, {
      ...(revalidate === false
        ? { cache: "no-store" as const }
        : { next: { revalidate } }),
    });
    const body = await res.text();
    if (!res.ok) {
      return new NextResponse(body || "Upstream error", { status: res.status });
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (revalidate !== false) {
      headers["Cache-Control"] =
        `public, s-maxage=${revalidate}, stale-while-revalidate=120`;
    }

    return new NextResponse(body, { status: 200, headers });
  } catch {
    return NextResponse.json(
      { error: "Серверт холбогдож чадсангүй" },
      { status: 502 },
    );
  }
}

export async function proxyUpstreamPost(
  path: string,
  body: string,
): Promise<NextResponse> {
  const upstream = getUpstreamApiUrl();

  try {
    const res = await fetch(`${upstream}${path}`, {
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
