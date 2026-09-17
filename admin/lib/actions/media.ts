"use server";

import { adminFetch } from "@/lib/server-api";

type UploadOk = { ok: true; key: string; url: string };
type UploadFail = { ok: false; message: string };

export async function uploadProductImage(
  formData: FormData,
): Promise<UploadOk | UploadFail> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Файл сонгоно уу." };
  }

  const res = await adminFetch("/api/admin/media", {
    method: "POST",
    body: formData,
  });

  const body = (await res.json().catch(() => null)) as
    | { key?: string; url?: string; error?: string }
    | null;

  if (!res.ok) {
    return {
      ok: false,
      message: body?.error ?? `Upload амжилтгүй (${res.status})`,
    };
  }

  if (!body?.url || !body.key) {
    return { ok: false, message: "Серверийн хариу буруу байна." };
  }

  return { ok: true, key: body.key, url: body.url };
}
