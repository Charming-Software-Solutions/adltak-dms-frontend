"use client";

import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import ImageDropzone from "@/components/shared/image/ImageDropzone";
import { Form } from "@/components/ui/form";
import { FormModeEnum } from "@/enums";
import { updateEmployeeProfile } from "@/lib/actions/employee.actions";
import { formatErrorResponse } from "@/lib/formatters";
import { cn, showSuccessMessage } from "@/lib/utils";
import { UpdateProfileFormData, updateProfileFormSchema } from "@/schemas";
import { ApiResponse } from "@/types/api";
import { Employee } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type AccountSettingProfileFormProps = {
  form: UseFormReturn<UpdateProfileFormData>;
  className?: string;
};

export const useUpdateProfileForm = ({ employee }: { employee: Employee }) => {
  const router = useRouter();

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileFormSchema),
    defaultValues: {
      firstName: employee.first_name,
      lastName: employee.last_name,
      profileImage: employee.profile_image ?? "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof updateProfileFormSchema>,
    setOpen: (value: boolean) => void,
  ) => {
    const formData = new FormData();
    formData.append("first_name", values.firstName);
    formData.append("last_name", values.lastName);
    if (values.profileImage instanceof File) {
      formData.append("profile_image", values.profileImage);
    }

    const result: ApiResponse<Employee> = await updateEmployeeProfile(formData);

    if (result.errors) {
      toast.error(formatErrorResponse(result.errors), {
        position: "top-center",
      });
    } else {
      showSuccessMessage(FormModeEnum.EDIT, "profile");
      setOpen(false);
      router.refresh();
    }
  };
  return { form, onSubmit };
};

const AccountSettingProfileForm = ({
  form,
  className,
}: AccountSettingProfileFormProps) => {
  return (
    <Form {...form}>
      <div className={cn("flex flex-col gap-4 h-full", className)}>
        <div className="flex w-full h-full items-center justify-center">
          <ImageDropzone
            control={form.control}
            name="profileImage"
            disabled={form.formState.isSubmitting}
            classname="size-[15rem]"
          />
        </div>
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="firstName"
          label="First Name"
          placeholder="John"
          disabled={form.formState.isSubmitting}
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="lastName"
          label="Last Name"
          placeholder="Doe"
          disabled={form.formState.isSubmitting}
        />
      </div>
    </Form>
  );
};

export default AccountSettingProfileForm;
