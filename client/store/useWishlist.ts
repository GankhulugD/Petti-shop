import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistState = {
  ids: string[];
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
  count: () => number;
};

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],

      has: (productId) => get().ids.includes(productId),

      toggle: (productId) =>
        set((s) =>
          s.ids.includes(productId)
            ? { ids: s.ids.filter((id) => id !== productId) }
            : { ids: [...s.ids, productId] },
        ),

      remove: (productId) =>
        set((s) => ({ ids: s.ids.filter((id) => id !== productId) })),

      count: () => get().ids.length,
    }),
    {
      name: "petti-wishlist",
      partialize: (s) => ({ ids: s.ids }),
    },
  ),
);
