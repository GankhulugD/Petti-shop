/** Petti — нэг дэлгүүрийн тохиргоо (DB-д shops хүснэгт хэрэггүй) */
export const STORE = {
  name: "Petti Shop",
  slug: "petti-shop",
  currency: "MNT",
  freeShippingFromMnt: 150_000,
  flatShippingMnt: 15_000,
  phone: "+976 7711 2233",
  email: "hello@petti.mn",
  hours: "Даваа–Баасан 10:00–19:00 · Бямба 11:00–16:00",
  bank: {
    name: "Хаан банк",
    account: "5000123456",
    holder: "ПЕТТИ ШОП ХХК",
  },
} as const;
