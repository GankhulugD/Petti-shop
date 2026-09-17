# Petti Shop — Deploy

Гурван апп **тусдаа deploy** хийгдэнэ, нэг API (`server`) руу холбогдоно.

```
client (storefront)  ──►  server (Hono + D1)  ◄──  admin
                         petti-api.*.workers.dev
```

## Одоогийн production API

```
https://petti-api.gankhulug-d.workers.dev
```

Account: `gankhulug.d@techpack.mn` · D1: `petti-shop-db` (`49cf2b4c-430a-4028-ba5b-a42d1ad3aaf2`)

---

## 1. Server (Cloudflare Workers) — хийгдсэн

```bash
cd server
npx wrangler secret put ADMIN_SECRET
npx wrangler secret put ALLOWED_ORIGINS
npm run db:reset:remote   # эхний удаа
npm run deploy
```

### ALLOWED_ORIGINS шинэчлэх (Vercel deploy хийсний дараа заавал)

```bash
cd server
printf '%s' 'https://YOUR-CLIENT.vercel.app,https://YOUR-ADMIN.vercel.app,http://localhost:3000,http://localhost:3001' \
  | npx wrangler secret put ALLOWED_ORIGINS
```

---

## 2. Client (Vercel)

> **Улаан X GitHub дээр:** ихэнхдээ Vercel check — CI биш. Repo **root**-оос build хийх гэж оролдвол `No Next.js version detected` алдаа гарна. **Root Directory заавал `client`.**

1. [vercel.com](https://vercel.com) → **New Project** → repo сонгох
2. **Root Directory:** `client` ← **заавал** (Edit → client сонгох)
3. Framework: Next.js (автоматаар)

| Env | Утга |
|-----|------|
| `NEXT_PUBLIC_API_URL` | `https://petti-api.gankhulug-d.workers.dev` |
| `NEXT_PUBLIC_SITE_URL` | `https://YOUR-CLIENT.vercel.app` |

```bash
cd client && npm run build   # local шалгалт
```

---

## 3. Admin (Vercel)

1. **Тусдаа** Vercel project (client-ээс өөр — нэг repo, хоёр project)
2. **Root Directory:** `admin` ← **заавал**

| Env | Утга |
|-----|------|
| `NEXT_PUBLIC_API_URL` | `https://petti-api.gankhulug-d.workers.dev` |
| `ADMIN_SECRET` | server `ADMIN_SECRET`-тай **ижил** (server-only, browser руу орохгүй) |

Admin mutation (бараа хадгалах, захиалга шинэчлэх) **Server Actions**-аар ажиллана — Vercel дээр `ADMIN_SECRET` зөвхөн server талд хэрэглэгдэнэ.

```bash
cd admin && npm run build   # local шалгалт
```

---

## Local dev

```bash
npm run dev   # client :3000 · admin :3001 · api :8787
```

---

## Checklist

- [x] D1 remote migration + seed
- [x] Worker deploy (`petti-api`)
- [x] `ADMIN_SECRET` production secret
- [x] `ALLOWED_ORIGINS` (localhost; Vercel URL нэмэх)
- [ ] Client Vercel deploy + env
- [ ] Admin Vercel deploy + env
- [ ] `ALLOWED_ORIGINS` дээр Vercel URL нэмэх
- [ ] Checkout → `POST /api/orders`
- [ ] Admin бараа нэмэх, захиалгын төлөв солих
- [ ] `/track` захиалга шалгах
