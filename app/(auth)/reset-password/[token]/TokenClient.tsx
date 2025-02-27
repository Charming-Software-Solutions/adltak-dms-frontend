"use client";

import DialogFormButton from "@/components/shared/buttons/DialogFormButton";
import CustomFormField, {
  FormFieldType,
  InputType,
} from "@/components/shared/CustomFormField";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { resetPassword } from "@/lib/actions/auth.actions";
import { formatErrorResponse } from "@/lib/formatters";
import { ResetPasswordFormData, resetPasswordSchema } from "@/schemas";
import { ApiResponse } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type TokenClientProps = {
  token: string;
};

const TokenClient = ({ token }: TokenClientProps) => {
  const router = useRouter();
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    const formData = new FormData();
    formData.append("new_password", values.newPassword);
    formData.append("confirm_password", values.confirmPassword);

    const result: ApiResponse<{ message: string }> = await resetPassword(
      formData,
      token,
    );

    if (result.errors) {
      toast.error(formatErrorResponse(result.errors), {
        position: "top-center",
      });
    } else {
      toast.success(result.data?.message ?? "Password successfully reset.", {
        position: "top-center",
      });
      form.reset();
      router.push("/login");
    }
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="flex flex-col gap-4 h-full">
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
            </div>
          </Form>
        </CardContent>
        <CardFooter>
          <DialogFormButton
            disabled={form.formState.isSubmitting}
            loading={form.formState.isSubmitting}
            onClick={() => form.handleSubmit(handleSubmit)()}
          >
            Reset Password
          </DialogFormButton>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TokenClient;
