"use client";

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
import { productParsers } from "@/lib/searchParams";
import { cn } from "@/lib/utils";
import { Classification } from "@/types/generics";
import { Check, ChevronsUpDown } from "lucide-react";
import { useQueryStates } from "nuqs";
import React from "react";
import { useState } from "react";

type ProductFilterProps = {
  brands: Classification[];
};

const ProductFilter = ({ brands }: ProductFilterProps) => {
  const [{ brand }, setProductFilters] = useQueryStates(productParsers, {
    history: "push",
    shallow: false,
  });
  const [open, setOpen] = useState(false);

  const selectedBrandName = brands.find((b) => b.name === brand)?.name;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
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
              {brands.map((brandItem) => (
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
};

export default ProductFilter;
