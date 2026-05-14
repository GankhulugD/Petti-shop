import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** Сагс тусдаа URL байхгүй: /cart → дэлгүүр + сагсны sheet нээгдэнэ. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/cart" || pathname === "/cart/") {
    const url = request.nextUrl.clone();
    url.pathname = "/shop";
    url.search = "";
    url.searchParams.set("openCart", "1");
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/cart", "/cart/"],
};
