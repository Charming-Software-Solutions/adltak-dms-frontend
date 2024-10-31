"use client";

import { Button } from "@/components/ui/button";
import { imagePlaceholder } from "@/constants";
import { Product } from "@/types/product";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteProduct } from "@/lib/actions/product.actions";
import DeleteDialog from "../../dialogs/DeleteDialog";
import { ApiResponse } from "@/types/api";

export const visibleProductColumns = {
  desktop: {
    thumbnail: true,
    name: true,
    sku: true,
    brand: true,
    category: true,
    type: true,
    stock: true,
    actions: true,
  },
  mobile: {
    name: true,
    sku: true,
    brand: true,
    stock: true,
  },
};

export const ProductColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "thumbnail",
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
    header: "Name",
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "brand",
    accessorFn: (row) => row.brand.name,
    header: "Brand",
  },
  {
    accessorKey: "category",
    accessorFn: (row) => row.category.name,
    header: "Category",
  },
  {
    accessorKey: "type",
    accessorFn: (row) => row.type.name,
    header: "Type",
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button size={"icon"} variant={"outline"}>
            <Pen className="size-4" />
          </Button>
          <DeleteDialog
            title={"Delete Product"}
            deleteAction={async () => await deleteProduct(product.id)}
            placeholder={" Are you sure you want to delete the product?"}
          />
        </div>
      );
    },
  },
];
