"use client";

import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import {
  createClassification,
  updateClassification,
} from "@/lib/actions/classification.actions";
import { formatErrorResponse } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { ClassificationFormData, classificationFormSchema } from "@/schemas";
import { ApiResponse } from "@/types/api";
import { Classification, ClassificationType } from "@/types/generics";
import { SelectItemType } from "@/types/primitives";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  form: UseFormReturn<ClassificationFormData>;
  mode?: "create" | "edit";
  className?: string;
};

const classificationTypes: SelectItemType[] = [
  {
    label: "Product Brand",
    value: "product_brand",
  },
  {
    label: "Product Category",
    value: "product_category",
  },
  {
    label: "Product Type",
    value: "product_type",
  },
  {
    label: "Asset Type",
    value: "asset_type",
  },
];

export const useClassificationForm = ({
  classification = undefined,
  mode,
  classificationType,
}: {
  classification?: Classification;
  mode: "create" | "edit";
  classificationType?: ClassificationType;
}) => {
  const router = useRouter();

  const form = useForm<ClassificationFormData>({
    resolver: zodResolver(classificationFormSchema),
    defaultValues: {
      name: classification?.name ?? "",
      description: classification?.description ?? "",
      classificationType: mode === "create" ? "" : undefined,
    },
  });

  const onSubmit = async (
    values: ClassificationFormData,
    setOpen: (value: boolean) => void,
  ) => {
    // Validation adjustment based on mode
    if (mode === "create" && !values.classificationType) {
      toast.error("Classification type is required in create mode.", {
        position: "top-center",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description ?? "");

    const result: ApiResponse<Classification> =
      mode === "create"
        ? await createClassification(
            formData,
            values.classificationType as ClassificationType,
          )
        : await updateClassification(
            classification!.id,
            formData,
            classificationType!,
          );

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

const ClassificationForm = ({ form, mode = "create", className }: Props) => {
  return (
    <Form {...form}>
      <div className={cn("form-container", className)}>
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Name"
          placeholder="Calbee"
        />
        {mode === "create" && (
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="classificationType"
            label="Classification Type"
            placeholder="Select classification type"
          >
            {classificationTypes.map((type, key) => (
              <SelectItem key={key} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </CustomFormField>
        )}

        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="description"
          label="Description"
          placeholder="Description about classification"
        />
      </div>
    </Form>
  );
};

export default ClassificationForm;
