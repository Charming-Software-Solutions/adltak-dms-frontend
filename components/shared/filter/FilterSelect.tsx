"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { SelectItemType } from "@/types/primitives";

type FilterSelectProps = {
  items: SelectItemType[] | { id: string; name: string }[];
  placeholder: string;
  name: string;
  onChange: (selectedValue: string) => void;
  value: string | undefined;
  className?: string;
  isObject?: boolean;
};

const FilterSelect = ({
  items,
  placeholder,
  name,
  onChange,
  value,
  className,
  isObject = false,
}: FilterSelectProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <span className="text-sm font-semibold">{name}</span>
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item, index) => {
            if (isObject && "name" in item) {
              return (
                <SelectItem key={item.id} value={item.name}>
                  {item.name}
                </SelectItem>
              );
            } else if ("label" in item) {
              return (
                <SelectItem key={index} value={item.value}>
                  {item.label}
                </SelectItem>
              );
            }
            return null;
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterSelect;
