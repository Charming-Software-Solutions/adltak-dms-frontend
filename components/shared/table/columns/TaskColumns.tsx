"use client";

import TaskForm, { useTaskForm } from "@/app/(root)/tasks/components/TaskForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserRoleEnum } from "@/enums";
import { useResponsive } from "@/hooks";
import { getDistributions } from "@/lib/actions/distribution.actions";
import { deleteTask } from "@/lib/actions/task.actions";
import { hasPermission } from "@/lib/auth";
import { cn, formatDateTime } from "@/lib/utils";
import { DistributionType } from "@/types/distribution";
import { Task } from "@/types/task";
import {
  BackpackIcon,
  DownloadIcon,
  PersonIcon,
  UploadIcon,
} from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import DeleteDialog from "../../dialogs/DeleteDialog";
import EditDialog from "../../dialogs/EditDialog";
import ViewItemsDialog from "../../dialogs/ViewItemsDialog";
import { ResponsiveDialogFooter } from "../../ResponsiveDialog";
import TaskStatusDropdown from "../../TaskStatusDropdown";
import { createColumnConfig } from "../column.config";
import { DataTableColumnHeader } from "../data-table-column-header";
import { getEmployees } from "@/lib/actions/employee.actions";

export const visibleTaskColumns = (userRole: UserRoleEnum) => {
  return createColumnConfig({
    desktop: {
      warehouse_person: true,
      distribution_client: true,
      distribution_id: true,
      distribution_type: true,
      distribution_items: true,
      status_dropdown: hasPermission(userRole, [
        UserRoleEnum.ADMIN,
        UserRoleEnum.LOGISTICS_SPECIALIST,
        UserRoleEnum.WAREHOUSE_WORKER,
      ]),
      status_badge: hasPermission(userRole, [UserRoleEnum.PROJECT_HANDLER]),
      created_at: true,
      actions: hasPermission(userRole, [
        UserRoleEnum.ADMIN,
        UserRoleEnum.PROJECT_HANDLER,
      ]),
    },
    mobile: {
      distribution_client: true,
      distribution_id: true,
      distribution_type: true,
      distribution_items: true,
      status_dropdown: hasPermission(userRole, [
        UserRoleEnum.ADMIN,
        UserRoleEnum.LOGISTICS_SPECIALIST,
        UserRoleEnum.WAREHOUSE_WORKER,
      ]),
      status_badge: hasPermission(userRole, [
        UserRoleEnum.ADMIN,
        UserRoleEnum.PROJECT_HANDLER,
      ]),
      created_at: false,
      actions: hasPermission(userRole, [
        UserRoleEnum.ADMIN,
        UserRoleEnum.PROJECT_HANDLER,
      ]),
    },
  });
};

export const TaskColumns: ColumnDef<Task>[] = [
  {
    accessorKey: "warehouse_person",
    accessorFn: (row) => row.warehouse_person,
    header: "Warehouse Personnel",
    cell: ({ row }) => {
      const isDesktop = useResponsive("desktop");

      return (
        <div className="flex items-center space-x-2">
          {isDesktop && <PersonIcon className="size-4" />}
          <span>{row.original.warehouse_person.name}</span>
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
            assets: distribution.assets ?? [],
          }}
        />
      );
    },
  },
  {
    accessorKey: "status_dropdown",
    header: "Status",
    cell: ({ row }) => {
      const type = row.original.distribution.type;
      const status = row.original.status;

      return (
        <TaskStatusDropdown
          key={`task-status-${row.original.id}`}
          id={row.original.id}
          currentStatus={status}
          type={type}
        />
      );
    },
  },
  {
    accessorKey: "status_badge",
    header: "Status",
    cell: ({ row }) => {
      return <Badge variant={"secondary"}>{row.original.status}</Badge>;
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
      const task = row.original;
      const [openDialog, setOpenDialog] = useState(false);
      const { form, onSubmit } = useTaskForm({ task, mode: "edit" });

      const { data } = useQuery({
        queryKey: ["edit-task"],
        queryFn: async () => {
          const distributions = await getDistributions();
          const warehousePersons = await getEmployees();
          const filteredWarehousePersons = warehousePersons.filter(
            (person) => person.user.role === UserRoleEnum.WAREHOUSE_WORKER,
          );
          return { distributions, filteredWarehousePersons };
        },
      });

      return (
        <div className="flex items-center gap-2">
          <EditDialog
            title="Edit Task"
            open={openDialog}
            setOpen={setOpenDialog}
          >
            <TaskForm
              form={form}
              distributions={data?.distributions ?? []}
              warehousePersons={data?.filteredWarehousePersons ?? []}
            />
            <ResponsiveDialogFooter>
              <div className="dialog-footer">
                <Button
                  variant={"outline"}
                  onClick={() => setOpenDialog(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
                <Button
                  className="w-full"
                  onClick={form.handleSubmit((values) =>
                    onSubmit(values, setOpenDialog),
                  )}
                >
                  Save Changes
                </Button>
              </div>
            </ResponsiveDialogFooter>
          </EditDialog>
          <DeleteDialog
            title="Delete Task"
            deleteAction={async () => await deleteTask(task.id)}
            placeholder="Are you sure you want to delete the task?"
          />
        </div>
      );
    },
  },
];
