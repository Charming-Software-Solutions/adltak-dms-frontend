"use client";

import TaskForm, { useTaskForm } from "@/app/(root)/tasks/components/TaskForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormModeEnum, UserRoleEnum } from "@/enums";
import { useResponsive } from "@/hooks";
import { getEmployees } from "@/lib/actions/employee.actions";
import { getProjects } from "@/lib/actions/project.actions";
import { deleteTask, updateTaskStatus } from "@/lib/actions/task.actions";
import { hasPermission } from "@/lib/auth";
import { formatDateTime, showSuccessMessage } from "@/lib/utils";
import { Task } from "@/types/task";
import { BackpackIcon, PersonIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import DialogFormButton from "../../buttons/DialogFormButton";
import DeleteDialog from "../../dialogs/DeleteDialog";
import EditDialog from "../../dialogs/EditDialog";
import ViewItemsDialog from "../../dialogs/ViewItemsDialog";
import { ResponsiveDialogFooter } from "../../ResponsiveDialog";
import { createColumnConfig } from "../column.config";
import { DataTableColumnHeader } from "../data-table-column-header";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GENERIC_STATUS } from "@/constants";
import { ChevronsUpDown } from "lucide-react";
import StatusDropdown from "../../StatusDropDown";

export const visibleTaskColumns = (userRoles: UserRoleEnum[]) => {
  return createColumnConfig({
    desktop: {
      warehouse_person: true,
      project_client: true,
      project: true,
      project_products: true,
      status_dropdown: hasPermission(userRoles, [
        UserRoleEnum.ADMIN,
        UserRoleEnum.PROJECT_MANAGER,
        UserRoleEnum.WAREHOUSE_PERSONNEL,
      ]),
      status_badge: hasPermission(userRoles, [
        UserRoleEnum.LOGISTICS_TEAM_MEMBER,
      ]),
      created_at: true,
      actions: hasPermission(userRoles, [
        UserRoleEnum.ADMIN,
        UserRoleEnum.PROJECT_MANAGER,
      ]),
    },
    mobile: {
      warehouse_person: true,
      project_client: true,
      project: true,
      project_products: true,
      status_dropdown: hasPermission(userRoles, [
        UserRoleEnum.ADMIN,
        UserRoleEnum.PROJECT_MANAGER,
        UserRoleEnum.WAREHOUSE_PERSONNEL,
      ]),
      status_badge: hasPermission(userRoles, [
        UserRoleEnum.LOGISTICS_TEAM_MEMBER,
      ]),
      created_at: true,
      actions: hasPermission(userRoles, [
        UserRoleEnum.ADMIN,
        UserRoleEnum.PROJECT_MANAGER,
      ]),
    },
  });
};

export const TaskColumns: ColumnDef<Task>[] = [
  {
    accessorKey: "warehouse_person",
    header: "Warehouse Personnel",
    cell: ({ row }) => {
      const warehousePerson = row.original.warehouse_person;
      const isDesktop = useResponsive("desktop");

      return (
        <div className="flex items-center space-x-2">
          {isDesktop && <PersonIcon className="size-4" />}
          <span>
            {!warehousePerson.user.roles.includes(
              UserRoleEnum.WAREHOUSE_PERSONNEL,
            )
              ? "Unassigned"
              : `${warehousePerson.first_name} ${warehousePerson.last_name}`}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "poject_client",
    accessorFn: (row) => row.project.client,
    header: "Client",
    cell: ({ row }) => {
      const isDesktop = useMediaQuery({ query: "(min-width: 1224px)" });

      return (
        <div className="flex items-center space-x-2">
          {isDesktop && <BackpackIcon className="size-4" />}
          <span>{row.original.project.client}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "project",
    accessorFn: (row) => row.project.name,
    header: "Project",
  },
  {
    accessorKey: "project_products",
    header: "Items",
    cell: ({ row }) => {
      const project = row.original.project;

      return (
        <ViewItemsDialog
          baReferenceNumber={project.ba_reference_number}
          items={{
            products: project.products,
          }}
        />
      );
    },
  },
  {
    accessorKey: "status_dropdown",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <StatusDropdown
          id={row.original.id}
          mutationKey="update-status"
          currentStatus={status}
          statuses={GENERIC_STATUS}
          mutationFn={updateTaskStatus}
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
    cell: ({ row }) => {
      const task = row.original;
      const [openDialog, setOpenDialog] = useState(false);
      const { form, onSubmit } = useTaskForm({ task, mode: "edit" });

      const { data } = useQuery({
        queryKey: ["edit-task"],
        queryFn: async () => {
          const projects = await getProjects();
          const warehousePersons = await getEmployees();
          const filteredWarehousePersons = warehousePersons.filter(
            (person) =>
              person.user.roles.includes(UserRoleEnum.WAREHOUSE_PERSONNEL) &&
              person.user.is_active,
          );
          return { projects, filteredWarehousePersons };
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
              projects={data?.projects ?? []}
              warehousePersons={data?.filteredWarehousePersons ?? []}
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
            title="Delete Task"
            deleteAction={async () => await deleteTask(task.id)}
            placeholder="Are you sure you want to delete the task?"
          />
        </div>
      );
    },
  },
];
