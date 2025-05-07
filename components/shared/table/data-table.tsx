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
  VisibilityState,
  flexRender,
  Table as ReactTable,
} from "@tanstack/react-table";
import React, { PropsWithChildren } from "react";
import { DataTablePagination } from "./data-table-pagination";
import { cn } from "@/lib/utils";

export interface DataTableProps<TData, TValue> {
  table: ReactTable<TData>;
  visibleColumns?: VisibilityState;
  showPagination?: boolean;
  className?: string;
}

export function DataTable<TData, TValue>({
  table,
  visibleColumns = {},
  showPagination = true,
  children,
  className,
}: PropsWithChildren<
  DataTableProps<TData, TValue> & {
    visibleColumns?: Record<string, boolean>;
  }
>) {
  return (
    <div className={cn("flex flex-col gap-2.5 overflow-auto", className)}>
      {children}
      <div className="rounded-md border overflow-hidden">
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
                  colSpan={table.getAllColumns().length}
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
