# Petti Shop — Database schema

## ER diagram (логик)

```
categories ──< products ──< product_variants
                  │
orders ──< order_items  (snapshot, catalog FK байхгүй)
```

## Хүснэгтүүд

### `categories`
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | `cat-food` |
| slug | TEXT UNIQUE | `food`, `litter`, … |
| name | TEXT | Харагдах нэр |
| sort_order | INT | Эрэмбэ |
| is_active | BOOL | 1/0 |

### `products`
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | slug-тай ижил боломжтой |
| category_id | TEXT FK → categories | |
| slug | TEXT UNIQUE | URL |
| sku | TEXT UNIQUE | Заавал биш |
| name, description, brand | TEXT | |
| price_mnt | INT | Үндсэн үнэ (₮) |
| compare_at_mnt | INT | Хуучин үнэ (sale) |
| rating_tenths | INT | 45 = 4.5 од |
| status | TEXT | draft \| active \| archived |
| badge | TEXT | best \| new |
| target_animals | JSON | `["dog","cat"]` |
| images | JSON | URL массив |
| image_alt | TEXT | |
| details | JSON | `{ ingredients, usage, shipping }` |

### `product_variants`
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | |
| product_id | TEXT | |
| label | TEXT | `11.4 кг` |
| price_mnt | INT | |
| stock_qty | INT | Нөөц |
| is_default | BOOL | Сонголтын default |

### `orders`
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | |
| order_number | TEXT UNIQUE | `ORD-…` |
| customer_email | TEXT | |
| customer_name | TEXT | |
| customer_phone | TEXT | |
| shipping_address | JSON | city, district, line1 |
| subtotal_mnt, shipping_mnt, total_mnt | INT | |
| status | TEXT | pending → delivered |
| payment_status | TEXT | unpaid \| paid \| refunded |

### `order_items`
Захиалгын дараа каталог өөрчлөгдвөл ч мөр хадгалагдана (FK байхгүй).

## Хассан (хэрэггүй байсан)

- `shops` + `shop_id` — нэг дэлгүүр, тохиргоо `src/config.ts`
- `users` / `merchants` — platform maker үлдэгдэл
- `customers` + `customer_id` — захиалга дээр шууд customer_* талбар
- `product_images` — `products.images` JSON
