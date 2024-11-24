"use client";

import FilterBadgeRow from "@/components/shared/filter/FilterBadgeRow";
import FilterDialog from "@/components/shared/filter/FilterDialog";
import FilterSelect from "@/components/shared/filter/FilterSelect";
import { ResponsiveDialogFooter } from "@/components/shared/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ASSET_STATUS,
  COMBINED_TASK_STATUS,
  distributionTypes,
} from "@/constants";
import { useDialog } from "@/hooks";
import { convertRecordsToArray, filterDataTable } from "@/lib/utils";
import { Asset } from "@/types/asset";
import { Classification } from "@/types/generics";
import { AppliedFilters } from "@/types/primitives";
import { Task } from "@/types/task";
import { parseAsString, useQueryStates } from "nuqs";
import { useState } from "react";

type AssetTask = Asset | Task;

type FilterAssetTaskProps<T> = {
  items: T[];
  type: "asset" | "task";
  assetTypes?: Classification[];
};

type AssetTaskFilters = AppliedFilters<{
  type?: string;
  status?: string;
}>;

export const useAssetTaskFilters = <T extends AssetTask>(items?: T[]) => {
  const [queryStates, setQueryStates] = useQueryStates({
    type: parseAsString.withDefault(""),
    status: parseAsString.withDefault(""),
  });

  const [filters, setFilters] = useState<AssetTaskFilters>({
    type: queryStates.type,
    status: queryStates.status,
  });

  const updateFilter = (
    key: keyof AssetTaskFilters,
    value: string | number | undefined,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClearFilters = () => {
    setQueryStates(null);
    setFilters({
      type: "",
      status: "",
    });
  };

  const handleResetFilters = (
    setOpen: (value: React.SetStateAction<boolean>) => void,
  ) => {
    setQueryStates({
      type: filters.type || "",
      status: filters.status || "",
    });
    setOpen(false);
  };

  const hasActiveFilters = () => {
    return Object.values(queryStates).some((value) => value !== "");
  };

  const getFilteredItems = () => {
    if (!items) return [];

    return filterDataTable(items, (item) => {
      const isValidType = queryStates.type
        ? isTask(item)
          ? item.distribution.type === queryStates.type
          : item.type.name === queryStates.type
        : true;

      const isValidStatus = queryStates.status
        ? isTask(item)
          ? item.status === queryStates.status
          : item.status === queryStates.status
        : true;

      return isValidType && isValidStatus;
    });
  };

  return {
    queryStates,
    setQueryStates,
    filters,
    setFilters,
    updateFilter,
    handleClearFilters,
    handleResetFilters,
    hasActiveFilters,
    getFilteredItems,
  };
};

const isTask = (item: AssetTask): item is Task => {
  return (item as Task).distribution !== undefined;
};

const FilterTaskAsset = ({
  items,
  type,
  assetTypes,
}: FilterAssetTaskProps<AssetTask>) => {
  const {
    queryStates,
    setQueryStates,
    filters,
    updateFilter,
    handleClearFilters,
    handleResetFilters,
  } = useAssetTaskFilters(items);
  const { openDialog, setOpenDialog } = useDialog();

  // Use assetTypes if provided, otherwise use default (ASSET_)
  const assetTypeOptions = assetTypes
    ? assetTypes.map((assetType) => ({
        label: assetType.name,
        value: assetType.name,
      }))
    : [];

  return (
    <div className="flex gap-2">
      <FilterBadgeRow<AssetTaskFilters>
        appliedFilters={queryStates}
        setAppliedFilters={setQueryStates}
      />
      <FilterDialog open={openDialog} setOpen={setOpenDialog}>
        <FilterSelect
          name="Type"
          items={type === "asset" ? assetTypeOptions : distributionTypes}
          placeholder="Select type"
          onChange={(value) => updateFilter("type", value)}
          onRemove={() => updateFilter("type", "")}
          value={filters.type}
          className="px-4"
          isObject={true}
        />
        <FilterSelect
          name="Status"
          items={
            type === "asset"
              ? convertRecordsToArray(ASSET_STATUS)
              : COMBINED_TASK_STATUS
          }
          placeholder="Select status"
          onChange={(value) => updateFilter("status", value)}
          onRemove={() => updateFilter("status", "")}
          value={filters.status}
          className="px-4"
          isObject={true}
        />
        <Separator className="mt-4" />
        <ResponsiveDialogFooter className="flex flex-row w-full gap-2 px-4">
          <Button
            variant={"outline"}
            className="flex-grow"
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
          <Button
            className="flex-grow"
            onClick={() => handleResetFilters(setOpenDialog)}
          >
            Apply Filters
          </Button>
        </ResponsiveDialogFooter>
      </FilterDialog>
    </div>
  );
};

export default FilterTaskAsset;
