"use client";

import {
  AssetFormData,
  assetFormSchema,
  DistributionFormData,
  distributionFormSchema,
  DistributionProductFormData,
  distributionProductSchema,
  ProductFormData,
  productFormSchema,
  TaskFormData,
  taskFormSchema,
  UserFormData,
  userFormSchema,
} from "@/schemas";
import { Product } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMediaQuery } from "react-responsive";

type UseProductFormProps = {
  mode: "create" | "edit";
  product?: Product;
};

export const useProductForm = ({ mode, product }: UseProductFormProps) => {
  return useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: mode === "create" ? "" : product?.name || "",
      brand: mode === "create" ? "" : product?.brand.id || "",
      category: mode === "create" ? "" : product?.category.id || "",
      type: mode === "create" ? "" : product?.type.id || "",
      thumbnail: undefined,
      // status: mode === "create" ? "" : product?.status || "",
      stock: mode === "create" ? 0 : product?.stock || 0,
    },
  });
};

export const useUserForm = () => {
  return useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "",
    },
  });
};

export const useDistributionForm = () => {
  return useForm<DistributionFormData>({
    resolver: zodResolver(distributionFormSchema),
    defaultValues: {
      type: "",
      client: "",
    },
  });
};

export const useDistributionProductForm = () => {
  return useForm<DistributionProductFormData>({
    resolver: zodResolver(distributionProductSchema),
    defaultValues: {
      product: "",
      quantity: 1,
    },
  });
};

export const useTaskForm = () => {
  return useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      employee: "",
      distribution: "",
    },
  });
};

export const useAssetForm = () => {
  return useForm<AssetFormData>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      name: "",
      code: "",
      type: "",
    },
  });
};

type Breakpoint = "mobile" | "tablet" | "desktop" | "large";

export function useResponsive(breakpoint: Breakpoint): boolean {
  const queries = {
    mobile: { maxWidth: 767 },
    tablet: { minWidth: 768, maxWidth: 1223 },
    desktop: { minWidth: 1224, maxWidth: 1823 },
    large: { minWidth: 1824 },
  };

  return useMediaQuery(queries[breakpoint]);
}
