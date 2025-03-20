"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RadioGroupFilter } from "@/types/primitives";

type ActivityLogFilter = {
  role: string;
  type: string;
  module: string;
};

type ActivityLogFilterProps = {
  filters: ActivityLogFilter;
  setFilters: (filters: ActivityLogFilter) => void;
};

export const ActivityLogFilter = ({
  filters,
  setFilters,
}: ActivityLogFilterProps) => {
  const radioFilters: RadioGroupFilter = {
    group: [
      {
        title: "Role",
        defaultValue: filters.role ?? "",
        items: [
          { label: "All", value: "" },
          { label: "Admin", value: "ADMIN" },
          { label: "Warehouse Personnel", value: "WAREHOUSE_WORKER" },
          { label: "Logistics Team Member", value: "LOGISTICS_SPECIALIST" },
          { label: "Project Manager", value: "PROJECT_HANDLER" },
        ],
      },
      {
        title: "Type",
        defaultValue: filters.type ?? "",
        items: [
          { label: "All", value: "" },
          {
            label: "CREATE",
            value: 1,
          },
          {
            label: "UPDATE",
            value: 2,
          },
          {
            label: "DELETE",
            value: 3,
          },
        ],
      },
      {
        title: "Module",
        defaultValue: filters.module ?? "",
        items: [
          { label: "All", value: "" },
          {
            label: "Product",
            value: "product",
          },
          {
            label: "Product Brand",
            value: "productbrand",
          },
          {
            label: "Product Category",
            value: "productcategory",
          },
          {
            label: "Product Type",
            value: "producttype",
          },
          {
            label: "Asset",
            value: "asset",
          },
          {
            label: "Asset Type",
            value: "assettype",
          },
          {
            label: "Allocation",
            value: "allocation",
          },
          {
            label: "Task",
            value: "task",
          },
        ],
      },
    ],
  };

  return (
    <div className="pt-6 space-y-10">
      {radioFilters.group.map((radio, key) => {
        const fieldName = radio.title.toLowerCase() as keyof ActivityLogFilter;

        return (
          <div className="flex flex-col space-y-4" key={key}>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-bold">{radio.title}</span>
              <Button
                variant={"link"}
                className="text-sm h-4 text-red-700 pr-0"
                onClick={() => {
                  setFilters({ ...filters, [fieldName]: "" });
                }}
              >
                Clear Filter
              </Button>
            </div>
            <RadioGroup
              className="space-y-4"
              value={filters[fieldName]}
              onValueChange={(value) => {
                setFilters({
                  ...filters,
                  [fieldName]: value,
                });
              }}
            >
              {radio.items.map((item, index) => (
                <div className="flex items-center justify-between" key={index}>
                  <Label
                    htmlFor={String(item.value)}
                    className="cursor-pointer"
                  >
                    {item.label}
                  </Label>
                  <RadioGroupItem
                    value={String(item.value)}
                    id={String(item.value)}
                  />
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      })}
    </div>
  );
};
