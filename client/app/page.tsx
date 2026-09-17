import { CategoryList } from "@/components/home/CategoryList";
import { FlashSaleSection } from "@/components/home/FlashSaleSection";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/layout/TrustBar";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-8 md:gap-12 md:px-10 md:py-10">
      <Hero />
      <TrustBar />
      <CategoryList />
      <FlashSaleSection />
    </div>
  );
}
