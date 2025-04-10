"use client";

import {
  activityLogParsers,
  materialParsers,
  productParsers,
  projectParsers,
  taskParsers,
} from "@/lib/searchParams";
import { useQueryStates } from "nuqs";

export function useProjectFilters() {
  return useQueryStates(
    {
      status: projectParsers.status,
      start_date: projectParsers.start_date,
      end_date: projectParsers.end_date,
    },
    {
      history: "push",
      shallow: false,
    },
  );
}

export function useProductFilters() {
  return useQueryStates(
    {
      brand: productParsers.brand,
      category: productParsers.category,
      product_type: productParsers.product_type,
    },
    {
      history: "push",
      shallow: false,
    },
  );
}

export function useTaskFilters() {
  return useQueryStates(
    {
      status: taskParsers.status,
      start_date: taskParsers.start_date,
      end_date: taskParsers.end_date,
    },
    {
      history: "push",
      shallow: false,
    },
  );
}

export function useMaterialFilters() {
  return useQueryStates(
    {
      brand: materialParsers.brand,
      status: materialParsers.status,
      material_type: materialParsers.material_type,
    },
    {
      history: "push",
      shallow: false,
    },
  );
}

export function useActivityLogFilters() {
  return useQueryStates(
    {
      role: activityLogParsers.role,
      type: activityLogParsers.type,
      module: activityLogParsers.module,
    },
    {
      history: "push",
      shallow: false,
    },
  );
}
