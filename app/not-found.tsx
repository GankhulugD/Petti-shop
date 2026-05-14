import Link from "next/link";
import { FileQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="max-w-sm rounded-3xl bg-white/90 px-8 py-12 text-center shadow-sm ring-1 ring-[#1A1A1A]/[0.06]">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-[#1A1A1A]/[0.04] text-[#1A1A1A]/70">
          <FileQuestion className="size-7" strokeWidth={1.5} aria-hidden />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1A1A1A]/45">
          404
        </p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-[#1A1A1A]">
          Хуудас олдсонгүй
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#1A1A1A]/55">
          Хайж буй хуудас байхгүй эсвэл шилжсэн байж магадгүй.
        </p>
        <Button
          asChild
          className="mt-8 w-full rounded-full bg-[#1A1A1A] text-[#F9F9F9] hover:bg-[#1A1A1A]/90"
        >
          <Link href="/">Нүүр хуудас руу буцах</Link>
        </Button>
      </div>
    </div>
  );
}
