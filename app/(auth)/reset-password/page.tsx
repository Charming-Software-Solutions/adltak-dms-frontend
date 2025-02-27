"use client";

import DialogFormButton from "@/components/shared/buttons/DialogFormButton";
import CustomFormField, {
  FormFieldType,
  InputType,
} from "@/components/shared/CustomFormField";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { sendPasswordResetLink } from "@/lib/actions/auth.actions";
import { formatErrorResponse } from "@/lib/formatters";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.coerce.string().email(),
});

export default function ResetPasswordPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await sendPasswordResetLink(values.email);

    if (response.errors) {
      toast.error(formatErrorResponse(response.errors), {
        position: "top-center",
      });
    } else {
      toast.success(response.data?.message || "Success", {
        position: "top-center",
      });
    }
  };

  return (
    <Form {...form}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Account Email</CardTitle>
          <CardDescription>
            Enter your email where the password link should be sent.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            inputType={InputType.EMAIL}
            control={form.control}
            name="email"
            label="Email"
            placeholder={"johndoe@email.com"}
            disabled={form.formState.isSubmitting}
          />
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <DialogFormButton
            disabled={form.formState.isSubmitting}
            loading={form.formState.isSubmitting}
            onClick={() => form.handleSubmit(handleSubmit)()}
          >
            Send Email
          </DialogFormButton>
          <Button
            variant={"outline"}
            className="w-full grow"
            disabled={form.formState.isSubmitting}
            onClick={() => router.push("/login")}
          >
            Return to Login
          </Button>
        </CardFooter>
      </Card>
    </Form>
  );
}
