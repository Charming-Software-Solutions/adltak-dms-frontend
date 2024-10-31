"use client";

import { CalendarDateRangePicker } from "@/components/shared/DateRangePicker";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/shared/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { DistributionStatuses } from "@/constants";
import { ListFilter } from "lucide-react";
import React, { useState } from "react";
import FilterBadge from "./FilterBadge";
import { formatDateTime } from "@/lib/utils";
import FilterSelect from "./FilterSelect";
import { Brand } from "@/types/product";
import { Separator } from "@/components/ui/separator";

type AppliedFilters = {
  status?: string;
  brand?: string;
  startDate?: Date;
  endDate?: Date;
};

type Props = {
  brands: Brand[];
};

const FilterDialog = ({ brands }: Props) => {
  const [openFilterDialog, setOpenFilterDialog] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    status: "",
    brand: "",
    startDate: undefined,
    endDate: undefined,
  });

  const hasFilters =
    appliedFilters.status ||
    appliedFilters.brand ||
    appliedFilters.startDate ||
    appliedFilters.endDate;

  const updateFilter = (
    key: keyof AppliedFilters,
    value: string | Date | undefined,
  ) => {
    setAppliedFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  return (
    <ResponsiveDialog open={openFilterDialog} setOpen={setOpenFilterDialog}>
      <ResponsiveDialogTrigger>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <ListFilter className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Filter
          </span>
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Filters</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <div className="flex flex-col gap-2 p-4 md:p-0">
          {brands?.length > 0 && (
            <FilterSelect
              name="Brands"
              items={brands}
              isObject={true}
              placeholder="Select Brand"
              onChange={(brand: Brand) => updateFilter("brand", brand.name)}
              value={appliedFilters.brand}
            />
          )}
          <FilterSelect
            name="Status"
            items={DistributionStatuses}
            isObject={false}
            placeholder="Select Status"
            onChange={(value) => updateFilter("status", value)}
            value={appliedFilters.status}
          />

          <div className="space-y-2">
            <span className="text-sm">Date</span>
            <div className="flex justify-between gap-2">
              <CalendarDateRangePicker
                onChange={(range) => {
                  const startDate = range?.from ?? undefined;
                  const endDate = range?.to ?? undefined;

                  setAppliedFilters((prev) => ({
                    ...prev,
                    startDate,
                    endDate,
                  }));
                }}
              />
              <Button
                variant={"outline"}
                className="flex-grow w-full"
                onClick={() => {
                  const today = new Date();
                  updateFilter("startDate", today);
                  updateFilter("endDate", today);
                }}
              >
                <span className="text-xs">Set Current</span>
              </Button>
            </div>
          </div>

          <Separator className="mt-4" />
          <div className="space-y-2">
            <span className="text-sm">Applied Filters</span>
            {hasFilters && (
              <div className="flex flex-row flex-wrap gap-2">
                {appliedFilters.status && (
                  <FilterBadge
                    onRemove={() => {
                      setAppliedFilters((prev) => ({
                        ...prev,
                        status: undefined,
                      }));
                    }}
                  >
                    Status: {appliedFilters.status}
                  </FilterBadge>
                )}
                {appliedFilters.brand && (
                  <FilterBadge
                    onRemove={() => {
                      setAppliedFilters((prev) => ({
                        ...prev,
                        brand: undefined,
                      }));
                    }}
                  >
                    Brand: {appliedFilters.brand}
                  </FilterBadge>
                )}
                {appliedFilters.startDate && (
                  <FilterBadge
                    onRemove={() => {
                      setAppliedFilters((prev) => ({
                        ...prev,
                        startDate: undefined,
                      }));
                    }}
                  >
                    Start Date: {formatDateTime(appliedFilters.startDate)}
                  </FilterBadge>
                )}
                {appliedFilters.endDate && (
                  <FilterBadge
                    onRemove={() => {
                      setAppliedFilters((prev) => ({
                        ...prev,
                        endDate: undefined,
                      }));
                    }}
                  >
                    End Date: {formatDateTime(appliedFilters.endDate)}
                  </FilterBadge>
                )}
              </div>
            )}
          </div>
        </div>
        <ResponsiveDialogFooter>
          <div className="flex flex-row flex-grow w-full gap-2">
            <Button
              variant="outline"
              className="flex-grow w-full"
              onClick={() =>
                setAppliedFilters({
                  status: "",
                  brand: "",
                  startDate: undefined,
                  endDate: undefined,
                })
              }
            >
              Clear Filters
            </Button>
            <Button className="flex-grow w-full">Apply Filters</Button>
          </div>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default FilterDialog;
