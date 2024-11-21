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

type ComboBoxFormFieldProps = {
  items: SelectItemType[];
  control: Control<any>;
  placeholder: {
    triggerPlaceholder: string;
    searchPlaceholder: string;
  };
  name: string;
  popOverSize: string;
  label?: string;
  disabled?: boolean;
};

const ComboBoxFormField = (props: ComboBoxFormFieldProps) => {
  const { items, control, placeholder, name, popOverSize, label, disabled } =
    props;
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
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
                  >
                    {field.value
                      ? items.find((item) => item.value === field.value)?.label
                      : placeholder.searchPlaceholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="md:min-w-[30rem] p-0">
                <Command>
                  <CommandInput placeholder={placeholder.searchPlaceholder} />
                  <CommandList>
                    <CommandEmpty>No language found.</CommandEmpty>
                    <CommandGroup>
                      {items.map((item) => (
                        <CommandItem
                          value={item.label}
                          key={item.value}
                          onSelect={() => {
                            field.onChange(item.value);
                            setOpen(false);
                          }}
                        >
                          {item.label}
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
                  </CommandList>
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
