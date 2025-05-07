"use client";

import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import ImageDropzone from "@/components/shared/image/ImageDropzone";
import MultiCheckboxFormField from "@/components/shared/MultiCheckboxFormField";
import SwitchFormField from "@/components/shared/SwitchFormField";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormDescription, FormLabel } from "@/components/ui/form";
import { USER_ROLES } from "@/constants";
import { FormModeEnum, ProjectStatusEnum, UserRoleEnum } from "@/enums";
import { createEmployee, updateEmployee } from "@/lib/actions/employee.actions";
import { getTasks } from "@/lib/actions/task.actions";
import { formatErrorResponse } from "@/lib/formatters";
import { cn, showSuccessMessage } from "@/lib/utils";
import { EmployeeFormData, employeeFormSchema } from "@/schemas";
import { ApiResponse } from "@/types/api";
import { Employee } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { AlertCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type EmployeeFormProps = {
  employee?: Employee;
  form: UseFormReturn<EmployeeFormData>;
  mode: FormModeEnum;
  className?: string;
};

type UseEmployeeFormProps = {
  employee?: Employee | undefined;
  mode: FormModeEnum;
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
      email: string;
      roles: UserRoleEnum[];
      is_active: boolean;
    } = {
      email: values.email,
      roles: values.roles as UserRoleEnum[],
      is_active: values.status,
    };

    formData.append("user", JSON.stringify(userData));

    if (values.profile_image instanceof File) {
      formData.append("profile_image", values.profile_image);
    }

    const result: ApiResponse<Employee> =
      mode === FormModeEnum.CREATE
        ? await createEmployee(formData)
        : await updateEmployee(employee!.id, formData);

    if (result.errors) {
      toast.error(formatErrorResponse(result.errors), {
        position: "top-center",
      });
      return;
    }

    showSuccessMessage(mode, "employee");
    setOpen(false);
    form.reset(mode === FormModeEnum.CREATE ? undefined : values);
    router.refresh();
  };

  return { form, onSubmit };
};

const EmployeeForm = ({
  employee = undefined,
  form,
  mode,
  className,
}: EmployeeFormProps) => {
  const { data: tasks } = useQuery({
    queryKey: ["fetch-tasks", form],
    queryFn: async () => await getTasks(),
  });

  const hasTasks = useMemo(() => {
    return tasks?.some(
      (task) =>
        task.warehouse_person.user.id === employee?.user.id &&
        task.project.status !== ProjectStatusEnum.LOCKED,
    );
  }, [tasks, employee]);

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
        {hasTasks && (
          <Alert>
            <AlertCircleIcon className="size-4" />
            <AlertDescription>
              Assigned tasks should be finished first before updating roles.
            </AlertDescription>
          </Alert>
        )}
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
              disabled={hasTasks}
            />
          </CardContent>
        </Card>
        {mode === FormModeEnum.EDIT && (
          <SwitchFormField
            control={form.control}
            name="status"
            label="Employee Active Status"
            description="Current active status of the selected employee."
            disabled={form.formState.isSubmitting || hasTasks}
          />
        )}
      </div>
    </Form>
  );
};

export default EmployeeForm;
