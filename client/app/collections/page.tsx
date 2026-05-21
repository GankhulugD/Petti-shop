"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const collections = [
  {
    title: "Муурны онцгой багц",
    description: "Элс, хоол, тоглоом — муурандаа зориулсан сонголт",
    href: "/shop?animals=cat",
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=85",
    accent: "from-violet-100/90 to-fuchsia-50/80",
  },
  {
    title: "Нохойн тэжээллэг багц",
    description: "Чийглэг хоол, тоглоом, хэрэгсэл",
    href: "/shop?animals=dog",
    image:
      "https://images.unsplash.com/photo-1587300004688-8b8a2a0d2773?auto=format&fit=crop&w=1200&q=85",
    accent: "from-amber-100/90 to-orange-50/80",
  },
  {
    title:
      "\u0428\u0443\u0432\u0443\u0443\u0443\u043d\u044b \u0442\u0430\u043d\u0441\u0430\u0433 \u0445\u044d\u0440\u044d\u0433\u043b\u044d\u044d",
    description: "Амттан, тэжээл, ариун цэврийн бүтээгдэхүүн",
    href: "/shop?animals=bird",
    image:
      "https://images.unsplash.com/photo-1452570053594-1cc985ce7734?auto=format&fit=crop&w=1200&q=85",
    accent: "from-sky-100/90 to-cyan-50/80",
  },
  {
    title: "Загас & аквариум",
    description: "Хоол, усны чанар, декор",
    href: "/shop?animals=fish",
    image:
      "https://images.unsplash.com/photo-1522068559765-35c9f5d7-877?auto=format&fit=crop&w=1200&q=85",
    accent: "from-emerald-100/90 to-teal-50/80",
  },
] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const imgHover = {
  rest: { scale: 1 },
  hover: {
    scale: 1.06,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const articleHover = {
  rest: { y: 0 },
  hover: {
    y: -3,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function CollectionsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-10 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10 text-center md:mb-12 md:text-left"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/45">
          Petti
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Цуглуулга
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:mx-0">
          Амьтны төрлөөр сонгосон бэлэн багцууд — дэлгүүрт шууд шүүлттэй
          холбогдоно.
        </p>
      </motion.div>

      <motion.ul
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {collections.map((c) => (
          <motion.li key={c.href} variants={item} className="list-none">
            <Link href={c.href} className="group block">
              <motion.article
                className={`overflow-hidden rounded-3xl bg-gradient-to-br ${c.accent} p-1 shadow-[0_2px_24px_-8px_rgba(26,26,26,0.08)] ring-1 ring-foreground/[0.06] transition-shadow hover:shadow-[0_12px_40px_-12px_rgba(26,26,26,0.12)]`}
                initial="rest"
                whileHover="hover"
                animate="rest"
                variants={articleHover}
              >
                <div className="overflow-hidden rounded-[1.35rem] bg-white/50">
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <motion.div
                      className="absolute inset-0"
                      variants={imgHover}
                    >
                      <Image
                        src={c.image}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </motion.div>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/55 via-transparent to-transparent" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 md:p-6">
                      <h2 className="text-xl font-semibold tracking-tight text-white drop-shadow-sm md:text-2xl">
                        {c.title}
                      </h2>
                      <p className="mt-1 max-w-md text-sm leading-relaxed text-white/90">
                        {c.description}
                      </p>
                      <span className="mt-3 inline-flex items-center text-xs font-semibold uppercase tracking-wider text-white/95">
                        Дэлгүүр харах →
                      </span>
                    </div>
                  </div>
                </div>
              </motion.article>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
