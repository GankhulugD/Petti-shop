import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = {
  id: string;
  productId: string;
  name: string;
  priceMnt: number;
  priceLabel: string;
  size: string;
  imageSrc: string;
  quantity: number;
};

export type CartAddInput = Omit<CartLine, "id">;

type CartState = {
  lines: CartLine[];
  isSheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
  openSheet: () => void;
  closeSheet: () => void;
  addItem: (item: CartAddInput) => void;
  removeLine: (lineId: string) => void;
  setLineQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  totalItemCount: () => number;
  subtotalMnt: () => number;
};

function lineKey(productId: string, size: string) {
  return `${productId}::${size}`;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isSheetOpen: false,

      setSheetOpen: (open) => set({ isSheetOpen: open }),
      openSheet: () => set({ isSheetOpen: true }),
      closeSheet: () => set({ isSheetOpen: false }),

      addItem: (item) => {
        const id = lineKey(item.productId, item.size);
        set((state) => {
          const idx = state.lines.findIndex((l) => l.id === id);
          if (idx >= 0) {
            const next = [...state.lines];
            const q = Math.min(99, next[idx].quantity + item.quantity);
            next[idx] = { ...next[idx], quantity: q };
            return { lines: next };
          }
          return {
            lines: [
              ...state.lines,
              {
                ...item,
                id,
                quantity: Math.min(99, Math.max(1, item.quantity)),
              },
            ],
          };
        });
      },

      removeLine: (lineId) =>
        set((state) => ({
          lines: state.lines.filter((l) => l.id !== lineId),
        })),

      setLineQuantity: (lineId, quantity) => {
        const q = Math.max(1, Math.min(99, Math.floor(quantity)));
        set((state) => ({
          lines: state.lines.map((l) =>
            l.id === lineId ? { ...l, quantity: q } : l,
          ),
        }));
      },

      clearCart: () => set({ lines: [] }),

      totalItemCount: () =>
        get().lines.reduce((sum, l) => sum + l.quantity, 0),

      subtotalMnt: () =>
        get().lines.reduce((sum, l) => sum + l.priceMnt * l.quantity, 0),
    }),
    {
      name: "petti-cart",
      partialize: (s) => ({ lines: s.lines }),
    },
  ),
);

export const SHIPPING_FLAT_MNT = 15_000;
export const FREE_SHIPPING_FROM_MNT = 150_000;

export function shippingForSubtotal(subtotal: number): number {
  if (subtotal <= 0) return 0;
  if (subtotal >= FREE_SHIPPING_FROM_MNT) return 0;
  return SHIPPING_FLAT_MNT;
}
