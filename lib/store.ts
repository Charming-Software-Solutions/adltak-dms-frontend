import { ProjectMaterial, ProjectProduct } from "@/types/project";
import { create } from "zustand";

export type ProjectItem = ProjectProduct | ProjectMaterial;

export type ProjectItemStoreState = {
  items: ProjectItem[];
};

type ProjectProductStoreActions = {
  addItem: (item: ProjectItem) => void;
  removeItem: (itemId: string) => void;
  clearItems: (type?: "product" | "material") => void;
  updateQuantity: (itemId: string, quantity: number) => void;
};

export type ProjectItemStore = ProjectItemStoreState &
  ProjectProductStoreActions;

export const useProjectItemStore = create<ProjectItemStore>()((set) => ({
  items: [],

  addItem: (item: ProjectItem) =>
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

  clearItems: (type?: "product" | "material") =>
    set((state) => {
      if (!type) {
        return { items: [] };
      }

      return {
        items: state.items.filter((item) =>
          type === "product" ? !("product" in item) : !("material" in item),
        ),
      };
    }),

  updateQuantity: (itemId: string, quantity: number) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item,
      ),
    })),
}));
