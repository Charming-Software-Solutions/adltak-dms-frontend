"use client";

import { Button } from "@/components/ui/button";
import { imagePlaceholder } from "@/constants";
import { Product } from "@/types/product";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ResponsiveDialog from "../../ResponsiveDialog";
import { deleteProduct } from "@/lib/actions/product.actions";

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
      const router = useRouter();
      const [openDialog, setOpenDialog] = useState(false);

      return (
        <div className="flex items-center gap-2">
          <Button size={"icon"} variant={"outline"}>
            <Pen className="size-4" />
          </Button>
          <ResponsiveDialog
            open={openDialog}
            setOpen={setOpenDialog}
            title={"Delete Product"}
            description="Product deletion action"
            trigger={
              <Button size={"icon"} variant={"outline"} className="w-10">
                <Trash className="h-4 w-4" />
              </Button>
            }
            footer={
              <div className="flex flex-row flex-grow w-full gap-2">
                <Button
                  className="flex-grow w-full"
                  variant={"outline"}
                  onClick={() => setOpenDialog(false)}
                >
                  <span>Cancel</span>
                </Button>
                <Button
                  className="flex-grow w-full"
                  variant={"destructive"}
                  onClick={async () => {
                    await deleteProduct(product.id);
                    setOpenDialog(false);
                    router.refresh();
                  }}
                >
                  Delete
                </Button>
              </div>
            }
          >
            <p className="p-medium-16 md:p-medium-14 text-gray-500 px-4 md:px-0">
              Are you sure you want to delete the product?
            </p>
          </ResponsiveDialog>
        </div>
      );
    },
  },
];
