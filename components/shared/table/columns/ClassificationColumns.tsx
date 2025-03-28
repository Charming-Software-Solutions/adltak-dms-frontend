"use client";

import { Classification, ClassificationType } from "@/types/generics";
import { ColumnDef } from "@tanstack/react-table";
import { createColumnConfig } from "../column.config";
import React, { useState } from "react";
import ClassificationForm, {
  useClassificationForm,
} from "@/app/(root)/classifications/components/ClassificationForm";
import EditDialog from "../../dialogs/EditDialog";
import { ResponsiveDialogFooter } from "../../ResponsiveDialog";
import { Button } from "@/components/ui/button";
import DeleteDialog from "../../dialogs/DeleteDialog";
import { deleteClassification } from "@/lib/actions/classification.actions";
import { UserRoleEnum } from "@/enums";
import { hasPermission } from "@/lib/auth";
import DialogFormButton from "../../buttons/DialogFormButton";
import { toast } from "sonner";

export const visibleClassificationColumns = (userRoles: UserRoleEnum[]) => {
  return createColumnConfig({
    desktop: {
      name: true,
      description: true,
      actions: hasPermission(userRoles, [UserRoleEnum.ADMIN]),
    },
    mobile: {
      name: true,
      description: true,
      actions: hasPermission(userRoles, [UserRoleEnum.ADMIN]),
    },
  });
};

const ClassificationActionsCell = React.memo(
  ({
    classification,
    classificationType,
  }: {
    classification: Classification;
    classificationType: ClassificationType;
  }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const { form, onSubmit } = useClassificationForm({
      classification,
      mode: "edit",
      classificationType: classificationType,
    });

    return (
      <div className="flex items-center gap-2">
        <EditDialog
          key={`edit-dialog-${classification.id}`}
          title="Edit Classification"
          open={openDialog}
          setOpen={setOpenDialog}
        >
          <ClassificationForm
            key={`form-${classification.id}`}
            form={form}
            mode="edit"
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
          title="Delete Classification"
          deleteAction={async () => {
            try {
              const response = await deleteClassification(
                classification.id,
                classificationType,
              );
              return response;
            } catch (error: any) {
              toast.error(error.message, {
                position: "top-center",
                duration: 1500,
              });
              return {
                status: 500,
                data: null,
                errors: { general: [error.message] },
              };
            }
          }}
          placeholder="Are you sure you want to delete the classification?"
        />
      </div>
    );
  },
);

export const getClassificationColumns = (
  classificationType: ClassificationType,
): ColumnDef<Classification>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ClassificationActionsCell
        key={`actions-${row.original.id}`}
        classification={row.original}
        classificationType={classificationType}
      />
    ),
  },
];
