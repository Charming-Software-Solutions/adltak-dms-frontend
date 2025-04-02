"use client";

import ComboBoxFormField from "@/components/shared/ComboBoxFormField";
import { Form } from "@/components/ui/form";
import { FormModeEnum } from "@/enums";
import { createTask, updateTask } from "@/lib/actions/task.actions";
import { formatErrorResponse } from "@/lib/formatters";
import { cn, showSuccessMessage } from "@/lib/utils";
import { TaskFormData, taskFormSchema } from "@/schemas";
import { ApiResponse } from "@/types/api";
import { Project } from "@/types/project";
import { Task } from "@/types/task";
import { Employee } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  form: UseFormReturn<TaskFormData>;
  projects: Project[];
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
      project: task?.project.id ?? "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof taskFormSchema>,
    setOpen: (value: boolean) => void,
  ) => {
    console.log(values);
    const formData = new FormData();
    formData.append("warehouse_person", values.warehousePerson);
    formData.append("project", values.project);

    const result: ApiResponse<Task> =
      mode === "create"
        ? await createTask(formData)
        : await updateTask(task!.id, formData);

    if (result.errors) {
      toast.error(formatErrorResponse(result.errors), {
        position: "top-center",
      });
      return;
    }

    showSuccessMessage(mode as FormModeEnum, "task");
    setOpen(false);
    form.reset(mode === "create" ? undefined : values);
    router.refresh();
  };
  return { form, onSubmit };
};

const TaskForm = ({ form, projects, className, warehousePersons }: Props) => {
  return (
    <Form {...form}>
      <div className={cn("flex flex-col gap-4 px-1", className)}>
        <ComboBoxFormField
          items={warehousePersons.map((person) => ({
            label: `${person.first_name} ${person.last_name}`,
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
          disabled={form.formState.isSubmitting}
        />
        <ComboBoxFormField
          items={projects.map((project) => ({
            label: project.name,
            value: project.id,
          }))}
          control={form.control}
          name="project"
          placeholder={{
            triggerPlaceholder: "Select project...",
            searchPlaceholder: "Search project...",
          }}
          label="Project"
          popOverSize="md:min-w-[28.5rem]"
          disabled={form.formState.isSubmitting}
        />
      </div>
    </Form>
  );
};
export default TaskForm;
