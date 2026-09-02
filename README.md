# Petti Shop

Тэжээвэр амьтны онлайн дэлгүүр — **client** (storefront), **admin**, **server** (Hono + Drizzle + Cloudflare D1).

## Stack

| App | Tech | Port (dev) |
|-----|------|------------|
| `client/` | Next.js 16, Tailwind, shadcn | 3000 |
| `admin/` | Next.js 16 | 3001 |
| `server/` | Hono, Drizzle, D1 | 8787 |

## Quick start

```bash
npm i
npm i --prefix client && npm i --prefix admin && npm i --prefix server
cp server/.dev.vars.example server/.dev.vars
cp client/.env.local.example client/.env.local
cp admin/.env.local.example admin/.env.local
npm run db:setup   # эхний удаа

npm run dev        # client :3000 · admin :3001 · api :8787
```

Тусад нь: `npm run dev:client` / `dev:admin` / `dev:server`

Deploy: [DEPLOY.md](./DEPLOY.md)

## Features

- Storefront: каталог, хайлт, шүүлтүүр, сагс, wishlist, checkout → D1
- Захиалга шалгах (`/track`), хүргэлт/буцаалт/нөхцөл хуудсууд
- Admin: бараа нэмэх/засах, захиалгын төлөв, dashboard
- API: search, stock decrement, CORS, admin secret

## Cursor rules

`.cursor/rules/senior-fullstack-developer.mdc` — төслийн архитектурын заавар.
