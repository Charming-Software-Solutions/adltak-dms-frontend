"use client";

import React from "react";
import FilterBadge from "./FilterBadge";
import { formatFilterValue } from "@/lib/utils";
import { AppliedFilters } from "@/types/primitives";

type FilterBadgeRowProps<T extends Record<string, string | undefined>> = {
  appliedFilters: AppliedFilters<T>;
  setAppliedFilters: (filters: Partial<T>) => void;
};

const FilterBadgeRow = <T extends Record<string, string | undefined>>({
  appliedFilters,
  setAppliedFilters,
}: FilterBadgeRowProps<T>) => {
  return (
    <div className="flex items-center gap-2">
      {Object.entries(appliedFilters).map(([key, value]) => {
        if (key !== "expiration" && value) {
          return (
            <FilterBadge
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              value={formatFilterValue(value)}
              onRemove={() => setAppliedFilters({ [key]: "" } as Partial<T>)}
            />
          );
        }
      })}
    </div>
  );
};

export default FilterBadgeRow;
