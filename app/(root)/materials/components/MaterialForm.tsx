"use client";

import ComboBoxFormField from "@/components/shared/ComboBoxFormField";
import CustomFormField, {
  FormFieldType,
  InputType,
} from "@/components/shared/CustomFormField";
import ImageDropzone from "@/components/shared/image/ImageDropzone";
import SwitchFormField from "@/components/shared/SwitchFormField";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { MATERIAL_STATUS } from "@/constants";
import { FormModeEnum, MaterialStatusEnum } from "@/enums";
import { createMaterial, updateMaterial } from "@/lib/actions/material.actions";
import { formatErrorResponse } from "@/lib/formatters";
import { cn, showSuccessMessage } from "@/lib/utils";
import { MaterialFormData, materialFormSchema } from "@/schemas";
import { ApiResponse } from "@/types/api";
import { Classification } from "@/types/generics";
import { Material } from "@/types/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  form: UseFormReturn<MaterialFormData>;
  mode: FormModeEnum;
  materialTypes: Classification[];
  brands: Classification[];
  className?: string;
};

export const useMaterialForm = ({
  material = undefined,
  mode,
}: {
  material?: Material;
  mode: FormModeEnum;
}) => {
  const router = useRouter();
  const form = useForm<MaterialFormData>({
    resolver: zodResolver(materialFormSchema),
    defaultValues: {
      agency: material?.agency ?? "",
      name: material?.name ?? "",
      code: material?.code ?? "",
      type: material?.type.id ?? "",
      thumbnail: material?.thumbnail ?? undefined,
      brand: material?.brand?.id ?? "",
      area: material?.area ?? "",
      stock: material?.stock ?? 1,
      status: material?.status ?? MaterialStatusEnum.AVAILABLE,
      archived: material?.archived ?? false,
    },
  });

  const onSubmit = async (
    values: z.infer<typeof materialFormSchema>,
    setOpen: (value: boolean) => void,
  ) => {
    const formData = new FormData();
    formData.append("agency", values.agency);
    formData.append("name", values.name);
    formData.append("code", values.code);
    formData.append("type", values.type);
    formData.append("brand", values.brand);
    formData.append("area", values.area);
    formData.append("stock", values.stock.toString());
    formData.append("status", values.status);
    formData.append("archived", values.archived.toString());

    if (values.thumbnail instanceof File) {
      formData.append("thumbnail", values.thumbnail);
    }

    const result: ApiResponse<Material> =
      mode === FormModeEnum.CREATE
        ? await createMaterial(formData)
        : await updateMaterial(material!.id, formData);

    if (result.errors) {
      toast.error(formatErrorResponse(result.errors), {
        position: "top-center",
      });
      return;
    }

    showSuccessMessage(mode as FormModeEnum, "material");
    setOpen(false);
    form.reset(mode === FormModeEnum.CREATE ? undefined : values);
    router.refresh();
  };
  return { form, onSubmit };
};

const MaterialForm = ({
  form,
  mode,
  materialTypes,
  brands,
  className,
}: Props) => {
  const router = useRouter();

  return (
    <Form {...form}>
      <div
        className={cn(
          "-mx-6 max-h-[32rem] overflow-y-auto px-6 text-sm flex flex-col gap-4",
          className,
        )}
      >
        <div className="flex flex-row gap-2 items-start">
          <ImageDropzone
            control={form.control}
            name="thumbnail"
            disabled={form.formState.isSubmitting}
          />
          <div className="space-y-2 w-full">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="name"
              label="Name"
              placeholder="Monobloc Chair"
              disabled={form.formState.isSubmitting}
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="code"
              label="Code"
              placeholder="MC001"
              disabled={form.formState.isSubmitting}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="agency"
            label="Agency"
            placeholder="AdTalk"
            disabled={form.formState.isSubmitting}
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="area"
            label="Area"
            placeholder="Quezon City"
            disabled={form.formState.isSubmitting}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <ComboBoxFormField
            items={brands.map((brand) => ({
              label: brand.name,
              value: brand.id,
            }))}
            control={form.control}
            name="brand"
            placeholder={{
              triggerPlaceholder: "Select brand...",
              searchPlaceholder: "Search brand...",
            }}
            label="Brand"
            popOverSize="w-full"
            footer={{
              onSelect: () => router.push("/classifications"),
              label: "Add brand",
            }}
            disabled={form.formState.isSubmitting}
          />
          <ComboBoxFormField
            items={(materialTypes ?? []).map((type) => ({
              label: type.name,
              value: type.id,
            }))}
            control={form.control}
            name="type"
            placeholder={{
              triggerPlaceholder: "Select type...",
              searchPlaceholder: "Search type...",
            }}
            label="Type"
            popOverSize="w-full"
            footer={{
              onSelect: () => router.push("/classifications"),
              label: "Add type",
            }}
            disabled={form.formState.isSubmitting}
          />
        </div>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          inputType={InputType.NUMBER}
          control={form.control}
          name="stock"
          label="Stock"
          placeholder="10"
          disabled={form.formState.isSubmitting}
        />

        {mode === FormModeEnum.EDIT && (
          <React.Fragment>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="status"
              label="Status"
              placeholder="Select status"
              disabled={form.formState.isSubmitting}
            >
              {Object.keys(MATERIAL_STATUS).map((status, key) => (
                <SelectItem key={key} value={status}>
                  {MATERIAL_STATUS[status as keyof typeof MATERIAL_STATUS]}
                </SelectItem>
              ))}
            </CustomFormField>
            <SwitchFormField
              control={form.control}
              name="archived"
              label="Archived"
              description="Toggle to archive this material. When archived, the material will be 
            removed from available lists but can be restored later if needed."
            />
          </React.Fragment>
        )}
      </div>
    </Form>
  );
};

export default MaterialForm;
