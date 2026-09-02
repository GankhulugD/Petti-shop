import Link from "next/link";

type Props = {
  title: string;
  children: React.ReactNode;
};

export function LegalPage({ title, children }: Props) {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-10 md:px-10 md:py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Тусламж
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-foreground/80">
        {children}
      </div>
      <p className="mt-10 text-sm text-muted-foreground">
        Асуулт байвал{" "}
        <Link href="/contact" className="font-medium text-foreground underline-offset-4 hover:underline">
          холбоо барина уу
        </Link>
        .
      </p>
    </article>
  );
}
