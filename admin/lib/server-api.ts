import "server-only";

export function getApiBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!raw) {
    throw new Error(
      "NEXT_PUBLIC_API_URL тохируулаагүй. admin/.env.local эсвэл Vercel env шалгана уу.",
    );
  }
  let url = raw;
  if (/^\/+(https?:\/\/)/i.test(url)) url = url.replace(/^\/+/, "");
  url = url.endsWith("/") ? url.slice(0, -1) : url;
  return url;
}

export function getAdminSecret(): string {
  const secret = process.env.ADMIN_SECRET?.trim();
  if (!secret) {
    throw new Error(
      "ADMIN_SECRET тохируулаагүй. admin/.env.local эсвэл Vercel env шалгана уу.",
    );
  }
  return secret;
}

export async function adminFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const headers = new Headers(init?.headers);
  const isFormData = typeof FormData !== "undefined" && init?.body instanceof FormData;
  if (!isFormData && !headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }
  headers.set("x-admin-secret", getAdminSecret());

  const res = await fetch(`${getApiBase()}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  return res;
}
