"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatDateTime } from "@/lib/utils";
import { Task } from "@/types/task";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ItemCard from "../../card/ItemCard";
import ResponsiveDialog from "../../ResponsiveDialog";
import { DataTableColumnHeader } from "../data-table-column-header";
import StatusDropdown from "../../StatusDropdown";
import {
  BackpackIcon,
  DownloadIcon,
  PersonIcon,
  UploadIcon,
} from "@radix-ui/react-icons";
import { deleteTask } from "@/lib/actions/task.actions";
import { Badge } from "@/components/ui/badge";
import { DistributionType } from "@/types/distribution";
import { useMediaQuery } from "react-responsive";
import ViewItemsDialog from "../../dialogs/ViewItemsDialog";

export const visibleTaskColumns = {
  desktop: {
    warehouse_person: true,
    distribution_client: true,
    distribution_id: true,
    distribution_type: true,
    distribution_items: true,
    status: true,
    created_at: true,
    actions: true,
  },
  mobile: {
    distribution_client: true,
    distribution_id: true,
    distribution_type: true,
    distribution_items: true,
    status: true,
    created_at: true,
    actions: true,
  },
};

export const TaskColumns: ColumnDef<Task>[] = [
  {
    accessorKey: "warehouse_person",
    accessorFn: (row) => row.employee,
    header: "Warehouse Person",
    cell: ({ row }) => {
      const isDesktop = useMediaQuery({ query: "(min-width: 1224px)" });

      return (
        <div className="flex items-center space-x-2">
          {isDesktop && <PersonIcon className="size-4" />}
          <span>{row.original.employee}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "distribution_client",
    accessorFn: (row) => row.distribution.client,
    header: "Client",
    cell: ({ row }) => {
      const isDesktop = useMediaQuery({ query: "(min-width: 1224px)" });

      return (
        <div className="flex items-center space-x-2">
          {isDesktop && <BackpackIcon className="size-4" />}
          <span>{row.original.distribution.client}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "distribution_id",
    accessorFn: (row) => row.distribution.dist_id,
    header: "Distribution ID",
    cell: ({ row }) => {
      return <span>#{row.original.distribution.dist_id}</span>;
    },
  },
  {
    accessorKey: "distribution_type",
    accessorFn: (row) => row.distribution.type,
    header: "Type",
    cell: ({ row }) => {
      const distributionType = row.original.distribution.type;

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
      // return (
      //   <Badge variant={"outline"} className="rounded-lg items-center">
      //     <TypeIcon type={distributionType} className="mr-1" />
      //     {distributionType}
      //   </Badge>
      // );
      return (
        <div className="flex items-center space-x-1">
          <TypeIcon type={distributionType} className="mr-1" />
          <span className="font-semibold">{distributionType}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "distribution_items",
    header: "Items",
    cell: ({ row }) => {
      const distribution = row.original.distribution;

      return (
        <ViewItemsDialog
          items={{
            products: distribution.products,
          }}
        />
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const type = row.original.distribution.type;
      const status = row.original.status;

      return (
        <StatusDropdown
          id={row.original.id}
          currentStatus={status} // Ensure status matches one of the enum types
          type={type}
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
      const router = useRouter();
      const [openDialog, setOpenDialog] = useState(false);

      return (
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
                  await deleteTask(row.original.id);
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
      );
    },
  },
];
