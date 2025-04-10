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
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

type FilterPopoverProps<T> = {
  open: boolean;
  setOpen: (value: boolean) => void;
  selectedFilter: string | undefined;
  setFilter: (filter: string | null) => void;
  filterItems: T[];
  label: string;
  placeholder: string;
  valueKey: keyof T;
  displayKey: keyof T;
};

function FilterPopover<T>({
  open,
  setOpen,
  selectedFilter,
  setFilter,
  filterItems,
  label,
  placeholder,
  valueKey,
  displayKey,
}: FilterPopoverProps<T>) {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[11rem] justify-between"
        >
          {selectedFilter || `Select ${label.toLowerCase()}...`}{" "}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList className="h-40">
            <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
            <CommandGroup className="w-full">
              {filterItems.map((item) => (
                <CommandItem
                  key={String(item[valueKey])}
                  value={String(item[valueKey])}
                  onSelect={(currentValue: string) => setFilter(currentValue)}
                >
                  {String(item[displayKey])}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedFilter === String(item[valueKey])
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          {selectedFilter && (
            <>
              <Separator />
              <CommandGroup>
                <CommandItem className="p-2" onSelect={() => setFilter(null)}>
                  Clear
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default FilterPopover;
