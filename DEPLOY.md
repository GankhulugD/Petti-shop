# Petti Shop — Deploy

Гурван апп **тусдаа deploy** хийгдэнэ, нэг API (`server`) руу холбогдоно.

```
client (storefront)  ──►  server (Hono + D1)  ◄──  admin
   :3000                      :8787 / api.*              :3001
```

## 1. Server (Cloudflare Workers)

```bash
cd server
cp .dev.vars.example .dev.vars   # local only

# Secrets (production)
wrangler secret put ADMIN_SECRET
wrangler secret put ALLOWED_ORIGINS
# ALLOWED_ORIGINS жишээ: https://petti.mn,https://admin.petti.mn

npm run db:reset:remote          # эхний удаа: schema + seed
npm run deploy
```

API URL: `https://petti-api.<account>.workers.dev` эсвэл custom domain.

## 2. Client (Vercel / Cloudflare Pages)

```bash
cd client
cp .env.local.example .env.local
```

| Env | Жишээ |
|-----|--------|
| `NEXT_PUBLIC_API_URL` | `https://api.petti.mn` |
| `NEXT_PUBLIC_SITE_URL` | `https://petti.mn` |

```bash
npm run build
# Vercel: root = client/
# Pages: build command npm run build, output .next (adapter) or use @cloudflare/next-on-pages
```

## 3. Admin (Vercel / Cloudflare Pages)

```bash
cd admin
cp .env.local.example .env.local
```

| Env | Жишээ |
|-----|--------|
| `NEXT_PUBLIC_API_URL` | `https://api.petti.mn` |
| `ADMIN_SECRET` | server-тэй ижил |

```bash
npm run build
```

## Local dev

```bash
# Root-оос — client :3000, admin :3001, api :8787
npm run dev

# Эсвэл тусад нь:
npm run dev:server   # :8787
npm run dev:client   # :3000
npm run dev:admin    # :3001
```

## Checklist

- [ ] D1 remote migration + seed
- [ ] `ADMIN_SECRET` production secret
- [ ] `ALLOWED_ORIGINS` client + admin URL
- [ ] Client/admin env production URL
- [ ] Checkout → `POST /api/orders` ажиллаж байгаа эсэх
- [ ] Admin бараа нэмэх, захиалгын төлөв солих
- [ ] `/track` захиалга шалгах
