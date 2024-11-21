"use client";

import ProductForm, {
  useProductForm,
} from "@/app/(root)/products/components/ProductForm";
import { Button } from "@/components/ui/button";
import { imagePlaceholder } from "@/constants";
import { UserRoleEnum } from "@/enums";
import { deleteProduct } from "@/lib/actions/product.actions";
import {
  getBrands,
  getCategories,
  getTypes,
} from "@/lib/actions/product.classications.actions";
import { hasPermission } from "@/lib/auth";
import { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import React, { useState } from "react";
import DeleteDialog from "../../dialogs/DeleteDialog";
import EditDialog from "../../dialogs/EditDialog";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "../../ResponsiveDialog";
import { createColumnConfig } from "../column.config";
import { DataTableColumnHeader } from "../data-table-column-header";
import { Eye, MapPin } from "lucide-react";

export const visibleProductColumns = (userRole: UserRoleEnum) => {
  return createColumnConfig({
    desktop: {
      thumbnail: true,
      name: true,
      sku: true,
      brand: true,
      category: true,
      type: true,
      stock: true,
      expiration: true,
      area: true,
      actions: hasPermission(userRole, [
        UserRoleEnum.ADMIN,
        UserRoleEnum.LOGISTICS_SPECIALIST,
      ]),
    },
    mobile: {
      name: true,
      brand: true,
      stock: true,
      area: true,
      actions: hasPermission(userRole, [
        UserRoleEnum.ADMIN,
        UserRoleEnum.LOGISTICS_SPECIALIST,
      ]),
    },
  });
};

const ProductActionsCell = React.memo(({ product }: { product: Product }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const { form, onSubmit } = useProductForm({ product, mode: "edit" });

  const { data } = useQuery({
    queryKey: ["edit-product"],
    queryFn: async () => {
      const [brands, categories, productTypes] = await Promise.all([
        getBrands(),
        getCategories(),
        getTypes(),
      ]);
      return { brands, categories, productTypes };
    },
  });

  return (
    <div className="flex items-center gap-2">
      <EditDialog
        title="Edit Product"
        open={openDialog}
        setOpen={setOpenDialog}
      >
        <OverlayScrollbarsComponent
          defer
          options={{
            scrollbars: {
              autoHide: "leave",
              autoHideDelay: 200,
              theme: "os-theme-dark",
            },
          }}
          className="max-h-[33rem] pb-4 md:pb-0"
        >
          <ProductForm
            form={form}
            className="px-4 md:px-1"
            brands={data?.brands ?? []}
            categories={data?.categories ?? []}
            types={data?.productTypes ?? []}
          />
        </OverlayScrollbarsComponent>
        <ResponsiveDialogFooter className="px-1">
          <div className="flex flex-row w-full gap-2">
            <Button
              className="w-full"
              variant={"outline"}
              onClick={() => setOpenDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="w-full"
              onClick={form.handleSubmit((values) =>
                onSubmit(values, setOpenDialog),
              )}
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              Save Changes
            </Button>
          </div>
        </ResponsiveDialogFooter>
      </EditDialog>
      <DeleteDialog
        title={"Delete Product"}
        deleteAction={async () => await deleteProduct(product.id)}
        placeholder={"Are you sure you want to delete the product?"}
      />
    </div>
  );
});

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
          height={58}
          width={58}
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
  { accessorKey: "stock", header: "Stock" },
  {
    accessorKey: "area",
    header: "Area",
    cell: ({ row }) => {
      const [openDialog, setOpenDialog] = useState(false);

      return (
        <ResponsiveDialog open={openDialog} setOpen={setOpenDialog}>
          <ResponsiveDialogTrigger>
            <Button variant={"outline"} size={"icon"}>
              <Eye className="size-6" />
            </Button>
          </ResponsiveDialogTrigger>
          <ResponsiveDialogContent className="md:max-w-md">
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle>Area</ResponsiveDialogTitle>
            </ResponsiveDialogHeader>
            <span className="font-medium text-sm">
              {row.original.area ?? "No area found."}
            </span>
          </ResponsiveDialogContent>
        </ResponsiveDialog>
      );
    },
  },
  {
    accessorKey: "expiration",
    header: ({ column }) => (
      <div className="hidden md:table-cell">
        <DataTableColumnHeader column={column} title="Expiration" />
      </div>
    ),
    cell: ({ row }) => {
      const expirationDate = new Date(row.original.expiration);
      return expirationDate.toLocaleDateString();
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ProductActionsCell
        key={`actions-${row.original.id}`}
        product={row.original}
      />
    ),
  },
];
