import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import { Form } from "@/components/ui/form";
import { FormModeEnum } from "@/enums";
import { ICreateProject } from "@/interfaces";
import { createProject, updateProject } from "@/lib/actions/project.actions";
import { formatErrorResponse } from "@/lib/formatters";
import { useProjectItemStore } from "@/lib/store";
import { cn, showSuccessMessage } from "@/lib/utils";
import { ProjectFormData, projectFormSchema } from "@/schemas";
import { ApiResponse } from "@/types/api";
import { Project } from "@/types/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  form: UseFormReturn<ProjectFormData>;
  mode?: FormModeEnum;
  className?: string;
};

export const useProjectForm = ({
  project = undefined,
  mode,
  employee,
}: {
  project?: Project;
  mode: FormModeEnum;
  employee?: string;
}) => {
  const router = useRouter();
  const { items, clearItems } = useProjectItemStore();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: project?.name ?? "",
      baReferenceNumber: project?.ba_reference_number ?? "",
      client: project?.client ?? "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof projectFormSchema>,
    setOpen: (value: boolean) => void,
  ) => {
    let projectCreate: ICreateProject | undefined;
    const projectUpdate = new FormData();

    // Get items directly from the zustand store
    const productItems = items.filter((item) => "product" in item);
    const materialItems = items.filter((item) => "material" in item);

    if (mode === FormModeEnum.CREATE && productItems.length > 0) {
      projectCreate = {
        name: values.name,
        employee: employee!,
        products: productItems.map((object) => ({
          product: object.product.id,
          quantity: object.quantity,
          expiration: object.expiration,
        })),
        materials: materialItems.map((object) => ({
          material: object.material.id,
          quantity: object.quantity,
        })),
        ba_reference_number: values.baReferenceNumber,
        client: values.client,
      };
    } else {
      projectUpdate.append("name", values.name);
      projectUpdate.append("ba_reference_number", values.baReferenceNumber);
      projectUpdate.append("client", values.client);
    }

    const result: ApiResponse<Project> =
      mode === FormModeEnum.CREATE
        ? await createProject(projectCreate!)
        : await updateProject(project!.id, projectUpdate);

    if (result.errors) {
      toast.error(formatErrorResponse(result.errors), {
        position: "top-center",
      });
      return;
    }

    showSuccessMessage(mode as FormModeEnum, "project");

    if (mode === FormModeEnum.CREATE) {
      form.reset();
      clearItems();
    } else {
      form.reset(values);
    }

    setOpen(false);
    router.refresh();
  };

  return { form, onSubmit };
};

const ProjectForm = ({
  form,
  mode = FormModeEnum.CREATE,
  className,
}: Props) => {
  return (
    <Form {...form}>
      <div className={cn("space-y-2 px-1", className)}>
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="baReferenceNumber"
          label="BA Reference Number"
          placeholder="BAmmddyyxx"
          disabled={form.formState.isSubmitting}
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Project Name"
          placeholder="Grocery 2025"
          disabled={form.formState.isSubmitting}
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="client"
          label="Client"
          placeholder="John Doe"
          disabled={form.formState.isSubmitting}
        />
      </div>
    </Form>
  );
};

export default ProjectForm;
