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

export const visibleClassificationColumns = (userRole: UserRoleEnum) => {
  return createColumnConfig({
    desktop: {
      name: true,
      description: true,
      actions: hasPermission(userRole, [
        UserRoleEnum.ADMIN,
        UserRoleEnum.LOGISTICS_SPECIALIST,
      ]),
    },
    mobile: {
      name: true,
      description: true,
      actions: hasPermission(userRole, [
        UserRoleEnum.ADMIN,
        UserRoleEnum.LOGISTICS_SPECIALIST,
      ]),
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
