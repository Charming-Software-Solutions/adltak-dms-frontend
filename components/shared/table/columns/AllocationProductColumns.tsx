"use client";

import { imagePlaceholder } from "@/constants";
import { DistributionProduct } from "@/types/distribution";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { createColumnConfig } from "../column.config";
import { DataTableColumnHeader } from "../data-table-column-header";
import { formatExpiration } from "@/lib/utils";

export const visibleAllocationProductColumns = () => {
  return createColumnConfig({
    desktop: {
      thumbnail: true,
      name: true,
      sku: true,
      ba_reference_number: true,
      quantity: true,
      expiration: true,
    },
    mobile: {
      thumbnail: true,
      name: true,
      sku: true,
      ba_reference_number: true,
      quantity: true,
      expiration: true,
    },
  });
};

export const AllocationProductColumns: ColumnDef<DistributionProduct>[] = [
  {
    accessorKey: "thumbnail",
    accessorFn: (row) => row.product.thumbnail,
    header: () => (
      <div className="w-[1rem]">
        <span className="sr-only">Image</span>
      </div>
    ),
    cell: ({ row }) => {
      return (
        <Image
          alt="Product image"
          priority
          className="aspect-square rounded-md object-cover"
          height={64}
          width={64}
          src={
            row.getValue("thumbnail")
              ? row.getValue("thumbnail")
              : imagePlaceholder
          }
        />
      );
    },
  },
  {
    accessorKey: "name",
    accessorFn: (row) => row.product.name,
    header: "Name",
  },
  {
    accessorKey: "sku",
    accessorFn: (row) => row.product.sku,
    header: "SKU",
  },
  {
    accessorKey: "ba_reference_number",
    header: "BA Ref Number",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "expiration",
    header: ({ column }) => (
      <div className="hidden md:table-cell">
        <DataTableColumnHeader column={column} title="Expiration" />
      </div>
    ),
    cell: ({ row }) => {
      return <strong>{formatExpiration(row.original.expiration)}</strong>;
    },
  },
];
