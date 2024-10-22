"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterSelectProps<T extends string | { name: string }> = {
  items: T[];
  isObject: boolean;
  placeholder: string;
  name: string;
  onChange: (selectedValue: T) => void;
  value: string | undefined;
};

const FilterSelect = <T extends string | { name: string }>({
  items,
  isObject,
  placeholder,
  name,
  onChange,
  value,
}: FilterSelectProps<T>) => {
  const handleValueChange = (value: string) => {
    const selectedItem = items.find((item) =>
      isObject ? (item as { name: string }).name === value : item === value,
    ) as T;
    if (selectedItem) {
      onChange(selectedItem);
    }
  };

  return (
    <div className="space-y-2">
      <span className="text-sm">{name}</span>
      <Select onValueChange={handleValueChange} value={value}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item, index) => (
            <SelectItem
              key={index}
              value={
                isObject ? (item as { name: string }).name : (item as string)
              }
            >
              {isObject ? (item as { name: string }).name : (item as string)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterSelect;
