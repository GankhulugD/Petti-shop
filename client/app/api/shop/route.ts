import { proxyUpstreamGet } from "@/lib/bff-proxy";

export async function GET() {
  return proxyUpstreamGet("/api/shop");
}
