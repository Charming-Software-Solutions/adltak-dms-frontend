"use client";

import CustomFormField, {
  FormFieldType,
  InputType,
} from "@/components/shared/CustomFormField";
import { Form } from "@/components/ui/form";
import { changeEmail } from "@/lib/actions/auth.actions";
import { formatErrorResponse } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { ChangeEmailFormData, changeEmailFormSchema } from "@/schemas";
import { ApiResponse } from "@/types/api";
import { User } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type AccountSettingEmailFormProps = {
  form: UseFormReturn<ChangeEmailFormData>;
  className?: string;
};

export const useChangeEmailForm = ({ user }: { user: User }) => {
  const router = useRouter();

  const form = useForm<ChangeEmailFormData>({
    resolver: zodResolver(changeEmailFormSchema),
    defaultValues: {
      newEmail: user.email,
      confirmEmail: "",
      password: "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof changeEmailFormSchema>,
    setOpen: (value: boolean) => void,
  ) => {
    const formData = new FormData();
    formData.append("email", values.newEmail);
    formData.append("password", values.password);

    const result: ApiResponse<{ email: string }> = await changeEmail(formData);

    if (result.errors) {
      toast.error(formatErrorResponse(result.errors), {
        position: "top-center",
      });
    } else {
      setOpen(false);
      form.reset();
      router.refresh();
    }
  };

  return { form, onSubmit };
};

const AccountSettingEmailForm = ({
  form,
  className,
}: AccountSettingEmailFormProps) => {
  useEffect(() => {
    form.setValue("newEmail", form.formState.defaultValues?.newEmail ?? "");
  }, []);
  return (
    <Form {...form}>
      <div className={cn("flex flex-col gap-4 h-full", className)}>
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          inputType={InputType.EMAIL}
          control={form.control}
          name="newEmail"
          label="New Email"
          placeholder={form.formState.defaultValues?.newEmail}
          disabled={form.formState.isSubmitting}
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          inputType={InputType.EMAIL}
          control={form.control}
          name="confirmEmail"
          label="Confirm Email"
          placeholder={form.formState.defaultValues?.newEmail}
          disabled={form.formState.isSubmitting}
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          inputType={InputType.PASSWORD}
          control={form.control}
          name="password"
          label="Password"
          placeholder="*************"
          disabled={form.formState.isSubmitting}
        />
      </div>
    </Form>
  );
};

export default AccountSettingEmailForm;
