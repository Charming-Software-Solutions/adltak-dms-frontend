"use client";
import { Badge } from "@/components/ui/badge";
import { deleteDistribution } from "@/lib/actions/distribution.actions";
import { formatDateTime } from "@/lib/utils";
import { Distribution } from "@/types/distribution";
import { BackpackIcon, PersonIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import DeleteDialog from "../../dialogs/DeleteDialog";
import ViewItemsDialog from "../../dialogs/ViewItemsDialog";
import { DataTableColumnHeader } from "../data-table-column-header";

export const visibleDistributionColumns = {
  desktop: {
    dist_id: true,
    product_count: true,
    asset_count: true,
    status: true,
    client: true,
    logistics_person: true,
    created_at: true,
    actions: true,
  },
  mobile: {
    dist_id: true,
    logistics_person: true,
    actions: true,
  },
};

export const DistributionColumns: ColumnDef<Distribution>[] = [
  {
    accessorKey: "dist_id",
    header: "Distribuition ID",
    cell: ({ row }) => {
      return <span>#{row.original.dist_id}</span>;
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
      return <span>20</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <Badge variant={"secondary"}>{row.original.status}</Badge>;
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
    header: "Logistics Person",
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
    cell: ({ row }) => {
      const distribution = row.original;

      return (
        <div className="flex items-center gap-2">
          <ViewItemsDialog
            items={{
              products: distribution.products,
            }}
          />
          <DeleteDialog
            title="Delete Distribution"
            deleteAction={async () => await deleteDistribution(distribution.id)}
            placeholder="Are you sure you want to delete the distribution?"
          />
        </div>
      );
    },
  },
];
