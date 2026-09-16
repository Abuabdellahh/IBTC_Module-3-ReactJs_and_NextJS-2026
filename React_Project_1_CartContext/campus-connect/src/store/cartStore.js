import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (dish) => {
        const existing = get().items.find((i) => i.id === dish.id);
        if (existing) {
          set((s) => ({
            items: s.items.map((i) =>
              i.id === dish.id ? { ...i, qty: i.qty + 1 } : i
            ),
          }));
        } else {
          set((s) => ({ items: [...s.items, { ...dish, qty: 1 }] }));
        }
      },

      remove: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      clear: () => set({ items: [] }),
    }),
    { name: "addis-eats-cart" }
  )
);
