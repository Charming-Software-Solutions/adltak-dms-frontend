"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React from "react";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableSearch } from "./data-table-search";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  visibleColumns?: VisibilityState;
  showPagination?: boolean;
  searchField?: {
    column: string;
    placeholder: string;
    className?: string;
  };
  filters?: React.ReactNode;
  tabsList?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  visibleColumns = {},
  showPagination = true,
  searchField = undefined,
  filters,
  tabsList,
}: DataTableProps<TData, TValue> & {
  visibleColumns?: Record<string, boolean>;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(visibleColumns);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 6,
      },
    },
  });

  return (
    <div className="flex flex-col gap-3.5 py-1">
      {(searchField || filters || tabsList) && (
        <div className="flex shrink-0 items-center">
          <div className="flex items-center w-full justify-between">
            <div className="w-full">
              {searchField && (
                <DataTableSearch
                  table={table}
                  column={searchField.column}
                  placeholder={searchField.placeholder}
                />
              )}
            </div>
            {tabsList && tabsList}
            {filters && filters}
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(
                  (header) =>
                    // Render only if the column is visible
                    visibleColumns[header.id] && (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ),
                )}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map(
                    (cell) =>
                      // Render only if the cell's column is visible
                      visibleColumns[cell.column.id] && (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ),
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {table.getRowModel().rows.length > 0 && showPagination && (
        <DataTablePagination table={table} />
      )}
    </div>
  );
}
