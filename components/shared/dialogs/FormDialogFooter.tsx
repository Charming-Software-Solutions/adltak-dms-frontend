import { Button } from "@/components/ui/button";
import React from "react";
import { ResponsiveDialogFooter } from "../ResponsiveDialog";
import { UseFormReturn } from "react-hook-form";

type FormDialogFooterProps<T extends Record<string, any>> = {
  form: UseFormReturn<T>;
  setOpenDialog: (value: boolean) => void;
  onSubmit: (values: T, setOpen: (value: boolean) => void) => Promise<void>;
  submitText: string;
};

const FormDialogFooter = <T extends Record<string, any>>({
  form,
  setOpenDialog,
  onSubmit,
  submitText,
}: FormDialogFooterProps<T>) => {
  return (
    <ResponsiveDialogFooter>
      <div className="dialog-footer">
        <Button
          variant="outline"
          onClick={() => {
            setOpenDialog(false);
            form.reset();
          }}
          className="w-full"
        >
          Cancel
        </Button>
        <Button
          onClick={form.handleSubmit((values) =>
            onSubmit(values, setOpenDialog),
          )}
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {submitText}
        </Button>
      </div>
    </ResponsiveDialogFooter>
  );
};

export default FormDialogFooter;
