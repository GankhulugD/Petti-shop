import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

/** Бүтээгдэхүүний нэмэлт тайлбар (амьтны дэлгүүрийн онцлог) */
export type ProductDetails = {
  ingredients?: string;
  usage?: string;
  shipping?: string;
};

export const categories = sqliteTable(
  "categories",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (t) => [index("categories_sort_idx").on(t.sortOrder)],
);

export const productStatuses = ["draft", "active", "archived"] as const;
export type ProductStatus = (typeof productStatuses)[number];

export const products = sqliteTable(
  "products",
  {
    id: text("id").primaryKey(),
    categoryId: text("category_id").references(() => categories.id),
    slug: text("slug").notNull().unique(),
    sku: text("sku").unique(),
    name: text("name").notNull(),
    description: text("description"),
    brand: text("brand"),
    /** Үндсэн үнэ (хамгийн бага variant-тай таарч болно) */
    priceMnt: integer("price_mnt").notNull(),
    compareAtMnt: integer("compare_at_mnt"),
    /** 45 = 4.5 од */
    ratingTenths: integer("rating_tenths").notNull().default(45),
    status: text("status").$type<ProductStatus>().notNull().default("active"),
    badge: text("badge"),
    targetAnimals: text("target_animals", { mode: "json" })
      .$type<string[]>()
      .notNull()
      .default([]),
    /** URL жагсаалт — эхний зураг нь үндсэн thumbnail */
    images: text("images", { mode: "json" }).$type<string[]>().notNull().default([]),
    imageAlt: text("image_alt"),
    details: text("details", { mode: "json" })
      .$type<ProductDetails>()
      .notNull()
      .default({}),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (t) => [
    index("products_category_idx").on(t.categoryId),
    index("products_status_idx").on(t.status),
  ],
);

export const productVariants = sqliteTable(
  "product_variants",
  {
    id: text("id").primaryKey(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id),
    label: text("label").notNull(),
    sku: text("sku"),
    priceMnt: integer("price_mnt").notNull(),
    stockQty: integer("stock_qty").notNull().default(0),
    isDefault: integer("is_default", { mode: "boolean" }).notNull().default(false),
  },
  (t) => [
    uniqueIndex("variants_product_label").on(t.productId, t.label),
    index("variants_product_idx").on(t.productId),
  ],
);

export const orderStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof orderStatuses)[number];

export const paymentStatuses = ["unpaid", "paid", "refunded"] as const;
export type PaymentStatus = (typeof paymentStatuses)[number];

export type ShippingAddress = {
  city?: string;
  district?: string;
  line1?: string;
  note?: string;
};

export const orders = sqliteTable(
  "orders",
  {
    id: text("id").primaryKey(),
    orderNumber: text("order_number").notNull().unique(),
    customerEmail: text("customer_email").notNull(),
    customerName: text("customer_name").notNull(),
    customerPhone: text("customer_phone"),
    shippingAddress: text("shipping_address", { mode: "json" })
      .$type<ShippingAddress>()
      .notNull(),
    subtotalMnt: integer("subtotal_mnt").notNull(),
    shippingMnt: integer("shipping_mnt").notNull().default(0),
    totalMnt: integer("total_mnt").notNull(),
    status: text("status").$type<OrderStatus>().notNull().default("pending"),
    paymentStatus: text("payment_status")
      .$type<PaymentStatus>()
      .notNull()
      .default("unpaid"),
    notes: text("notes"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (t) => [
    index("orders_status_idx").on(t.status),
    index("orders_created_idx").on(t.createdAt),
  ],
);

/** Захиалгын мөр — каталог устсан ч snapshot хадгална (FK байхгүй) */
export const orderItems = sqliteTable(
  "order_items",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id),
    productId: text("product_id"),
    variantId: text("variant_id"),
    productName: text("product_name").notNull(),
    variantLabel: text("variant_label"),
    imageUrl: text("image_url"),
    unitPriceMnt: integer("unit_price_mnt").notNull(),
    quantity: integer("quantity").notNull(),
    lineTotalMnt: integer("line_total_mnt").notNull(),
  },
  (t) => [index("order_items_order_idx").on(t.orderId)],
);
