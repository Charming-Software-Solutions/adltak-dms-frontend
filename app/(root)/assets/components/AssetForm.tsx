"use client";

import ComboBoxFormField from "@/components/shared/ComboBoxFormField";
import CustomFormField, {
  FormFieldType,
  InputType,
} from "@/components/shared/CustomFormField";
import ImageDropzone from "@/components/shared/image/ImageDropzone";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { FormModeEnum } from "@/enums";
import { createAsset, updateAsset } from "@/lib/actions/asset.actions";
import { formatErrorResponse } from "@/lib/formatters";
import { cn, showSuccessMessage } from "@/lib/utils";
import { AssetFormData, assetFormSchema } from "@/schemas";
import { ApiResponse } from "@/types/api";
import { Asset } from "@/types/asset";
import { Classification } from "@/types/generics";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  form: UseFormReturn<AssetFormData>;
  assetTypes: Classification[];
  brands: Classification[];
  className?: string;
};

export const useAssetForm = ({
  asset = undefined,
  mode,
}: {
  asset?: Asset;
  mode: "create" | "edit";
}) => {
  const router = useRouter();

  const form = useForm<AssetFormData>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      agency: asset?.agency ?? "",
      name: asset?.name ?? "",
      code: asset?.code ?? "",
      type: asset?.type.id ?? "",
      thumbnail: asset?.thumbnail ?? undefined,
      brand: asset?.brand?.id ?? "",
      area: asset?.area ?? "",
      stock: asset?.stock ?? 1,
    },
  });

  const onSubmit = async (
    values: z.infer<typeof assetFormSchema>,
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

    if (values.thumbnail instanceof File) {
      formData.append("thumbnail", values.thumbnail);
    }

    const result: ApiResponse<Asset> =
      mode === "create"
        ? await createAsset(formData)
        : await updateAsset(asset!.id, formData);

    if (result.errors) {
      toast.error(formatErrorResponse(result.errors), {
        position: "top-center",
      });
      return;
    }

    showSuccessMessage(mode as FormModeEnum, "asset");
    setOpen(false);
    form.reset(mode === "create" ? undefined : values);
    router.refresh();
  };
  return { form, onSubmit };
};

const AssetForm = ({ form, assetTypes, brands, className }: Props) => {
  return (
    <Form {...form}>
      <div className={cn("form-container", className)}>
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
          popOverSize="md:min-w-[28.3rem]"
          disabled={form.formState.isSubmitting}
        />
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="type"
          label="Type"
          placeholder="Select type"
          disabled={form.formState.isSubmitting}
        >
          {assetTypes.map((type, key) => (
            <SelectItem key={key} value={type.id}>
              {type.name}
            </SelectItem>
          ))}
        </CustomFormField>
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          inputType={InputType.NUMBER}
          control={form.control}
          name="stock"
          label="Total Quantity"
          placeholder="10"
          disabled={form.formState.isSubmitting}
        />
      </div>
    </Form>
  );
};

export default AssetForm;
