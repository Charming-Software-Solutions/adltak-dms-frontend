"use client";

import {
  DistributionProductFormData,
  distributionProductSchema,
} from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMediaQuery } from "react-responsive";

export const useDistributionProductForm = () => {
  return useForm<DistributionProductFormData>({
    resolver: zodResolver(distributionProductSchema),
    defaultValues: {
      product: "",
      quantity: 1,
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
