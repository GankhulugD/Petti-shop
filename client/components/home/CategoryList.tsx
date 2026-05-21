"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bone, BrushCleaning, Layers, ToyBrick } from "lucide-react";

const categories = [
  { id: "food", label: "Хоол", href: "/shop?cat=food", icon: Bone },
  { id: "litter", label: "Элс", href: "/shop?cat=litter", icon: Layers },
  { id: "toys", label: "Тоглоом", href: "/shop?cat=toys", icon: ToyBrick },
  {
    id: "supplies",
    label: "Хэрэгсэл",
    href: "/shop?cat=supplies",
    icon: BrushCleaning,
  },
] as const;

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export function CategoryList() {
  return (
    <section className="w-full" aria-labelledby="category-heading">
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2
          id="category-heading"
          className="text-lg font-semibold tracking-tight text-foreground sm:text-xl"
        >
          Ангилал
        </h2>
        <Link
          href="/shop"
          className="shrink-0 text-sm font-medium text-foreground/55 underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          Бүгдийг харах
        </Link>
      </div>

      <motion.ul
        variants={listVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-1 sm:gap-4"
      >
        {categories.map(({ id, label, href, icon: Icon }) => (
          <motion.li key={id} variants={itemVariants} className="shrink-0">
            <Link
              href={href}
              className="group flex w-[4.75rem] flex-col items-center gap-2 sm:w-[5.5rem]"
            >
              <motion.span
                className="flex size-16 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-foreground/[0.06] transition-shadow group-hover:shadow-[0_4px_20px_-6px_rgba(26,26,26,0.12)] sm:size-[4.75rem]"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
              >
                <Icon
                  className="size-7 text-foreground/80 sm:size-8"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </motion.span>
              <span className="text-center text-xs font-medium text-foreground/70 sm:text-sm">
                {label}
              </span>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
