"use client";

import EmployeeForm, {
  useEmployeeForm,
} from "@/app/(root)/employees/components/EmployeeForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { USER_ROLES } from "@/constants";
import { FormModeEnum } from "@/enums";
import { formatDateTime } from "@/lib/utils";
import { Employee } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";
import DialogFormButton from "../../buttons/DialogFormButton";
import EditDialog from "../../dialogs/EditDialog";
import TableImage from "../../image/TableImage";
import { ResponsiveDialogFooter } from "../../ResponsiveDialog";
import { DataTableColumnHeader } from "../data-table-column-header";

export const visibileEmployeeColumns = {
  desktop: {
    profile_image: true,
    email: true,
    status: true,
    name: true,
    role: true,
    actions: true,
    created_at: true,
  },
  mobile: {
    profile_image: true,
    email: true,
    name: true,
    status: true,
    role: true,
    actions: true,
  },
};

const EmployeeActionsCell = React.memo(
  ({ employee }: { employee: Employee }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const { form, onSubmit } = useEmployeeForm({
      employee,
      mode: "edit",
    });

    return (
      <div className="flex items-center gap-2">
        <EditDialog
          key={`edit-employee-dialog-${employee.id}`}
          title="Edit Employee"
          open={openDialog}
          setOpen={setOpenDialog}
          className="max-w-xl"
        >
          <EmployeeForm
            className="px-1"
            key={`form-employee-${employee.id}`}
            form={form}
            mode={FormModeEnum.EDIT}
          />
          <ResponsiveDialogFooter className="px-1">
            <div className="flex flex-row w-full gap-2">
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
  },
);

export const EmployeeColumns: ColumnDef<Employee>[] = [
  {
    accessorKey: "profile_image",
    header: () => (
      <div className="w-[1rem]">
        <span className="sr-only">Image</span>
      </div>
    ),
    cell: ({ row }) => {
      return (
        <TableImage alt={"profile-image"} src={row.getValue("profile_image")} />
      );
    },
  },
  {
    accessorKey: "email",
    accessorFn: (row) => row.user.email,
    header: "Email",
  },
  {
    accessorKey: "status",
    accessorFn: (row) => row.user.is_active,
    header: "Status",
    cell: ({ row }) => {
      const statusBadgeColors: Record<string, string> = {
        true: "bg-green-500",
        false: "bg-red-500",
      };

      const isActive = row.original.user.is_active;
      return (
        <Badge
          className={`${statusBadgeColors[isActive ? "true" : "false"]} pointer-events-none`}
        >
          {isActive ? "Active" : "Deactivated"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <span>{`${row.original.first_name} ${row.original.last_name}`}</span>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.user.role;

      return <Badge variant={"secondary"}>{USER_ROLES[role]}</Badge>;
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
      <EmployeeActionsCell
        key={`actions-employee-${row.original.id}`}
        employee={row.original}
      />
    ),
  },
];
