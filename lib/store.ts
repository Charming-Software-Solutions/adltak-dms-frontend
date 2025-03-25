import { DistributionAsset, DistributionProduct } from "@/types/distribution";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AllocationItem = DistributionProduct | DistributionAsset;

type AllocationItemStoreState = {
  items: AllocationItem[];
};

type AllocationItemStoreActions = {
  addItem: (item: AllocationItem) => void;
  removeItem: (itemId: string) => void;
  clearItems: (type?: "product" | "asset") => void;
  updateQuantity: (itemId: string, quantity: number) => void;
};

export type AllocationItemStore = AllocationItemStoreState &
  AllocationItemStoreActions;

export const useAllocationStore = create<AllocationItemStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item: AllocationItem) =>
        set((state) => {
          // Check if the item already exists
          const existingItemIndex = state.items.findIndex((i) => i.id === item.id);

          // If it exists, update the quantity
          if (existingItemIndex >= 0) {
            const updatedItems = [...state.items];
            const existingItem = updatedItems[existingItemIndex];
            updatedItems[existingItemIndex] = {
              ...existingItem,
              quantity: (existingItem.quantity || 0) + (item.quantity || 1),
            };
            return { items: updatedItems };
          }

          return { items: [...state.items, item] };
        }),

      removeItem: (itemId: string) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        })),

      clearItems: (type?: "product" | "asset") => 
        set((state) => {
          if (!type) {
            return { items: [] };
          }
          
          return { 
            items: state.items.filter(item => 
              type === "product" ? !("product" in item) : !("asset" in item)
            ) 
          };
        }),

      updateQuantity: (itemId: string, quantity: number) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item,
          ),
        })),
    }),
    {
      name: "allocation-storage",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
