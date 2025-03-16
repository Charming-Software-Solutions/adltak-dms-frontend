"use client";

import { useState } from "react";

export function useFilters<T>(initialFilters: T) {
  const [filters, setFilters] = useState<T>(initialFilters);
  return [filters, setFilters] as const;
}

export function updateFilter<T>(
  setAppliedFilters: React.Dispatch<React.SetStateAction<T>>,
  key: keyof T,
  value: string | number | boolean | undefined,
) {
  setAppliedFilters((prev) => ({
    ...prev,
    [key]: value,
  }));
}
