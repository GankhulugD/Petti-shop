-- Petti Shop — цэвэр schema (нэг дэлгүүр, 5 хүснэгт)
PRAGMA foreign_keys = OFF;

DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `product_variants`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `customers`;
DROP TABLE IF EXISTS `product_images`;
DROP TABLE IF EXISTS `shops`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `categories` (
  `id` text PRIMARY KEY NOT NULL,
  `slug` text NOT NULL,
  `name` text NOT NULL,
  `sort_order` integer DEFAULT 0 NOT NULL,
  `is_active` integer DEFAULT 1 NOT NULL,
  `created_at` text DEFAULT (datetime('now')) NOT NULL
);

CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);
CREATE INDEX `categories_sort_idx` ON `categories` (`sort_order`);

CREATE TABLE `products` (
  `id` text PRIMARY KEY NOT NULL,
  `category_id` text,
  `slug` text NOT NULL,
  `sku` text,
  `name` text NOT NULL,
  `description` text,
  `brand` text,
  `price_mnt` integer NOT NULL,
  `compare_at_mnt` integer,
  `rating_tenths` integer DEFAULT 45 NOT NULL,
  `status` text DEFAULT 'active' NOT NULL,
  `badge` text,
  `target_animals` text DEFAULT '[]' NOT NULL,
  `images` text DEFAULT '[]' NOT NULL,
  `image_alt` text,
  `details` text DEFAULT '{}' NOT NULL,
  `created_at` text DEFAULT (datetime('now')) NOT NULL,
  `updated_at` text DEFAULT (datetime('now')) NOT NULL
);

CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);
CREATE UNIQUE INDEX `products_sku_unique` ON `products` (`sku`);
CREATE INDEX `products_category_idx` ON `products` (`category_id`);
CREATE INDEX `products_status_idx` ON `products` (`status`);

CREATE TABLE `product_variants` (
  `id` text PRIMARY KEY NOT NULL,
  `product_id` text NOT NULL,
  `label` text NOT NULL,
  `sku` text,
  `price_mnt` integer NOT NULL,
  `stock_qty` integer DEFAULT 0 NOT NULL,
  `is_default` integer DEFAULT 0 NOT NULL
);

CREATE UNIQUE INDEX `variants_product_label` ON `product_variants` (`product_id`, `label`);
CREATE INDEX `variants_product_idx` ON `product_variants` (`product_id`);

CREATE TABLE `orders` (
  `id` text PRIMARY KEY NOT NULL,
  `order_number` text NOT NULL,
  `customer_email` text NOT NULL,
  `customer_name` text NOT NULL,
  `customer_phone` text,
  `shipping_address` text NOT NULL,
  `subtotal_mnt` integer NOT NULL,
  `shipping_mnt` integer DEFAULT 0 NOT NULL,
  `total_mnt` integer NOT NULL,
  `status` text DEFAULT 'pending' NOT NULL,
  `payment_status` text DEFAULT 'unpaid' NOT NULL,
  `notes` text,
  `created_at` text DEFAULT (datetime('now')) NOT NULL,
  `updated_at` text DEFAULT (datetime('now')) NOT NULL
);

CREATE UNIQUE INDEX `orders_order_number_unique` ON `orders` (`order_number`);
CREATE INDEX `orders_status_idx` ON `orders` (`status`);
CREATE INDEX `orders_created_idx` ON `orders` (`created_at`);

CREATE TABLE `order_items` (
  `id` text PRIMARY KEY NOT NULL,
  `order_id` text NOT NULL,
  `product_id` text,
  `variant_id` text,
  `product_name` text NOT NULL,
  `variant_label` text,
  `image_url` text,
  `unit_price_mnt` integer NOT NULL,
  `quantity` integer NOT NULL,
  `line_total_mnt` integer NOT NULL
);

CREATE INDEX `order_items_order_idx` ON `order_items` (`order_id`);

PRAGMA foreign_keys = ON;
