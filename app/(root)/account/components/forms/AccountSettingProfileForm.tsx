"use client";

import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import ImageDropzone from "@/components/shared/image/ImageDropzone";
import { Form } from "@/components/ui/form";
import { updateEmployeeProfile } from "@/lib/actions/employee.actions";
import { formatErrorResponse } from "@/lib/formatters";
import { cn } from "@/lib/utils";
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
      name: employee.name,
      profileImage: employee.profile_image ?? "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof updateProfileFormSchema>,
    setOpen: (value: boolean) => void,
  ) => {
    const formData = new FormData();
    formData.append("name", values.name);
    if (values.profileImage instanceof File) {
      formData.append("profile_image", values.profileImage);
    }

    const result: ApiResponse<Employee> = await updateEmployeeProfile(formData);

    if (result.errors) {
      toast.error(formatErrorResponse(result.errors), {
        position: "top-center",
      });
    } else {
      if (result.data) {
        toast.success("Profile successfully updated!", {
          position: "top-center",
        });
        setOpen(false);
        form.reset(result.data);
        router.refresh();
      }
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
          name="name"
          label="Full Name"
          placeholder="example@email.com"
          disabled={form.formState.isSubmitting}
        />
      </div>
    </Form>
  );
};

export default AccountSettingProfileForm;
