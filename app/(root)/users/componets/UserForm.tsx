"use client";

import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { userRoles } from "@/constants";
import { cn } from "@/lib/utils";
import { UserFormData } from "@/schemas";
import { UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<UserFormData>;
  className?: string;
};

const UserForm = ({ form, className }: Props) => {
  return (
    <Form {...form}>
      <div className={cn("flex flex-col gap-4", className)}>
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="User Email"
          placeholder="example@email.com"
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="password"
          label="User Password"
          placeholder="******"
        />
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="role"
          label="User Role"
          placeholder="Select role"
        >
          {userRoles.map((role, key) => (
            <SelectItem key={key} value={role.value}>
              {role.label}
            </SelectItem>
          ))}
        </CustomFormField>
      </div>
    </Form>
  );
};

export default UserForm;
