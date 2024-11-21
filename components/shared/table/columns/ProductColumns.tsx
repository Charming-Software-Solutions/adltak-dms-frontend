"use client";

import ProductForm, {
  useProductForm,
} from "@/app/(root)/products/components/ProductForm";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Separator } from "@/components/ui/separator";
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
import { ExternalLink, Eye } from "lucide-react";
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

export const visibleProductColumns = (userRole: UserRoleEnum) => {
  return createColumnConfig({
    desktop: {
      thumbnail: true,
      name: true,
      sku: true,
      classifications: true,
      stock: true,
      expiration: true,
      identifiera: true,
      area: true,
      actions: hasPermission(userRole, [
        UserRoleEnum.ADMIN,
        UserRoleEnum.LOGISTICS_SPECIALIST,
      ]),
    },
    mobile: {
      name: true,
      classifications: true,
      stock: true,
      identifiera: true,
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
    accessorKey: "classifications",
    header: "Classifications",
    cell: ({ row }) => {
      const [openDialog, setOpenDialog] = useState(false);
      const product = row.original;

      return (
        <ResponsiveDialog open={openDialog} setOpen={setOpenDialog}>
          <ResponsiveDialogTrigger>
            <Button variant={"outline"}>
              <Eye className="size-4 mr-2" /> View
            </Button>
          </ResponsiveDialogTrigger>
          <ResponsiveDialogContent className="md:max-w-[25rem]">
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle>Classifications</ResponsiveDialogTitle>
            </ResponsiveDialogHeader>
            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Brand</dt>
                <dd>{product.brand.name}</dd>
              </div>
              <Separator className="my-1" />
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Category</dt>
                <dd>{product.category.name}</dd>
              </div>
              <Separator className="my-1" />
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Type</dt>
                <dd>{product.type.name}</dd>
              </div>
            </div>
          </ResponsiveDialogContent>
        </ResponsiveDialog>
      );
    },
  },
  {
    accessorKey: "identifiera",
    header: "Indentifiers",
    cell: ({ row }) => {
      const [openDialog, setOpenDialog] = useState(false);
      const product = row.original;

      return (
        <ResponsiveDialog open={openDialog} setOpen={setOpenDialog}>
          <ResponsiveDialogTrigger>
            <Button variant={"outline"}>
              <Eye className="size-4 mr-2" /> View
            </Button>
          </ResponsiveDialogTrigger>
          <ResponsiveDialogContent className="md:max-w-[28rem]">
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle>Identifiers</ResponsiveDialogTitle>
            </ResponsiveDialogHeader>
            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Product SKU</dt>
                <div className="flex items-center">
                  <dd>{product.sku}</dd>
                  <CopyButton value={product.sku} className="ml-2" />
                </div>
              </div>
              <Separator className="my-1" />
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">BA Reference Number</dt>
                <div className="flex items-center">
                  <dd>{product.ba_reference_number}</dd>
                  <CopyButton
                    value={product.ba_reference_number!}
                    className="ml-2"
                  />
                </div>
              </div>
            </div>
          </ResponsiveDialogContent>
        </ResponsiveDialog>
      );
    },
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
              <ExternalLink className="size-4" />
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
