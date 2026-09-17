export default function AdminLoading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 animate-pulse md:px-6">
      <div className="h-8 w-40 rounded-lg bg-neutral-200" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-neutral-200/80" />
        ))}
      </div>
      <div className="h-72 rounded-2xl bg-neutral-200/60" />
    </div>
  );
}
