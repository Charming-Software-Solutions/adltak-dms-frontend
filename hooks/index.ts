"use client";

import {
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
