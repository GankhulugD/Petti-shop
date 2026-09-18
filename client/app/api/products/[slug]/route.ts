import { proxyUpstreamGet } from "@/lib/bff-proxy";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  return proxyUpstreamGet(`/api/products/${encodeURIComponent(slug)}`);
}
