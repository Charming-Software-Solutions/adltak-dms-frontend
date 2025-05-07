"use client";

import FilterDialog from "@/components/shared/filter/FilterDialog";
import FilterSelect from "@/components/shared/filter/FilterSelect";
import { ResponsiveDialogFooter } from "@/components/shared/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useProductFilters } from "@/hooks/use-filters";
import { cn } from "@/lib/utils";
import { Classification } from "@/types/generics";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { useState } from "react";

type ProductFilterProps = {
  classfications: {
    brands: Classification[];
    categories: Classification[];
    types: Classification[];
  };
  isFilteredByBrands?: boolean;
};

const ProductFilter = ({
  classfications,
  isFilteredByBrands = false,
}: ProductFilterProps) => {
  const [productFilters, setProductFilters] = useProductFilters();
  const { brand, category, product_type } = productFilters;
  const [openBrandFilter, setOpenBrandFilter] = useState(false);
  const [openDialogFilter, setOpenDialogFilter] = useState(false);

  const selectedBrandName = classfications.brands.find(
    (b) => b.name === brand,
  )?.name;

  if (isFilteredByBrands) {
    return (
      <Popover open={openBrandFilter} onOpenChange={setOpenBrandFilter}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openBrandFilter}
            className="w-[11rem] justify-between"
          >
            {selectedBrandName || "Select brand..."}{" "}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search brand..." />
            <CommandList className="h-40">
              <CommandEmpty>No brands found.</CommandEmpty>
              <CommandGroup className="w-full">
                {classfications.brands.map((brandItem) => (
                  <CommandItem
                    key={brandItem.id}
                    value={brandItem.name}
                    onSelect={(currentValue: string) => {
                      setProductFilters({
                        brand: currentValue,
                      });
                    }}
                  >
                    {brandItem.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        brand === brandItem.name ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            {brand && (
              <React.Fragment>
                <Separator />
                <CommandGroup>
                  <CommandItem
                    className="p-2"
                    onSelect={() => setProductFilters({ brand: null })}
                  >
                    Clear
                  </CommandItem>
                </CommandGroup>
              </React.Fragment>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <FilterDialog open={openDialogFilter} setOpen={setOpenDialogFilter}>
      <FilterSelect
        name="Category"
        items={classfications.categories.map((category) => ({
          label: category.name,
          value: category.name,
        }))}
        placeholder="Select category"
        onChange={(value) => setProductFilters({ category: value })}
        onRemove={() => setProductFilters({ category: "" })}
        value={category}
        className="px-4"
      />
      <FilterSelect
        name="Type"
        items={classfications.types.map((type) => ({
          label: type.name,
          value: type.name,
        }))}
        placeholder="Select Type"
        onChange={(value) => setProductFilters({ product_type: value })}
        onRemove={() => setProductFilters({ product_type: "" })}
        value={product_type}
        className="px-4"
      />
      <ResponsiveDialogFooter className="px-4">
        <div className="flex flex-row flex-grow w-full gap-2">
          <Button
            variant="outline"
            className="flex-grow w-full"
            onClick={() =>
              setProductFilters({
                category: "",
                product_type: "",
              })
            }
          >
            Clear Filters
          </Button>
          <Button
            className="flex-grow w-full"
            onClick={() => setOpenDialogFilter(false)}
          >
            View All
          </Button>
        </div>
      </ResponsiveDialogFooter>
    </FilterDialog>
  );
};

export default ProductFilter;
