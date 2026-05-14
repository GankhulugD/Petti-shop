"use client";

import { motion } from "framer-motion";
import { Clock, Heart, Sparkles, Truck, Utensils } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const values = [
  {
    title: "Амьтанд хайртай",
    text: "Тэжээвэр амьтны эрүүл мэнд, тав тухыг төвд оршуулсан бүтээгдэхүүн сонгоно.",
    icon: Heart,
  },
  {
    title: "Чанартай хоол",
    text: "Баталгаат брэнд, шударга орц найрлага — таны амьтанд зөвхөн шилдэгийг.",
    icon: Utensils,
  },
  {
    title: "Хурдан хүргэлт",
    text: "Улаанбаатар болон орон нутагт найдвартай, цаг тухайд хүргэлтийн сүлжээ.",
    icon: Truck,
  },
] as const;

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden bg-[#F9F9F9]">
      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-violet-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-20 h-64 w-64 rounded-full bg-amber-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-4 py-14 md:px-10 md:py-20">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-14 text-center md:mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/45">
            Бидний тухай
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Petti
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Flat 2.0 minimal — цэвэрхэн, ойлгомжтой дэлгүүрний туршлага
          </p>
        </motion.header>

        <section className="space-y-10" aria-labelledby="history-heading">
          <h2
            id="history-heading"
            className="text-center text-lg font-semibold text-foreground md:text-left"
          >
            Petti-ийн түүх
          </h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="rounded-2xl bg-white/80 px-6 py-5 text-center text-base leading-relaxed text-foreground/80 shadow-sm ring-1 ring-foreground/[0.06] backdrop-blur-sm md:text-left"
          >
            Petti 2020-оодын эхэнд үүсэж, нохой, муур, загас,{" "}
            {"\u0428\u0443\u0432\u0443\u0443\u0443\u043d"} болон жижиг
            амьтдад зориулсан хоол, элс, тоглоом, тэжээлэг хэрэгслийг нэг
            платформоос худалдан авах боломжийг бүрдүүлэхийг зорьсон. Бид
            үйлчлүүлэгчдээ хэтэрхий шуугиантай дэлгүүр биш, тайван, итгэлтэй
            сонголт хийх орчинд урьж байна.
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="rounded-2xl bg-white/80 px-6 py-5 text-center text-base leading-relaxed text-foreground/80 shadow-sm ring-1 ring-foreground/[0.06] backdrop-blur-sm md:text-left"
          >
            Өнөөдөр бид олон улсын болон дотоодын шилдэг брэндүүдтэй
            хамтран ажиллаж, чанарын шалгуур өндөртэй барааг шүүж танд
            хүргэдэг. Цахим дэлгүүрээсээ гадна манай баг хүргэлт, бараа
            буцаалт, зөвлөгөөний үйлчилгээг таньд санал болгодог.
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-violet-300/60 bg-violet-50/50 px-6 py-4 text-center text-sm text-foreground/75 md:justify-start"
          >
            <Clock className="size-4 shrink-0 text-violet-600/80" />
            <span>
              Ирээдүйд: илүү олон төрлийн амьтан, ногоон савлагаа, дахин
              боловсруулалттай багцууд нэмэгдэнэ.
            </span>
          </motion.p>
        </section>

        <section
          className="mt-16 md:mt-20"
          aria-labelledby="values-heading"
        >
          <motion.h2
            id="values-heading"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 text-center text-lg font-semibold text-foreground md:text-left"
          >
            Бидний үнэт зүйлс
          </motion.h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {values.map(({ title, text, icon: Icon }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.45,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1] as const,
                }}
                className="rounded-2xl bg-white/90 p-6 shadow-sm ring-1 ring-foreground/[0.06] backdrop-blur-sm"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-rose-100/80 to-amber-50/80 p-3 text-foreground">
                  <Icon className="size-6" strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {text}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 flex justify-center md:mt-20 md:justify-start"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm ring-1 ring-foreground/[0.06]">
            <Sparkles className="size-3.5 text-amber-500/90" />
            Petti — таны амьтны тав тух
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
