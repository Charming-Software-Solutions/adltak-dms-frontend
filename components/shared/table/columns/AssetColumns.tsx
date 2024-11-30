"use client";

import AssetForm, {
  useAssetForm,
} from "@/app/(root)/assets/components/AssetForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Separator } from "@/components/ui/separator";
import { ASSET_STATUS, imagePlaceholder } from "@/constants";
import { UserRoleEnum } from "@/enums";
import { deleteAsset } from "@/lib/actions/asset.actions";
import { getAssetTypes } from "@/lib/actions/asset.classifcations.actions";
import { getProducts } from "@/lib/actions/product.actions";
import { hasPermission } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { Asset } from "@/types/asset";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink, Eye } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "../../ResponsiveDialog";
import DeleteDialog from "../../dialogs/DeleteDialog";
import EditDialog from "../../dialogs/EditDialog";
import { createColumnConfig } from "../column.config";
import { DataTableColumnHeader } from "../data-table-column-header";
import DialogFormButton from "../../buttons/DialogFormButton";

export const visibleAssetColumns = (userRole: UserRoleEnum) => {
  return createColumnConfig({
    desktop: {
      thumbnail: true,
      name: true,
      identifiera: true,
      product: true,
      type: true,
      stock: true,
      status: true,
      area: true,
      created_at: true,
      actions: hasPermission(userRole, [
        UserRoleEnum.ADMIN,
        UserRoleEnum.LOGISTICS_SPECIALIST,
      ]),
    },
    mobile: {
      thumbnail: true,
      name: true,
      identifiera: true,
      type: true,
      stock: true,
      area: true,
      actions: hasPermission(userRole, [
        UserRoleEnum.ADMIN,
        UserRoleEnum.LOGISTICS_SPECIALIST,
      ]),
    },
  });
};

const AssetActionsCell = React.memo(({ asset }: { asset: Asset }) => {
  const [openDialog, setOpenDialog] = useState(false);

  const { form, onSubmit } = useAssetForm({
    asset,
    mode: "edit",
  });

  const { data } = useQuery({
    queryKey: ["edit-asset", asset.id],
    queryFn: async () => {
      const assetTypes = await getAssetTypes();
      const products = await getProducts();
      return { assetTypes, products };
    },
  });

  return (
    <div className="flex items-center gap-2">
      <EditDialog
        key={`edit-dialog-${asset.id}`}
        title="Edit Asset"
        open={openDialog}
        setOpen={setOpenDialog}
      >
        <AssetForm
          key={`form-${asset.id}`}
          form={form}
          assetTypes={data?.assetTypes ?? []}
          products={data?.products ?? []}
        />
        <ResponsiveDialogFooter className="px-1">
          <div className="dialog-footer">
            <Button
              variant={"outline"}
              className="flex-grow w-full"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <DialogFormButton
              text="Save Changes"
              onClick={form.handleSubmit((values) =>
                onSubmit(values, setOpenDialog),
              )}
              disabled={form.formState.isSubmitting}
              loading={form.formState.isSubmitting}
            />
          </div>
        </ResponsiveDialogFooter>
      </EditDialog>

      <DeleteDialog
        title="Delete Asset"
        deleteAction={async () => await deleteAsset(asset.id)}
        placeholder="Are you sure you want to delete the asset?"
      />
    </div>
  );
});

export const AssetColumns: ColumnDef<Asset>[] = [
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
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => {
      const product = row.original.product;
      const [openDialog, setOpenDialog] = useState(false);

      return (
        <ResponsiveDialog open={openDialog} setOpen={setOpenDialog}>
          <ResponsiveDialogTrigger>
            <Button variant={"outline"} size={"icon"}>
              <ExternalLink className="size-4" />
            </Button>
          </ResponsiveDialogTrigger>
          <ResponsiveDialogContent className="md:min-w-[20rem]">
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle>Product</ResponsiveDialogTitle>
            </ResponsiveDialogHeader>
            {product ? (
              <Card className="flex items-center justify-between p-2">
                <div className="flex items-center gap-2">
                  <Image
                    src={product?.thumbnail ?? imagePlaceholder}
                    alt={"item-thumbnail"}
                    className="h-[3.9rem] w-auto object-contain rounded-sm"
                    priority
                    width={100}
                    height={100}
                  />
                  <div className="grid flex-1 gap-1.5 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {product.name}
                    </span>
                    <div className="flex gap-2 items-center text-xs">
                      <span className="truncate font-semibold">
                        {product.sku}{" "}
                      </span>
                      <Separator className="h-2" orientation="vertical" />
                      <span className="truncate">{product.brand.name} </span>
                      <Separator className="h-2" orientation="vertical" />
                      <span className="truncate">{product.category.name} </span>
                      <Separator className="h-2" orientation="vertical" />
                      <span className="truncate">{product.type.name} </span>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <span>No product.</span>
            )}
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
      const asset = row.original;

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
                <dt className="text-muted-foreground">Asset Code</dt>
                <div className="flex items-center">
                  <dd>{asset.code}</dd>
                  <CopyButton value={asset.code} className="ml-2" />
                </div>
              </div>
              <Separator className="my-1" />
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">BA Reference Number</dt>
                <div className="flex items-center">
                  <dd>{asset.ba_reference_number}</dd>
                  <CopyButton
                    value={asset.ba_reference_number!}
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
  {
    accessorKey: "type",
    accessorFn: (row) => row.type.name,
    header: "Type",
  },
  { accessorKey: "stock", header: "Stock" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      return <Badge variant={"secondary"}>{ASSET_STATUS[status]}</Badge>;
    },
  },
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
    accessorKey: "created_at",
    header: ({ column }) => (
      <div className="hidden md:table-cell">
        <DataTableColumnHeader column={column} title="Created" />
      </div>
    ),
    cell: ({ row }) => {
      const dateString = row.getValue("created_at");
      return (
        <div className="hidden md:table-cell">{formatDateTime(dateString)}</div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <AssetActionsCell
        key={`actions-${row.original.id}`}
        asset={row.original}
      />
    ),
  },
];
