import type { WorkerEnv } from "@/env";

const ABSOLUTE_URL = /^https?:\/\//i;

/** R2 key эсвэл бүтэн URL-ийг client-д өгөх public URL болгоно. */
export function resolveMediaUrl(
  value: string | null | undefined,
  apiBase: string,
): string {
  if (!value?.trim()) return "";
  const trimmed = value.trim();
  if (ABSOLUTE_URL.test(trimmed)) return trimmed;
  const key = trimmed.replace(/^\/+/, "");
  const base = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;
  return `${base}/api/media/${encodeURI(key)}`;
}

export function resolveMediaUrls(
  urls: string[] | null | undefined,
  apiBase: string,
): string[] {
  if (!Array.isArray(urls)) return [];
  return urls.map((u) => resolveMediaUrl(u, apiBase)).filter(Boolean);
}

export function getApiPublicBase(env: WorkerEnv, requestUrl: string): string {
  const fromEnv = env.MEDIA_PUBLIC_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return new URL(requestUrl).origin;
}

const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function extensionForMime(mime: string): string | null {
  return MIME_EXT[mime] ?? null;
}

export const ALLOWED_IMAGE_MIME = Object.keys(MIME_EXT);
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function sanitizeMediaKey(raw: string): string | null {
  const key = raw.replace(/^\/+/, "").trim();
  if (!key || key.includes("..") || key.includes("\\")) return null;
  if (!/^products\/[a-zA-Z0-9._-]+$/.test(key)) return null;
  return key;
}

export function withProductMedia<T extends { images?: string[]; imageSrc?: string }>(
  item: T,
  apiBase: string,
): T {
  const images = resolveMediaUrls(item.images, apiBase);
  const imageSrc = resolveMediaUrl(item.imageSrc || images[0] || "", apiBase);
  return {
    ...item,
    images: images.length ? images : imageSrc ? [imageSrc] : [],
    imageSrc,
  };
}
