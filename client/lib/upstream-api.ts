/** Server-side proxy to Workers API (BFF routes, RSC fetch). */
export function getUpstreamApiUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!raw) {
    throw new Error(
      "NEXT_PUBLIC_API_URL тохируулаагүй. Vercel env эсвэл client/.env.local шалгана уу.",
    );
  }
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

export const UPSTREAM_REVALIDATE_SEC = 60;
