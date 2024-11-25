"use client";

import CustomFormField, {
  FormFieldType,
  InputType,
} from "@/components/shared/CustomFormField";
import { Form } from "@/components/ui/form";
import { changePassword } from "@/lib/actions/auth.actions";
import { formatErrorResponse } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { ChangePasswordFormData, changePasswordFormSchema } from "@/schemas";
import { ApiResponse } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type AccountSettingPasswordFormProps = {
  form: UseFormReturn<ChangePasswordFormData>;
  className?: string;
};

export const useChangePasswordForm = () => {
  const router = useRouter();

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
      currentPassword: "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof changePasswordFormSchema>,
    setOpen: (value: boolean) => void,
  ) => {
    const formData = new FormData();
    formData.append("new_password", values.newPassword);
    formData.append("confirm_password", values.confirmPassword);
    formData.append("current_password", values.currentPassword);

    const result: ApiResponse<{ message: string }> =
      await changePassword(formData);

    if (result.errors) {
      toast.error(formatErrorResponse(result.errors), {
        position: "top-center",
      });
    } else {
      toast.success(result.data?.message ?? "Password successfully changed!", {
        position: "top-center",
      });
      setOpen(false);
      form.reset();
      router.refresh();
    }
  };

  return { form, onSubmit };
};

const AccountSettingPasswordForm = ({
  form,
  className,
}: AccountSettingPasswordFormProps) => {
  return (
    <Form {...form}>
      <div className={cn("flex flex-col gap-4 h-full", className)}>
        <CustomFormField
          fieldType={FormFieldType.PASSWORD}
          inputType={InputType.PASSWORD}
          control={form.control}
          name="newPassword"
          label="New Password"
          placeholder="*************"
          disabled={form.formState.isSubmitting}
        />
        <CustomFormField
          fieldType={FormFieldType.PASSWORD}
          control={form.control}
          name="confirmPassword"
          label="Confirm Password"
          placeholder="*************"
          disabled={form.formState.isSubmitting}
        />
        <CustomFormField
          fieldType={FormFieldType.PASSWORD}
          control={form.control}
          name="currentPassword"
          label="Current Password"
          placeholder="*************"
          disabled={form.formState.isSubmitting}
        />
      </div>
    </Form>
  );
};

export default AccountSettingPasswordForm;
