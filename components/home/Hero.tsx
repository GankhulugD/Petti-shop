"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const heroImage =
  "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=900&q=80";

export function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#E4F0EC] via-[#F5EFE8] to-[#E8ECF5] p-6 shadow-[0_2px_24px_-8px_rgba(26,26,26,0.08)] sm:p-8 md:p-10 lg:p-12"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-12">
        <div className="max-w-xl flex-1 text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
            Шинэ ирэлт
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-[2.5rem] md:leading-tight">
            Тэжээвэр амьтандаа зориулсан шинэ коллекц
          </h1>
          <p className="mt-4 text-base leading-relaxed text-foreground/65 sm:text-lg">
            Нохой, муур, загас, шувуу болон жижиг амьтдад зориулсан чанартай хоол,
            элс, тоглоом, тэжээлэг хэрэгслийг нэг дороос сонгоорой.
          </p>
          <motion.div
            className="mt-8 flex justify-center lg:justify-start"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/shop"
              className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-sm font-semibold text-background shadow-sm transition-opacity hover:opacity-90"
            >
              Дэлгүүр орох
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="relative aspect-[4/3] w-full max-w-md flex-1 lg:max-w-lg"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative h-full min-h-[220px] overflow-hidden rounded-3xl bg-white/40 shadow-[0_8px_32px_-12px_rgba(26,26,26,0.15)] sm:min-h-[280px]">
            <Image
              src={heroImage}
              alt="Тэжээвэр амьтны хоол, усны сав"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
