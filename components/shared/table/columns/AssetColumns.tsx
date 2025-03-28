"use client";

import AssetForm, {
  useAssetForm,
} from "@/app/(root)/assets/components/AssetForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ASSET_STATUS, imagePlaceholder } from "@/constants";
import { UserRoleEnum } from "@/enums";
import { deleteAsset, updateAssetStatus } from "@/lib/actions/asset.actions";
import { getAssetTypes } from "@/lib/actions/asset.classifcations.actions";
import { getClassifications } from "@/lib/actions/classification.actions";
import { hasPermission } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { Asset } from "@/types/asset";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
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
import StatusDropdown from "../../StatusDropDown";
import DialogFormButton from "../../buttons/DialogFormButton";
import DeleteDialog from "../../dialogs/DeleteDialog";
import EditDialog from "../../dialogs/EditDialog";
import { createColumnConfig } from "../column.config";
import { DataTableColumnHeader } from "../data-table-column-header";

export const visibleAssetColumns = (userRole: UserRoleEnum[]) => {
  return createColumnConfig({
    desktop: {
      thumbnail: true,
      agency: true,
      name: true,
      code: true,
      product: true,
      type: true,
      stock: true,
      status: true,
      area: true,
      brand: true,
      created_at: true,
      actions: hasPermission(userRole, [
        UserRoleEnum.ADMIN,
        UserRoleEnum.LOGISTICS_TEAM_MEMBER,
      ]),
    },
    mobile: {
      thumbnail: true,
      agency: true,
      name: true,
      code: true,
      product: true,
      type: true,
      stock: true,
      status: true,
      area: true,
      brand: true,
      created_at: true,
      actions: hasPermission(userRole, [
        UserRoleEnum.ADMIN,
        UserRoleEnum.LOGISTICS_TEAM_MEMBER,
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
      const brands = await getClassifications("product_brand");
      return { assetTypes, brands };
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
          brands={data?.brands ?? []}
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
              onClick={form.handleSubmit((values) =>
                onSubmit(values, setOpenDialog),
              )}
              disabled={form.formState.isSubmitting}
              loading={form.formState.isSubmitting}
            >
              Save Changes
            </DialogFormButton>
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
          alt="Asset image"
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
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "agency",
    header: "Agency",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "brand",
    header: "Brand",
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="py-1 rounded-md [&>svg]:size-3.5">
          {row.original.brand.name}
        </Badge>
      );
    },
  },
  {
    accessorKey: "type",
    accessorFn: (row) => row.type.name,
    header: "Type",
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="py-1 rounded-md [&>svg]:size-3.5">
          {row.original.type.name}
        </Badge>
      );
    },
  },
  { accessorKey: "stock", header: "Total QTY" },
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <StatusDropdown
          id={row.original.id}
          mutationKey="update-asset-status"
          currentStatus={status}
          statuses={ASSET_STATUS}
          mutationFn={updateAssetStatus}
        />
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
