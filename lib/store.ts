import { ProjectProduct } from "@/types/project";
import { create } from "zustand";

export type ProjectProductStoreState = {
  items: ProjectProduct[];
};

type ProjectProductStoreActions = {
  addItem: (item: ProjectProduct) => void;
  removeItem: (itemId: string) => void;
  clearItems: () => void;
  updateQuantity: (itemId: string, quantity: number) => void;
};

export type ProjectProductStore = ProjectProductStoreState &
  ProjectProductStoreActions;

export const useProjectProductStore = create<ProjectProductStore>()((set) => ({
  items: [],

  addItem: (item: ProjectProduct) =>
    set((state) => {
      // Check if the item already exists
      const existingItemIndex = state.items.findIndex((i) => i.id === item.id);
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

  clearItems: () => set({ items: [] }),

  updateQuantity: (itemId: string, quantity: number) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item,
      ),
    })),
}));
