"use client";

import AssetForm, {
  useAssetForm,
} from "@/app/(root)/assets/components/AssetForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { imagePlaceholder } from "@/constants";
import { FormModeEnum, UserRoleEnum } from "@/enums";
import { deleteAsset } from "@/lib/actions/asset.actions";
import { getAssetTypes } from "@/lib/actions/asset.classifcations.actions";
import { getClassifications } from "@/lib/actions/classification.actions";
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
import DialogFormButton from "../../buttons/DialogFormButton";
import DeleteDialog from "../../dialogs/DeleteDialog";
import EditDialog from "../../dialogs/EditDialog";
import { createColumnConfig } from "../column.config";
import { DataTableColumnHeader } from "../data-table-column-header";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { getProjectByAsset } from "@/lib/actions/project.actions";

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
    mode: FormModeEnum.EDIT,
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
          mode={FormModeEnum.EDIT}
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const asset = row.original;
      const [openDialog, setOpenDialog] = useState(false);
      const { data: project } = useQuery({
        queryKey: ["fetch-project-by-asset", row.id],
        queryFn: async () => await getProjectByAsset(asset.name),
        select: (response) => response.data,
      });
      const productsInProject = [
        ...new Map(
          project?.products.map((projectProduct) => [
            projectProduct.product.brand.name,
            projectProduct,
          ]),
        ).values(),
      ];

      // TODO: make the status from asset conditionally render the
      // asset issue
      // - add a resolve issue button that will resolve the selected
      // issue
      // - only allow 1 issue at a time

      return (
        <ResponsiveDialog open={openDialog} setOpen={setOpenDialog}>
          <ResponsiveDialogTrigger>
            <Button variant={"outline"}>
              <Eye className="size-4 mr-2" /> View
            </Button>
          </ResponsiveDialogTrigger>
          <ResponsiveDialogContent className="md:max-w-md">
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle>Asset Status</ResponsiveDialogTitle>
            </ResponsiveDialogHeader>
            <div className="grid gap-3 text-sm">
              <Separator className="my-1" />
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">
                  Status:{" "}
                  <Badge variant={"outline"} className="rounded-md">
                    Available
                  </Badge>
                </dt>
                <dd>{asset.stock} QTY</dd>
              </div>
              <Separator className="my-1" />
              <span>Assigned Project</span>
              <div className="space-y-2 bg-muted border p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">In Use: </dt>
                  <dd>
                    {project?.assets.find(
                      (projectAsset) => projectAsset.asset.name === asset.name,
                    )?.quantity || 0}{" "}
                    QTY
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Project Name: </dt>
                  <dd>{project?.name}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">
                    BA Reference Number:{" "}
                  </dt>
                  <dd>{project?.ba_reference_number}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Brands: </dt>
                  <dd>
                    {productsInProject
                      .map(
                        (projectProduct) => projectProduct.product.brand.name,
                      )
                      .join(", ")}
                  </dd>
                </div>
              </div>
              <Separator className="my-1" />
              <span>Asset Issue</span>
              <div className="space-y-2 bg-muted border p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Damaged: </dt>
                  <dd>Some qty</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">For Repair: </dt>
                  <dd>Some qty</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Lost: </dt>
                  <dd>Some qty</dd>
                </div>
              </div>
            </div>
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
