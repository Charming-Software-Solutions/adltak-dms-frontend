"use client";

import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import ImageDropzone from "@/components/shared/image/ImageDropzone";
import MultiCheckboxFormField from "@/components/shared/MultiCheckboxFormField";
import SwitchFormField from "@/components/shared/SwitchFormField";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormDescription, FormLabel } from "@/components/ui/form";
import { USER_ROLES } from "@/constants";
import { FormModeEnum, UserRoleEnum } from "@/enums";
import { createEmployee, updateEmployee } from "@/lib/actions/employee.actions";
import { formatErrorResponse } from "@/lib/formatters";
import { cn, showSuccessMessage } from "@/lib/utils";
import { EmployeeFormData, employeeFormSchema } from "@/schemas";
import { ApiResponse } from "@/types/api";
import { Employee } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type EmployeeFormProps = {
  form: UseFormReturn<EmployeeFormData>;
  mode: FormModeEnum;
  className?: string;
};

type UseEmployeeFormProps = {
  employee?: Employee | undefined;
  mode: "create" | "edit";
};

export const useEmployeeForm = ({ employee, mode }: UseEmployeeFormProps) => {
  const router = useRouter();

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      email: employee?.user.email ?? "",
      firstName: employee?.first_name ?? "",
      lastName: employee?.last_name ?? "",
      roles: employee?.user.roles ?? [],
      profile_image: employee?.profile_image ?? undefined,
      status: employee?.user.is_active ?? true,
    },
  });

  const onSubmit = async (
    values: z.infer<typeof employeeFormSchema>,
    setOpen: (value: boolean) => void,
  ) => {
    const formData = new FormData();

    formData.append("first_name", values.firstName);
    formData.append("last_name", values.lastName);

    const userData: {
      email?: string;
      roles: UserRoleEnum[];
      is_active: boolean;
    } = {
      roles: values.roles as UserRoleEnum[],
      is_active: values.status,
    };

    if (mode === "create") {
      userData.email = values.email;
    }

    formData.append("user", JSON.stringify(userData));

    if (values.profile_image instanceof File) {
      formData.append("profile_image", values.profile_image);
    }

    const result: ApiResponse<Employee> =
      mode === "create"
        ? await createEmployee(formData)
        : await updateEmployee(employee!.id, formData);

    if (result.errors) {
      toast.error(formatErrorResponse(result.errors), {
        position: "top-center",
      });
    }

    showSuccessMessage(mode as FormModeEnum, "employee");
    setOpen(false);
    form.reset(mode === "create" ? undefined : values);
    router.refresh();
  };

  return { form, onSubmit };
};

const EmployeeForm = ({ form, mode, className }: EmployeeFormProps) => {
  return (
    <Form {...form}>
      <div className={cn("flex flex-col gap-4 h-full", className)}>
        <div className="flex flex-row gap-2 items-start ">
          <ImageDropzone
            control={form.control}
            name="profile_image"
            disabled={form.formState.isSubmitting}
          />
          <div className="space-y-2 w-full">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label="Email"
              placeholder="example@email.com"
              disabled={
                mode === FormModeEnum.EDIT || form.formState.isSubmitting
              }
            />
            <div className="flex space-x-2 items-center w-full">
              <div className="flex-grow w-full">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="firstName"
                  label="First Name"
                  placeholder="John"
                  disabled={form.formState.isSubmitting}
                />
              </div>
              <div className="flex-grow w-full">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="lastName"
                  label="Last Name"
                  placeholder="Doe"
                  disabled={form.formState.isSubmitting}
                />
              </div>
            </div>
          </div>
        </div>
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Employee Roles</FormLabel>
              <FormDescription className="text-xs">
                An employee can have mutilple roles assigned to them.
              </FormDescription>
            </div>
            <MultiCheckboxFormField
              items={Object.entries(USER_ROLES)
                .filter(([key]) => key !== UserRoleEnum.ADMIN)
                .map(([value, label]) => ({
                  value,
                  label,
                }))}
              control={form.control}
              name="roles"
              disabled={false}
            />
          </CardContent>
        </Card>
        <SwitchFormField
          control={form.control}
          name="status"
          label="Employee Active Status"
          description="Current active status of the selected employee."
          disabled={form.formState.isSubmitting}
        />
      </div>
    </Form>
  );
};

export default EmployeeForm;
