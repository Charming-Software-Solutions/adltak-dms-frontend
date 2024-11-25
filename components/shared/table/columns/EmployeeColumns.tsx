"use client";

import EmployeeForm, {
  useEmployeeForm,
} from "@/app/(root)/employees/components/EmployeeForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { USER_ROLES } from "@/constants";
import { deleteEmployee } from "@/lib/actions/employee.actions";
import { Employee } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";
import DeleteDialog from "../../dialogs/DeleteDialog";
import EditDialog from "../../dialogs/EditDialog";
import TableImage from "../../image/TableImage";
import { ResponsiveDialogFooter } from "../../ResponsiveDialog";
import { FormModeEnum } from "@/enums";
import { formatDateTime } from "@/lib/utils";
import { DataTableColumnHeader } from "../data-table-column-header";
import DialogFormButton from "../../buttons/DialogFormButton";

export const visibileEmployeeColumns = {
  desktop: {
    profile_image: true,
    email: true,
    name: true,
    role: true,
    actions: true,
    created_at: true,
  },
  mobile: {
    profile_image: true,
    email: true,
    name: true,
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
                text="Save Changes"
                onClick={form.handleSubmit((values) =>
                  onSubmit(values, setOpenDialog),
                )}
                disabled={form.formState.isSubmitting}
                loading={form.formState.isSubmitting}
              />
            </div>
          </ResponsiveDialogFooter>
        </EditDialog>
        <DeleteDialog
          title={"Delete Employee"}
          deleteAction={async () => await deleteEmployee(employee.id)}
          placeholder={"Are you sure you want to delete this employee account?"}
        />
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
    accessorKey: "name",
    header: "Name",
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
