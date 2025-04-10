"use client";

import TaskForm, { useTaskForm } from "@/app/(root)/tasks/components/TaskForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { TASK_STATUS } from "@/constants";
import { FormModeEnum, ProjectStatusEnum, UserRoleEnum } from "@/enums";
import { useResponsive } from "@/hooks";
import {
  getEmployees,
  getWarehousePersonnelByProject,
} from "@/lib/actions/employee.actions";
import { getProjects } from "@/lib/actions/project.actions";
import { deleteTask, updateTaskStatus } from "@/lib/actions/task.actions";
import { hasPermission } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { Task } from "@/types/task";
import { BackpackIcon, PersonIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import DialogFormButton from "../../buttons/DialogFormButton";
import DeleteDialog from "../../dialogs/DeleteDialog";
import EditDialog from "../../dialogs/EditDialog";
import ViewItemsDialog from "../../dialogs/ViewItemsDialog";
import { ResponsiveDialogFooter } from "../../ResponsiveDialog";
import StatusDropdown from "../../StatusDropDown";
import { DataTableColumnHeader } from "../data-table-column-header";
import React from "react";

export const visibleTaskColumns = (userRoles: UserRoleEnum[]) => {
  return {
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
  };
};

const TaskActionsCell = React.memo(({ task }: { task: Task }) => {
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
      <EditDialog title="Edit Task" open={openDialog} setOpen={setOpenDialog}>
        <TaskForm
          mode={FormModeEnum.EDIT}
          task={task}
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
});

export const TaskColumns = (userRoles: UserRoleEnum[]): ColumnDef<Task>[] => [
  {
    accessorKey: "warehouse_person",
    header: "Warehouse Personnel",
    cell: ({ row }) => {
      const task = row.original;
      const warehousePerson = task.warehouse_person;
      const isDesktop = useResponsive("desktop");

      const { data, isLoading } = useQuery({
        queryKey: ["warehouse-personnel-by-project", task.project.name],
        queryFn: async () =>
          task.project.name
            ? await getWarehousePersonnelByProject(task.project.name)
            : [],
        enabled: !!task.project.name,
      });

      // Show dialog only if there are 2 or more warehouse personnel
      const multiplePersonnel = data && data.length >= 2;

      if (isLoading) {
        return <Skeleton className="h-4 w-auto" />;
      }

      if (multiplePersonnel) {
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <PersonIcon className="size-4 mr-2" /> View
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="start">
              <div className="flex flex-col space-y-2">
                <span className="text-sm font-semibold">
                  Assigned Warehouse Personnel
                </span>
                {data.map((warehousePerson) => (
                  <Badge
                    key={warehousePerson.id}
                    variant="outline"
                    className="rounded-md p-2 text-sm"
                  >
                    {warehousePerson.first_name} {warehousePerson.last_name}
                  </Badge>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        );
      }

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
    accessorKey: "project_client",
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

      return <ViewItemsDialog userRoles={userRoles} project={project} />;
    },
  },
  {
    accessorKey: "status_dropdown",
    header: "Status",
    cell: ({ row }) => {
      const task = row.original;
      const status = task.status;
      const router = useRouter();

      return (
        <StatusDropdown
          id={row.original.id}
          mutationKey="update-status"
          currentStatus={status}
          statuses={TASK_STATUS}
          mutationFn={updateTaskStatus}
          onSuccess={() => router.refresh()}
          disabled={
            task.project.status === ProjectStatusEnum.CONCLUDED ||
            task.project.status === ProjectStatusEnum.LOCKED
          }
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
      return (
        <TaskActionsCell
          key={`actions-${row.original.id}`}
          task={row.original}
        />
      );
    },
  },
];
