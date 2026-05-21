import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartSheet } from "@/components/cart/CartSheet";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = (() => {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    try {
      return new URL(raw.endsWith("/") ? raw.slice(0, -1) : raw);
    } catch {
      /* fall through */
    }
  }
  return new URL("http://localhost:3000");
})();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Petti - Тэжээвэр амьтны онлайн дэлгүүр",
    template: "%s · Petti",
  },
  description:
    "Нохой, муур, загас, \u0428\u0443\u0432\u0443\u0443\u0443\u043d, жижиг амьтдад зориулсан онлайн дэлгүүр. Хоол, элс, тоглоом, тэжээлэг хэрэгсэл, хүргэлт.",
  keywords: [
    "Petti",
    "тэжээвэр амьтан",
    "онлайн дэлгүүр",
    "нохойн хоол",
    "муурны элс",
    "амьтны дэлгүүр Монгол",
    "амьтны хэрэгсэл",
    "амьтны тоглоом",
    "загасны хоол",
    "\u0428\u0443\u0432\u0443\u0443\u0443\u043d",
    "хүргэлт",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "mn_MN",
    siteName: "Petti",
    title: "Petti - Тэжээвэр амьтны онлайн дэлгүүр",
    description:
      "Тэжээвэр амьтдад зориулсан хоол, элс, тоглоом, хэрэгслийг нэг дороос.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="mn"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#F9F9F9] font-sans text-[#1A1A1A]">
        <Header />
        <main className="flex flex-1 flex-col pb-24 md:pb-10">{children}</main>
        <MobileBottomNav />
        <CartSheet />
      </body>
    </html>
  );
}
