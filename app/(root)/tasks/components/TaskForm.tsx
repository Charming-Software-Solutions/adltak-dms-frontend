"use client";

import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { TaskFormData } from "@/schemas";
import { Distribution } from "@/types/distribution";
import { UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<TaskFormData>;
  distributions: Distribution[];
  className?: string;
};

const TaskForm = ({ form, distributions, className }: Props) => {
  return (
    <Form {...form}>
      <div className={cn("flex flex-col gap-4 px-1", className)}>
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="employee"
          label="Warehouse Person"
          placeholder="John Doe"
        />
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="distribution"
          label="Distribution"
          placeholder="Select Distribution"
        >
          {distributions.map((distribution, key) => (
            <SelectItem key={key} value={distribution.id}>
              <div className="flex space-x-2 items-center">
                <span>
                  <strong>ID: </strong>
                  {distribution.dist_id}
                </span>
                <Separator className="h-4" orientation="vertical" />
                <span>
                  <strong>Client: </strong>
                  {distribution.client}
                </span>
                <Separator className="h-4" orientation="vertical" />
                <span>
                  <strong>Type: </strong>
                  {distribution.type}
                </span>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>
      </div>
    </Form>
  );
};
export default TaskForm;
