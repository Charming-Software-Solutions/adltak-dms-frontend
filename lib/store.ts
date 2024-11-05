import { DistributionProduct } from "@/types/distribution";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type BaseItem = {
  id: string;
  [key: string]: any;
};

export type QuantityItem<T extends BaseItem> = {
  id: string;
  item: T;
  quantity: number;
};

type QuantityItemStore<T extends BaseItem> = {
  items: QuantityItem<T>[];
  addItem: (item: T) => void;
  removeItem: (itemId: string) => void;
  clearItems: () => void;
  updateQuantity: (itemId: string, quantity: number) => void;
};

export const createItemStore = <T extends BaseItem>(storeName: string) =>
  create<QuantityItemStore<T>>()(
    persist(
      (set) => ({
        items: [],
        addItem: (item) => {
          set((state) => {
            const existingItemIndex = state.items.findIndex(
              (quantityItem) => quantityItem.item.id === item.id,
            );
            if (existingItemIndex !== -1) {
              // Item exists, update the quantity
              const updatedItems = [...state.items];
              updatedItems[existingItemIndex] = {
                ...updatedItems[existingItemIndex],
                quantity:
                  updatedItems[existingItemIndex].quantity + item.quantity,
              };
              return { items: updatedItems };
            } else {
              // Item does not exist, add it
              const newQuantityItem: QuantityItem<T> = {
                id: item.id,
                item,
                quantity: item.quantity,
              };
              return { items: [...state.items, newQuantityItem] };
            }
          });
        },
        removeItem: (itemId) =>
          set((state) => ({
            items: state.items.filter(
              (quantityItem) => quantityItem.id !== itemId,
            ),
          })),
        clearItems: () => set({ items: [] }),
        updateQuantity: (itemId, quantity) =>
          set((state) => {
            const itemIndex = state.items.findIndex(
              (quantityItem) => quantityItem.id === itemId,
            );
            if (itemIndex !== -1) {
              const updatedItems = [...state.items];
              if (quantity <= 0) {
                // Remove item if quantity is 0 or less
                return {
                  items: updatedItems.filter(
                    (quantityItem) => quantityItem.id !== itemId,
                  ),
                };
              }
              updatedItems[itemIndex] = {
                ...updatedItems[itemIndex],
                quantity,
              };
              return { items: updatedItems };
            }
            return state; // Item not found, return the current state
          }),
      }),
      {
        name: storeName,
      },
    ),
  );

export const useDistributionStore =
  createItemStore<DistributionProduct>("distribution-store");
