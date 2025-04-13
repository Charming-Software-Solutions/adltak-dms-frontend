"use client";

import ClassificationForm, {
  useClassificationForm,
} from "@/app/(root)/classifications/components/ClassificationForm";
import { Button } from "@/components/ui/button";
import { UserRoleEnum } from "@/enums";
import { deleteClassification } from "@/lib/actions/classification.actions";
import { hasPermission } from "@/lib/auth";
import { Classification, ClassificationType } from "@/types/generics";
import { ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";
import DialogFormButton from "../../buttons/DialogFormButton";
import DeleteDialog from "../../dialogs/DeleteDialog";
import EditDialog from "../../dialogs/EditDialog";
import { ResponsiveDialogFooter } from "../../ResponsiveDialog";

export const visibleClassificationColumns = (userRoles: UserRoleEnum[]) => {
  return {
    name: true,
    description: true,
    actions: hasPermission(userRoles, [UserRoleEnum.ADMIN]),
  };
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
          deleteAction={async () =>
            await deleteClassification(classification.id, classificationType)
          }
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
