"use client";

import DialogFormButton from "@/components/shared/buttons/DialogFormButton";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/shared/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/hooks";
import AccountSettingPasswordForm, {
  useChangePasswordForm,
} from "./forms/AccountSettingPasswordForm";

const AccountSettingsPasswordDialog = () => {
  const { openDialog, setOpenDialog } = useDialog();
  const { form, onSubmit } = useChangePasswordForm();

  return (
    <ResponsiveDialog open={openDialog} setOpen={setOpenDialog}>
      <ResponsiveDialogTrigger>
        <Button>Change Password</Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Change Password</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <AccountSettingPasswordForm form={form} />
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

export default AccountSettingsPasswordDialog;
