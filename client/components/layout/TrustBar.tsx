import { Package, ShieldCheck, Truck } from "lucide-react";

const items = [
  {
    icon: Truck,
    title: "Хурдан хүргэлт",
    desc: "Улаанбаатар 24–48 цаг",
  },
  {
    icon: ShieldCheck,
    title: "Чанарын баталгаа",
    desc: "Баталгаат бараа",
  },
  {
    icon: Package,
    title: "150,000₮+ үнэгүй",
    desc: "Хүргэлтийн нөхцөл",
  },
] as const;

export function TrustBar() {
  return (
    <section
      aria-label="Давуу тал"
      className="grid gap-3 sm:grid-cols-3"
    >
      {items.map(({ icon: Icon, title, desc }) => (
        <div
          key={title}
          className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-sm ring-1 ring-foreground/[0.04]"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F0EC] text-foreground">
            <Icon className="size-5" strokeWidth={1.5} />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
