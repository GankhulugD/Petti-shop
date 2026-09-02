import { fetchShopConfig } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata = { title: "Холбоо барих" };

export default async function ContactPage() {
  const store = await fetchShopConfig();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 md:px-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Холбоо барих</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Захиалга, хүргэлт, барааны зөвлөгөө — бид ажлын цагаар хариулна.
      </p>
      <dl className="mt-8 space-y-4 rounded-2xl bg-white p-6 text-sm shadow-sm ring-1 ring-foreground/[0.05]">
        <div>
          <dt className="text-muted-foreground">Утас</dt>
          <dd className="mt-1 font-medium">
            <a href={`tel:${store?.phone?.replace(/\s/g, "") ?? "+97677112233"}`}>
              {store?.phone ?? "+976 7711 2233"}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Имэйл</dt>
          <dd className="mt-1 font-medium">
            <a href={`mailto:${store?.email ?? "hello@petti.mn"}`}>
              {store?.email ?? "hello@petti.mn"}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Цагийн хуваарь</dt>
          <dd className="mt-1">{store?.hours ?? "Даваа–Баасан 10:00–19:00"}</dd>
        </div>
        {store?.bank ? (
          <div>
            <dt className="text-muted-foreground">Данс</dt>
            <dd className="mt-1">
              {store.bank.name} · {store.bank.account}
              <span className="mt-0.5 block text-muted-foreground">
                {store.bank.holder}
              </span>
            </dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}
