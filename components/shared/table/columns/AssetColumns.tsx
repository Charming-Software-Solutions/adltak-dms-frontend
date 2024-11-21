"use client";

import Iamge from "next/image";
import AssetForm, {
  useAssetForm,
} from "@/app/(root)/assets/components/AssetForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ASSET_STATUS, imagePlaceholder } from "@/constants";
import { deleteAsset } from "@/lib/actions/asset.actions";
import { getAssetTypes } from "@/lib/actions/asset.classifcations.actions";
import { formatDateTime } from "@/lib/utils";
import { Asset } from "@/types/asset";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
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
import { UserRoleEnum } from "@/enums";
import { hasPermission } from "@/lib/auth";
import { getProducts } from "@/lib/actions/product.actions";
import { Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const visibleAssetColumns = (userRole: UserRoleEnum) => {
  return createColumnConfig({
    desktop: {
      thumbnail: true,
      name: true,
      code: true,
      product: true,
      type: true,
      status: true,
      created_at: true,
      actions: hasPermission(userRole, [
        UserRoleEnum.ADMIN,
        UserRoleEnum.LOGISTICS_SPECIALIST,
      ]),
    },
    mobile: {
      thumbnail: true,
      name: true,
      code: true,
      type: true,
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
        <ResponsiveDialogFooter>
          <div className="dialog-footer">
            <Button
              variant="outline"
              onClick={() => {
                setOpenDialog(false);
                form.reset();
              }}
              className="w-full"
            >
              Cancel
            </Button>
            <Button
              onClick={form.handleSubmit((values) =>
                onSubmit(values, setOpenDialog),
              )}
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              Save Changes
            </Button>
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
            <Button variant={"outline"}>
              <Eye className="size-4 mr-2" /> View
            </Button>
          </ResponsiveDialogTrigger>
          <ResponsiveDialogContent className="md:min-w-[10rem]">
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
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "type",
    accessorFn: (row) => row.type.name,
    header: "Type",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      return <Badge variant={"secondary"}>{ASSET_STATUS[status]}</Badge>;
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
