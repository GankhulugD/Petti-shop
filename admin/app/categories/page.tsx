import { api, getAxiosPayload } from "@/lib/api-client";
import { extractArrayFromUnknown, getApiErrorFromBody } from "@/lib/normalize-api-response";
import { Badge } from "@/components/ui/badge";
import { PageShell } from "@/components/page-shell";

export const dynamic = "force-dynamic";

type Category = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
};

async function loadCategories(): Promise<{
  list: Category[];
  error: boolean;
}> {
  try {
    const res = await api.get<unknown>("/api/admin/categories");
    const raw = getAxiosPayload(res);
    if (getApiErrorFromBody(raw)) return { list: [], error: true };
    const list = extractArrayFromUnknown(raw);
    return {
      list: list
        .map((row) => {
          if (!row || typeof row !== "object") return null;
          const r = row as Record<string, unknown>;
          return {
            id: String(r.id ?? ""),
            name: String(r.name ?? ""),
            slug: String(r.slug ?? ""),
            sortOrder: Number(r.sortOrder ?? 0),
            isActive: Boolean(r.isActive ?? true),
          };
        })
        .filter((c): c is Category => !!c?.id),
      error: false,
    };
  } catch {
    return { list: [], error: true };
  }
}

export default async function CategoriesPage() {
  const { list, error } = await loadCategories();

  return (
    <PageShell>
      <p className="mb-4 text-sm text-neutral-500">{list.length} ангилал</p>
      {error ? (
        <p className="text-sm text-red-600">Ангилал татахад алдаа гарлаа.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {list.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-200/80 bg-white px-4 py-3 shadow-sm"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-neutral-900">{c.name}</p>
                <p className="truncate text-xs text-neutral-500">/{c.slug}</p>
              </div>
              <Badge variant={c.isActive ? "default" : "outline"} className="shrink-0">
                {c.isActive ? "Идэвхтэй" : "Унтраасан"}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
