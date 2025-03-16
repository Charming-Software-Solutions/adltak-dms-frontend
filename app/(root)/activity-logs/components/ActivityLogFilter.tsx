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
            value: "CREATE",
          },
          {
            label: "UPDATE",
            value: "UPDATE",
          },
          {
            label: "DELETE",
            value: "DELETE",
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
            value: "Product",
          },
          {
            label: "Product Brand",
            value: "Product Brand",
          },
          {
            label: "Product Category",
            value: "Product Category",
          },
          {
            label: "Product Type",
            value: "Product Type",
          },
          {
            label: "Asset",
            value: "Asset",
          },
          {
            label: "Asset Type",
            value: "Asset Type",
          },
          {
            label: "Allocation",
            value: "Allocation",
          },
          {
            label: "Task",
            value: "Task",
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
                  <Label htmlFor={item.value} className="cursor-pointer">
                    {item.label}
                  </Label>
                  <RadioGroupItem value={item.value} id={item.value} />
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      })}
    </div>
  );
};
