"use client";
import DistributionForm, {
  useDistributionForm,
} from "@/app/(root)/distributions/components/DistributionForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteDistribution } from "@/lib/actions/distribution.actions";
import { cn, formatDateTime } from "@/lib/utils";
import { Distribution, DistributionType } from "@/types/distribution";
import {
  BackpackIcon,
  DownloadIcon,
  PersonIcon,
  UploadIcon,
} from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import DeleteDialog from "../../dialogs/DeleteDialog";
import EditDialog from "../../dialogs/EditDialog";
import ViewItemsDialog from "../../dialogs/ViewItemsDialog";
import { ResponsiveDialogFooter } from "../../ResponsiveDialog";
import { DataTableColumnHeader } from "../data-table-column-header";
import React from "react";
import { FormModeEnum, UserRoleEnum } from "@/enums";
import { hasPermission } from "@/lib/auth";
import { DISTRIBUTION_STATUSES } from "@/constants";
import DialogFormButton from "../../buttons/DialogFormButton";

export const visibleDistributionColumns = (userRole: UserRoleEnum) => ({
  desktop: {
    dist_id: true,
    distribution_type: true,
    product_count: false,
    asset_count: false,
    distribution_items: true,
    status: true,
    client: true,
    logistics_person: true,
    created_at: true,
    actions: hasPermission(userRole, [
      UserRoleEnum.ADMIN,
      UserRoleEnum.LOGISTICS_SPECIALIST,
    ]),
  },
  mobile: {
    dist_id: true,
    logistics_person: true,
    actions: hasPermission(userRole, [
      UserRoleEnum.ADMIN,
      UserRoleEnum.LOGISTICS_SPECIALIST,
    ]),
  },
});

const DistributionActionsCell = React.memo(
  ({ distribution }: { distribution: Distribution }) => {
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const { form, onSubmit } = useDistributionForm({
      distribution,
      mode: "edit",
    });

    return (
      <div className="flex items-center gap-2">
        <EditDialog
          title="Edit Distribution"
          open={openEditDialog}
          setOpen={setOpenEditDialog}
        >
          <DistributionForm form={form} mode={FormModeEnum.EDIT} />
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
                  onSubmit(values, setOpenEditDialog),
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
          title="Delete Distribution"
          deleteAction={async () => await deleteDistribution(distribution.id)}
          placeholder="Are you sure you want to delete the distribution?"
        />
      </div>
    );
  },
);

export const DistributionColumns: ColumnDef<Distribution>[] = [
  {
    accessorKey: "dist_id",
    header: "Distribuition ID",
    cell: ({ row }) => {
      return <span>#{row.original.dist_id}</span>;
    },
  },
  {
    accessorKey: "distribution_type",
    header: "Type",
    cell: ({ row }) => {
      const distributionType = row.original.type;

      const TypeIcon = ({
        type,
        className,
      }: {
        type: DistributionType;
        className?: string;
      }) => {
        return type === "IMPORT" ? (
          <DownloadIcon className={cn("size-4", className)} />
        ) : (
          <UploadIcon className={cn("size-4", className)} />
        );
      };
      return (
        <div className="flex items-center space-x-1">
          <TypeIcon type={distributionType} className="mr-1" />
          <span className="font-semibold">{distributionType}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "product_count",
    header: "Products",
    cell: ({ row }) => {
      return (
        <span className="items-center">{row.original.products.length}</span>
      );
    },
  },
  {
    accessorKey: "asset_count",
    header: "Assets",
    cell: ({ row }) => {
      return (
        <span className="items-center">
          {row.original.assets && row.original.assets.length}
        </span>
      );
    },
  },
  {
    accessorKey: "distribution_items",
    header: "Items",
    cell: ({ row }) => {
      const distribution = row.original;

      return (
        <ViewItemsDialog
          items={{
            products: distribution.products,
            assets: distribution.assets ?? [],
          }}
        />
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge variant={"secondary"}>
          {DISTRIBUTION_STATUSES[row.original.status]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <BackpackIcon className="size-4" />
          <span>{row.original.client}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "logistics_person",
    header: "Logistics Team Member",
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <PersonIcon className="size-4" />
          <span>{row.original.employee}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <div className="hidden md:table-cell">
        <DataTableColumnHeader column={column} title="Date" />
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
      <DistributionActionsCell
        key={`actions-${row.original.id}`}
        distribution={row.original}
      />
    ),
  },
];
