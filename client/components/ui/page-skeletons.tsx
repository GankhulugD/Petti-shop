/** Зөөлөн skeleton — бага контраст, зөвхөн зураг/placeholder талбарт */
const sk = "rounded bg-[#ebebeb]/70";

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04]"
        >
          <div className="aspect-square bg-[#f0f0f0]" />
          <div className="space-y-2 p-3 sm:p-4">
            <div className={`h-2.5 w-1/4 ${sk}`} />
            <div className={`h-3.5 w-full ${sk}`} />
            <div className={`h-3.5 w-3/4 ${sk}`} />
            <div className={`h-3 w-1/3 ${sk}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ShopPageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-10 md:py-10">
      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        <aside className="hidden w-[17.5rem] shrink-0 md:block">
          <div className="h-80 rounded-2xl bg-[#f0f0f0]/80" />
        </aside>
        <div className="min-w-0 flex-1 space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Бүх бараа</h1>
            <div className={`h-3.5 w-24 ${sk}`} />
          </div>
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    </div>
  );
}

export function PageShellSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 md:px-10">
      <div className={`h-8 w-40 ${sk}`} />
      <div className="h-48 rounded-2xl bg-[#f0f0f0]/80" />
    </div>
  );
}
