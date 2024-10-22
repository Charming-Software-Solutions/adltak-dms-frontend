"use client";

import { imagePlaceholder } from "@/constants";
import { DistributionProduct } from "@/types/distribution";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export const visibileDistributionProductColumns = {
  desktop: {
    thumbnail: true,
    name: true,
    sku: true,
    brand: true,
    category: true,
    quantity: true,
  },
  mobile: {
    thumbnail: true,
    name: true,
    sku: true,
    brand: true,
    category: true,
    quantity: true,
  },
};

export const DistributionProductColumns: ColumnDef<DistributionProduct>[] = [
  {
    accessorKey: "thumbnail",
    header: () => (
      <div className="w-[1rem]">
        <span className="sr-only">Image</span>
      </div>
    ),
    cell: ({ row }) => {
      const product = row.original.product;

      return (
        <div className="flex flex-col gap-2">
          <Image
            alt="Product image"
            priority
            className="aspect-square rounded-md object-cover border p-1"
            height={50}
            width={50}
            src={product.thumbnail ? product.thumbnail : imagePlaceholder}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    accessorFn: (row) => row.product.name,
    header: "Name",
  },
  {
    accessorKey: "brand",
    accessorFn: (row) => row.product.brand,
    header: "Brand",
  },
  {
    accessorKey: "category",
    accessorFn: (row) => row.product.category.name,
    header: "Category",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "sku",
    accessorFn: (row) => row.product.sku,
    header: "SKU",
  },
];
