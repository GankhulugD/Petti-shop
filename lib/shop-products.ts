import { productPetGallery } from "@/lib/unsplash-pet-urls";

export type AnimalKind = "dog" | "cat" | "fish" | "bird" | "small";

export const SHOP_CATEGORIES = ["food", "litter", "toys", "supplies"] as const;
export type ShopCategory = (typeof SHOP_CATEGORIES)[number];

export type ShopProduct = {
  id: string;
  name: string;
  priceMnt: number;
  priceLabel: string;
  rating: number;
  imageSrc: string;
  imageAlt: string;
  images: string[];
  brand: string;
  animals: AnimalKind[];
  shopCategory: ShopCategory;
  badge?: "best" | "new";
  sizeOptions: { label: string; priceLabel: string }[];
  ingredients: string;
  usage: string;
  shipping: string;
};

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: "orijen-adult-dog-11kg",
    name: "Orijen Adult нохойн хоол 11.4 кг",
    priceMnt: 485_000,
    priceLabel: "₮ 485.000",
    rating: 4.5,
    ...productPetGallery("orijen-adult-dog-11kg"),
    imageAlt: "Нохойн чийглэг хоолны уут",
    brand: "Orijen",
    animals: ["dog"],
    shopCategory: "food",
    badge: "best",
    sizeOptions: [
      { label: "1 кг", priceLabel: "₮ 52.000" },
      { label: "5 кг", priceLabel: "₮ 245.000" },
      { label: "11.4 кг", priceLabel: "₮ 485.000" },
    ],
    ingredients:
      "Шинэ мах, шувуу, загас — хөлдөөгүйгээр хүргэгддэг орц найрлага. Нэмэлт үр тариа, будаа агуулаагүй. Омега тос, витамин, эрдэс бодисоор баяжуулсан.",
    usage:
      "Өдөрт 2–3 удаа, нас жингийн хүснэгтээр хэмжээг тохируулна. Ус хангалттай байлгаарай. Шилжүүлэхдээ 7 хоногийн дотор аажмаар холино.",
    shipping:
      "Улаанбаатар хотод 24–48 цагт хүргэнэ. 150,000₮-с дээш үнэгүй хүргэлт. Хөдөө орон нутагт шуудангаар 2–5 ажлын өдөр.",
  },
  {
    id: "ever-clean-litter-10l",
    name: "Ever Clean муурны элс 10L",
    priceMnt: 62_000,
    priceLabel: "₮ 62.000",
    rating: 4.5,
    ...productPetGallery("ever-clean-litter-10l"),
    imageAlt: "Муурны чийггүй элсний сав",
    brand: "Ever Clean",
    animals: ["cat"],
    shopCategory: "litter",
    badge: "new",
    sizeOptions: [
      { label: "4 L", priceLabel: "₮ 28.000" },
      { label: "8 L", priceLabel: "₮ 48.000" },
      { label: "10 L", priceLabel: "₮ 62.000" },
    ],
    ingredients:
      "Бентонит шавар, хүчиллэг үнэр дарагч нэгдлүүд. Хүүхэд болон мууранд аюулгүй түвшинд агуулагддаг.",
    usage:
      "Өргөн тогтоогуурт 5–7 см зузаан элс цацаж, өдөр бүр хагас өдөрт нэг удаа шавхуурыг авна. Сар бүр бүтэн солино.",
    shipping:
      "Хүнд савлагаатай тул зөвхөн хотын хүргэлт эсвэл салбараас авах боломжтой. 100,000₮-с дээш үнэгүй хүргэлт.",
  },
  {
    id: "tetramin-fish-food-1l",
    name: "TetraMin загасны хоол 1L",
    priceMnt: 28_500,
    priceLabel: "₮ 28.500",
    rating: 4.5,
    ...productPetGallery("tetramin-fish-food-1l"),
    imageAlt: "Аквариумын загасны хоол",
    brand: "Tetra",
    animals: ["fish"],
    shopCategory: "food",
    badge: "best",
    sizeOptions: [
      { label: "250 мл", priceLabel: "₮ 9.500" },
      { label: "500 мл", priceLabel: "₮ 16.000" },
      { label: "1 L", priceLabel: "₮ 28.500" },
    ],
    ingredients:
      "Загасны гурил, ургамлын тос, спирулина, витамин нэгдэл. Өнгө оруулагч агуулагдахгүй.",
    usage:
      "Өдөрт 2–3 удаа, 2–3 минутад дуусах хэмжээгээр өгнө. Илүүдэл хоолыг соруулна.",
    shipping:
      "Бүх бүсэд эвхмэл савлагаагаар илгээнэ. Хагас задгай хоол хүнсний бараатай хамт захиалбанд оруулбал зохино.",
  },
  {
    id: "vitakraft-bird-treat-800g",
    name: "Vitakraft шувуун амттан 800г",
    priceMnt: 34_000,
    priceLabel: "₮ 34.000",
    rating: 4.5,
    ...productPetGallery("vitakraft-bird-treat-800g"),
    imageAlt: "Шувуунд зориулсан амттан",
    brand: "Vitakraft",
    animals: ["bird"],
    shopCategory: "food",
    sizeOptions: [
      { label: "200 г", priceLabel: "₮ 10.500" },
      { label: "400 г", priceLabel: "₮ 19.000" },
      { label: "800 г", priceLabel: "₮ 34.000" },
    ],
    ingredients:
      "Тарианы үр, жимс, чийглэг ногоо, байгалийн амт оруулагч. Өндөгний хальсны хүчиллэг агууламж багатай.",
    usage:
      "Үндсэн хоолны 10%-иас илүүгүйгээр өдөрт 1–2 удаа өгнө. Шинэ амттан эхлүүлэхдээ аажмаар нэмнэ.",
    shipping:
      "Жижиг савлагаа — стандарт хүргэлт. Халуун өдөр хадгалах зааврыг дагана уу.",
  },
  {
    id: "auto-water-bowl-2-5l",
    name: "Автомат усны сав 2.5л",
    priceMnt: 89_000,
    priceLabel: "₮ 89.000",
    rating: 4.5,
    ...productPetGallery("auto-water-bowl-2-5l"),
    imageAlt: "Тэжээвэр амьтны усны сав",
    brand: "Petkit",
    animals: ["dog", "cat"],
    shopCategory: "supplies",
    badge: "new",
    sizeOptions: [
      { label: "1.5 л", priceLabel: "₮ 59.000" },
      { label: "2.5 л", priceLabel: "₮ 89.000" },
      { label: "4 л", priceLabel: "₮ 129.000" },
    ],
    ingredients:
      "Хүнсний зэрэглэлийн зэсэрхэг ган, BPA-free хуванцар сав. Усны шүүлтийн нэмэлт хавтан (зарим загвард).",
    usage:
      "7 хоногт нэг удаа усаа сольж, савыг угаана. Цахилгаан загвар бол адаптерыг хуурай газар холбоно.",
    shipping:
      "Эвдрэхээс хамгаалсан савлагаа. 200,000₮-с дээш үнэгүй хүргэлт.",
  },
  {
    id: "plush-bottle-toy",
    name: "Plush тоглоом (лонх хэлбэртэй)",
    priceMnt: 24_900,
    priceLabel: "₮ 24.900",
    rating: 4.5,
    ...productPetGallery("plush-bottle-toy"),
    imageAlt: "Нохойн зөөлөн тоглоом",
    brand: "KONG",
    animals: ["dog"],
    shopCategory: "toys",
    sizeOptions: [
      { label: "Жижиг", priceLabel: "₮ 19.900" },
      { label: "Дунд", priceLabel: "₮ 24.900" },
      { label: "Том", priceLabel: "₮ 32.000" },
    ],
    ingredients:
      "Полиэстер даавуу, доторлогоо синтетик хөвөн. Хоолны орц агуулаагүй.",
    usage:
      "Тоглоомыг сар бүр шалгаж, уяа элэгдсэн эсэхийг харна. Угаахдаа 30°C хүртэл угаалгын машинд зөвхөн торхонд.",
    shipping:
      "Жижиг бараа — стандарт илгээлт. Хүлээн авахдаа үнэр, гадар шалгана уу.",
  },
  {
    id: "cat-scratching-post-72",
    name: "Муурны самарын мод (72см)",
    priceMnt: 179_000,
    priceLabel: "₮ 179.000",
    rating: 4.5,
    ...productPetGallery("cat-scratching-post-72"),
    imageAlt: "Муурны самар цавчих мод",
    brand: "Petfun",
    animals: ["cat"],
    shopCategory: "toys",
    badge: "best",
    sizeOptions: [
      { label: "45 см", priceLabel: "₮ 119.000" },
      { label: "60 см", priceLabel: "₮ 149.000" },
      { label: "72 см", priceLabel: "₮ 179.000" },
    ],
    ingredients:
      "Хатуу модон суурь, сизалийн утас, плюш тавцан. Химийн наалт багатай.",
    usage:
      "Тогтвортой газар байрлуулна. Сар бүр самарын хэсгийг тоос шороогоор цэвэрлэнэ.",
    shipping:
      "Том овортой — тусгай хүргэлт. Салбараас авах бол урьдчилан захиалга өгнө үү.",
  },
  {
    id: "kaytee-small-animal-bedding",
    name: "Kaytee жижиг амьтны элс 2.5кг",
    priceMnt: 42_000,
    priceLabel: "₮ 42.000",
    rating: 4.5,
    ...productPetGallery("kaytee-small-animal-bedding"),
    imageAlt: "Дэгдээхэй, хомякны элс",
    brand: "Kaytee",
    animals: ["small"],
    shopCategory: "litter",
    sizeOptions: [
      { label: "1 кг", priceLabel: "₮ 19.000" },
      { label: "2.5 кг", priceLabel: "₮ 42.000" },
      { label: "5 кг", priceLabel: "₮ 78.000" },
    ],
    ingredients:
      "Байгалийн модны үртэн, тоосжилт багатай. Хүчиллэг үнэр оруулагчгүй.",
    usage:
      "Өргөн 3–5 см дэвсгэр хийж, 7 хоногт 1–2 удаа бохир хэсгийг сольно. Хомяк, дэгдээхэйнд тохирно.",
    shipping:
      "Хөнгөн ууттай — бүх бүсэд илгээнэ. Чийгнээс хол хадгална.",
  },
];

export function getShopProduct(id: string): ShopProduct | undefined {
  return SHOP_PRODUCTS.find((p) => p.id === id);
}

export function getShopProductsByIds(ids: string[]): ShopProduct[] {
  const map = new Map(SHOP_PRODUCTS.map((p) => [p.id, p]));
  return ids.map((id) => map.get(id)).filter((p): p is ShopProduct => !!p);
}

export function formatMnt(n: number): string {
  return `₮ ${n.toLocaleString("mn-MN")}`;
}
