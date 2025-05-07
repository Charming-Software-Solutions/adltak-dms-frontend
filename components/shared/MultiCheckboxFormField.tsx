"use client";

import { SelectItemType } from "@/types/primitives";
import React from "react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";

type MultiCheckboxFormFieldProps = {
  items: SelectItemType[];
  control: Control<any>;
  name: string;
  label?: string;
  disabled?: boolean;
  className?: string;
};

const MultiCheckboxFormField = ({
  items,
  control,
  name,
  label,
  disabled,
  className,
}: MultiCheckboxFormFieldProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, key) => (
        <FormField
          key={key}
          control={control}
          name={name}
          disabled={disabled}
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  disabled={disabled}
                  checked={field.value?.includes(item.value)}
                  onCheckedChange={(checked) => {
                    return checked
                      ? field.onChange([...field.value, item.value])
                      : field.onChange(
                          field.value?.filter(
                            (value: string) => value !== item.value,
                          ),
                        );
                  }}
                />
              </FormControl>
              <FormLabel className="font-normal">{item.label}</FormLabel>
            </FormItem>
          )}
        />
      ))}
      <FormMessage />
    </div>
  );
};

export default MultiCheckboxFormField;
