import Link from "next/link";

const shopLinks = [
  { href: "/shop", label: "Бүх бараа" },
  { href: "/shop?cat=food", label: "Хоол" },
  { href: "/shop?cat=litter", label: "Элс" },
  { href: "/shop?cat=toys", label: "Тоглоом" },
  { href: "/shop?cat=supplies", label: "Хэрэгсэл" },
] as const;

const helpLinks = [
  { href: "/about", label: "Бидний тухай" },
  { href: "/delivery", label: "Хүргэлт" },
  { href: "/returns", label: "Буцаалт" },
  { href: "/terms", label: "Үйлчилгээний нөхцөл" },
  { href: "/privacy", label: "Нууцлал" },
  { href: "/track", label: "Захиалга шалгах" },
  { href: "/contact", label: "Холбоо барих" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-foreground/[0.06] bg-white/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4 md:px-10">
        <div className="md:col-span-2">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Petti
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Тэжээвэр амьтны хоол, элс, тоглоом, хэрэгслийг нэг дороос. Чанартай
            бараа, найдвартай хүргэлт.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Утас:{" "}
            <a href="tel:+97677112233" className="font-medium text-foreground">
              +976 7711 2233
            </a>
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Дэлгүүр</h3>
          <ul className="mt-3 space-y-2">
            {shopLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Тусламж</h3>
          <ul className="mt-3 space-y-2">
            {helpLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-foreground/[0.04] py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Petti Shop. Бүх эрх хамгаалагдсан.
      </div>
    </footer>
  );
}
