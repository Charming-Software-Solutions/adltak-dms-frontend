"use client";

import { ASSET_STATUS, imagePlaceholder } from "@/constants";
import { Asset, AssetStatus } from "@/types/asset";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { createColumnConfig } from "../column.config";
import { DataTableColumnHeader } from "../data-table-column-header";
import { formatDateTime } from "@/lib/utils";
import StatusDropdown from "../../StatusDropDown";
import DeleteDialog from "../../dialogs/DeleteDialog";
import { deleteAsset, updateAssetStatus } from "@/lib/actions/asset.actions";

export const visibleAssetColumns = createColumnConfig({
  desktop: {
    thumbnail: true,
    name: true,
    code: true,
    type: true,
    status: true,
    created_at: true,
    actions: true,
  },
  mobile: {
    name: true,
    code: true,
    type: true,
  },
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

      return (
        <StatusDropdown<AssetStatus, Asset>
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
    cell: ({ row }) => {
      const asset = row.original;

      return (
        <DeleteDialog
          deleteAction={async () => await deleteAsset(asset.id)}
          placeholder="Are you sure you want to delete the asset?"
        />
      );
    },
  },
];
