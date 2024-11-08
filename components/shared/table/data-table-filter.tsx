"use client";
import { Table } from "@tanstack/react-table";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "../ResponsiveDialog";
import { ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import React from "react";

interface DataTableFilterProps<TData> {
  table: Table<TData>;
  columnFilters: {
    id: string;
    value: unknown;
  };
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

const DataTableFilter = <TData,>({
  table,
  columnFilters,
  open,
  setOpen,
  children,
}: DataTableFilterProps<TData>) => {
  return (
    <ResponsiveDialog open={open} setOpen={setOpen}>
      <ResponsiveDialogTrigger>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <ListFilter className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Filter
          </span>
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="px-0">
        <ResponsiveDialogHeader className="px-4">
          <ResponsiveDialogTitle>Filters</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <Separator />
        {children}
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default DataTableFilter;
