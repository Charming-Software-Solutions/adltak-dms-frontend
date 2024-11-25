"use client";

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
import React from "react";
import AccountSettingEmailForm, {
  useChangeEmailForm,
} from "./forms/AccountSettingEmailForm";
import { User } from "@/types/user";
import DialogFormButton from "@/components/shared/buttons/DialogFormButton";

const AccountSettingEmailDialog = ({ user }: { user: User }) => {
  const { openDialog, setOpenDialog } = useDialog();
  const { form, onSubmit } = useChangeEmailForm({ user });

  return (
    <ResponsiveDialog open={openDialog} setOpen={setOpenDialog}>
      <ResponsiveDialogTrigger>
        <Button>Change Email Address</Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Change Email Address</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Current email address: <strong>{user.email}</strong>
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <AccountSettingEmailForm form={form} />
        <ResponsiveDialogFooter className="dialog-footer">
          <Button
            variant={"outline"}
            className="flex-grow w-full"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <DialogFormButton
            text={"Save Changes"}
            onClick={form.handleSubmit((values) =>
              onSubmit(values, setOpenDialog),
            )}
            disabled={form.formState.isSubmitting}
            loading={form.formState.isSubmitting}
          />
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default AccountSettingEmailDialog;
