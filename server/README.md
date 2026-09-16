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

## API docs (Swagger)

Нээлттэй OpenAPI JSON endpoint **байхгүй** — spec зөвхөн admin docs HTML дотор inline байна.

```bash
# ADMIN_SECRET = server/.dev.vars
curl -H "x-admin-secret: petti-dev-admin-secret" http://localhost:8787/api/admin/docs > docs.html && open docs.html
```

Header-гүй хүсэлт 401 буцаана. Swagger UI дээр **Authorize** → `x-admin-secret` оруулж admin endpoint-уудыг туршина.

## D1

`petti-shop-db` · `49cf2b4c-430a-4028-ba5b-a42d1ad3aaf2`
