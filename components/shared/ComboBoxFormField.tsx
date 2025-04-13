"use client";

import { cn } from "@/lib/utils";
import { SelectItemType } from "@/types/primitives";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { useState } from "react";
import { Control } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";

type ComboBoxFormFieldProps = {
  items: (SelectItemType & { children?: React.ReactNode })[];
  control: Control<any>;
  placeholder: {
    triggerPlaceholder: string;
    searchPlaceholder: string;
  };
  name: string;
  popOverSize: string;
  label?: string;
  disabled?: boolean;
  footer?: {
    onSelect: () => void;
    label: string;
  };
};

const ComboBoxFormField = (props: ComboBoxFormFieldProps) => {
  const {
    items,
    control,
    placeholder,
    name,
    popOverSize,
    label,
    disabled,
    footer,
  } = props;
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const filteredItems = items.filter((item) =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase()),
        );

        return (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between h-11",
                      !field.value && "text-muted-foreground",
                    )}
                    disabled={disabled}
                  >
                    {field.value
                      ? items.find((item) => item.value === field.value)?.label
                      : placeholder.triggerPlaceholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className={cn("p-0", popOverSize)}>
                <Command className="overflow-auto">
                  <CommandInput
                    placeholder={placeholder.searchPlaceholder}
                    onValueChange={setSearchQuery}
                  />
                  <CommandList className="max-h-40">
                    {filteredItems.length === 0 ? (
                      <CommandEmpty className="p-4 text-center">
                        No results found.
                      </CommandEmpty>
                    ) : (
                      <CommandGroup className="space-y-1 py-1">
                        {filteredItems.map((item) => (
                          <CommandItem
                            key={item.value}
                            value={item.label}
                            className="flex items-center"
                            onSelect={() => {
                              field.onChange(item.value);
                              setOpen(false);
                            }}
                          >
                            {item.children}
                            <span>{item.label}</span>
                            <Check
                              className={cn(
                                "ml-auto",
                                item.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>

                  {footer && (
                    <>
                      <Separator className="m-0" />
                      <div className="px-1 py-1">
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full justify-start rounded-sm text-sm font-normal"
                          onClick={() => {
                            footer.onSelect();
                            setOpen(false);
                          }}
                        >
                          {footer.label}
                        </Button>
                      </div>
                    </>
                  )}
                </Command>
              </PopoverContent>
            </Popover>
          </FormItem>
        );
      }}
    />
  );
};

export default ComboBoxFormField;
