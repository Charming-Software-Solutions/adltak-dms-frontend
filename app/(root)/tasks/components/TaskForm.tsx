"use client";

import ComboBoxFormField from "@/components/shared/ComboBoxFormField";
import { Form } from "@/components/ui/form";
import { createTask, updateTask } from "@/lib/actions/task.actions";
import { formatErrorResponse } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { TaskFormData, taskFormSchema } from "@/schemas";
import { ApiResponse } from "@/types/api";
import { Distribution } from "@/types/distribution";
import { Task } from "@/types/task";
import { Employee } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  form: UseFormReturn<TaskFormData>;
  distributions: Distribution[];
  warehousePersons: Employee[];
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
      warehousePerson: task?.warehouse_person.id ?? "",
      distribution: task?.distribution.id ?? "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof taskFormSchema>,
    setOpen: (value: boolean) => void,
  ) => {
    const formData = new FormData();
    formData.append("warehouse_person", values.warehousePerson);
    formData.append("distribution", values.distribution);

    console.log(values);

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

const TaskForm = ({
  form,
  distributions,
  className,
  warehousePersons,
}: Props) => {
  return (
    <Form {...form}>
      <div className={cn("flex flex-col gap-4 px-1", className)}>
        <ComboBoxFormField
          items={warehousePersons.map((person) => ({
            label: person.name,
            value: person.id,
          }))}
          control={form.control}
          name="warehousePerson"
          placeholder={{
            triggerPlaceholder: "Select warehouse person...",
            searchPlaceholder: "Search warehouse person...",
          }}
          label="Warehouse Person"
          popOverSize="md:min-w-[28.5rem]"
        />
        <ComboBoxFormField
          items={distributions.map((distribution) => ({
            label: `ID: ${distribution.dist_id} | Client: ${distribution.client} | Type: ${distribution.type}`,
            value: distribution.id,
          }))}
          control={form.control}
          name="distribution"
          placeholder={{
            triggerPlaceholder: "Select distribution...",
            searchPlaceholder: "Search distribution...",
          }}
          label="Distribution"
          popOverSize="md:min-w-[28.5rem]"
        />
      </div>
    </Form>
  );
};
export default TaskForm;
