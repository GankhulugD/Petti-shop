import { CategoryList } from "@/components/home/CategoryList";
import { Hero } from "@/components/home/Hero";
import { ProductCard } from "@/components/products/ProductCard";
import { SHOP_PRODUCTS } from "@/lib/shop-products";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-8 md:gap-12 md:px-10 md:py-10">
      <Hero />
      <CategoryList />

      <section aria-labelledby="flash-sale-heading">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <h2
            id="flash-sale-heading"
            className="text-lg font-semibold tracking-tight text-foreground sm:text-xl"
          >
            Flash Sale
          </h2>
          <p className="text-sm text-foreground/50">
            Хоол, элс, хэрэгсэл — тэжээвэр амьтандаа өнөөдөр
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {SHOP_PRODUCTS.map((p) => (
            <ProductCard
              key={p.id}
              productId={p.id}
              name={p.name}
              price={p.priceLabel}
              rating={p.rating}
              imageSrc={p.imageSrc}
              imageAlt={p.imageAlt}
              href={`/product/${p.id}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
