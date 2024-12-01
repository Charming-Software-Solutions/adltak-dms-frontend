"use client";

import DialogFormButton from "@/components/shared/buttons/DialogFormButton";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/shared/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/hooks";
import { Employee } from "@/types/user";
import AccountSettingProfileForm, {
  useUpdateProfileForm,
} from "./forms/AccountSettingProfileForm";

export const AccountSettingProfileDialog = ({
  employee,
}: {
  employee: Employee;
}) => {
  const { openDialog, setOpenDialog } = useDialog();
  const { form, onSubmit } = useUpdateProfileForm({ employee });

  return (
    <ResponsiveDialog open={openDialog} setOpen={setOpenDialog}>
      <ResponsiveDialogTrigger>
        <Button>Change Profile</Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Change Profile</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Change your profile image and name
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <AccountSettingProfileForm form={form} />
        <ResponsiveDialogFooter className="dialog-footer">
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
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
