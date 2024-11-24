"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Table } from "@tanstack/react-table";
import { useQueryState } from "nuqs";

interface DataTableSearchProps<TData> {
  table: Table<TData>;
  column: string;
  placeholder: string;
  className?: string;
}

export function DataTableSearch<TData>({
  table,
  column,
  placeholder,
  className,
}: DataTableSearchProps<TData>) {
  const [queryParam, setQueryParam] = useQueryState(column, {
    defaultValue: "",
  });

  if (queryParam && !table.getColumn(column)?.getFilterValue()) {
    table.getColumn(column)?.setFilterValue(queryParam);
  }

  return (
    <div className="flex items-center">
      <Input
        placeholder={placeholder}
        value={queryParam ?? ""}
        onChange={(event) => {
          const value = event.target.value;
          table.getColumn(column)?.setFilterValue(value);
          setQueryParam(value);
        }}
        className="max-w-xs"
      />
    </div>
  );
}
