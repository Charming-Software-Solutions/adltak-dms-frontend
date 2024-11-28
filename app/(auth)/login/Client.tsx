"use client";

import DialogFormButton from "@/components/shared/buttons/DialogFormButton";
import CustomFormField, {
  FormFieldType,
  InputType,
} from "@/components/shared/CustomFormField";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { login } from "@/lib/actions/auth.actions";
import { loginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const LoginClient = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      await login(values.email, values.password);
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        try {
          const errorDetails = JSON.parse(error.message);
          const errorMessage =
            errorDetails?.detail || "An unexpected error occurred";
          toast.error(errorMessage, {
            position: "top-center",
          });
        } catch (parseError) {
          toast.error("An error occurred. Please try again.", {
            position: "top-center",
          });
        }
      } else {
        toast.error("An unknown error occurred", {
          position: "top-center",
        });
      }
    }
  };

  return (
    <Form {...form}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Login</CardTitle>
            <Image
              alt="Product image"
              priority
              className="aspect-square border rounded-md object-cover"
              height={35}
              width={35}
              src={"/assets/images/logo.jpg"}
            />
          </div>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              inputType={InputType.EMAIL}
              control={form.control}
              name="email"
              label="Email"
              placeholder={"johndoe@email.com"}
              disabled={form.formState.isSubmitting}
            />
            <CustomFormField
              fieldType={FormFieldType.PASSWORD}
              control={form.control}
              name="password"
              label="Password"
              placeholder="*************"
              disabled={form.formState.isSubmitting}
            />
          </div>
        </CardContent>
        <CardFooter>
          <DialogFormButton
            disabled={form.formState.isSubmitting}
            loading={form.formState.isSubmitting}
            onClick={() => form.handleSubmit(handleSubmit)()}
          >
            Sign In
          </DialogFormButton>
        </CardFooter>
      </Card>
    </Form>
  );
};

export default LoginClient;
