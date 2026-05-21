# Petti API

Нэг дэлгүүрийн (Petti Shop) backend — **5 хүснэгт**, илүүдэл зүйлгүй.

## Schema

```
categories          → Ангилал (food, litter, toys, supplies)
products            → Бараа (slug, үнэ, зураг[], details JSON)
product_variants    → Хэмжээ / үнэ / нөөц
orders              → Захиалга
order_items         → Захиалгын мөр (snapshot)
```

**Хассан:** `shops`, `users`, `customers`, `product_images`, `shop_id` бүх газар.

Дэлгүүрийн тохиргоо: `src/config.ts` (код дотор).

## Database шинэчлэх

```bash
cd server
npm run db:reset:local    # local D1 — schema + seed
npm run db:reset:remote   # Cloudflare D1
```

## Dev

```bash
npm run dev   # http://localhost:8787
```

## D1

`petti-shop-db` · `7a6b8d7d-2c23-478b-a9cf-47a15717ab75`
