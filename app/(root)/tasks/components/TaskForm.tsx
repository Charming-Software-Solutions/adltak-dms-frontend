"use client";

import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { createTask, updateTask } from "@/lib/actions/task.actions";
import { formatErrorResponse } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { TaskFormData, taskFormSchema } from "@/schemas";
import { ApiResponse } from "@/types/api";
import { Distribution } from "@/types/distribution";
import { Task } from "@/types/task";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  form: UseFormReturn<TaskFormData>;
  distributions: Distribution[];
  className?: string;
};

export const useTaskForm = ({
  task = undefined,
  mode,
}: {
  task?: Task;
  mode: "create" | "edit";
}) => {
  const router = useRouter();

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      employee: task?.employee ?? "",
      distribution: task?.distribution.id ?? "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof taskFormSchema>,
    setOpen: (value: boolean) => void,
  ) => {
    const formData = new FormData();
    formData.append("employee", values.employee);
    formData.append("distribution", values.distribution);

    const result: ApiResponse<Task> =
      mode === "create"
        ? await createTask(formData)
        : await updateTask(task!.id, formData);

    if (result.errors) {
      toast.error(formatErrorResponse(result.errors), {
        position: "top-center",
      });
    } else {
      setOpen(false);
      router.refresh();
      form.reset();
    }
  };
  return { form, onSubmit };
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
