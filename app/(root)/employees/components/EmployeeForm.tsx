"use client";

import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import ImageDropzone from "@/components/shared/image/ImageDropzone";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { USER_ROLES } from "@/constants";
import { FormModeEnum } from "@/enums";
import { createEmployee, updateEmployee } from "@/lib/actions/employee.actions";
import { formatErrorResponse } from "@/lib/formatters";
import { cn } from "@/lib/utils";
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
      name: employee?.name ?? "",
      role: employee?.user.role ?? "",
      profile_image: employee?.profile_image ?? undefined,
    },
  });

  const onSubmit = async (
    values: z.infer<typeof employeeFormSchema>,
    setOpen: (value: boolean) => void,
  ) => {
    const formData = new FormData();

    formData.append("name", values.name);

    const userData: { email?: string; role: string } = {
      role: values.role,
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
    } else {
      if (mode === "create") {
        form.reset();
      }
      setOpen(false);
      router.refresh();
    }
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
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="name"
              label="Name"
              placeholder="John Doe"
              disabled={form.formState.isSubmitting}
            />
          </div>
        </div>
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="role"
          label="Role"
          placeholder="Select role"
          disabled={form.formState.isSubmitting}
        >
          {Object.keys(USER_ROLES).map((role, key) => (
            <SelectItem key={key} value={role}>
              {USER_ROLES[role as keyof typeof USER_ROLES]}
            </SelectItem>
          ))}
        </CustomFormField>
      </div>
    </Form>
  );
};

export default EmployeeForm;
