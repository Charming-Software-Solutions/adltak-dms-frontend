"use client";

import ComboBoxFormField from "@/components/shared/ComboBoxFormField";
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import ImageDropzone from "@/components/shared/image/ImageDropzone";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { ASSET_STATUS } from "@/constants";
import { createAsset, updateAsset } from "@/lib/actions/asset.actions";
import { formatErrorResponse } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { AssetFormData, assetFormSchema } from "@/schemas";
import { ApiResponse } from "@/types/api";
import { Asset } from "@/types/asset";
import { Classification } from "@/types/generics";
import { Product } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  form: UseFormReturn<AssetFormData>;
  assetTypes: Classification[];
  products: Product[];
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
      name: asset?.name ?? "",
      code: asset?.code ?? "",
      type: asset?.type.id ?? "",
      status: asset?.status ?? "",
      thumbnail: asset?.thumbnail ?? undefined,
      product: asset?.product?.id ?? "",
      area: asset?.area ?? "",
      baReferenceNumber: asset?.ba_reference_number ?? "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof assetFormSchema>,
    setOpen: (value: boolean) => void,
  ) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("code", values.code);
    formData.append("type", values.type);
    formData.append("status", values.status);
    formData.append("product", values.product);
    formData.append("area", values.area);
    formData.append("ba_reference_number", values.baReferenceNumber);

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

const AssetForm = ({ form, assetTypes, products, className }: Props) => {
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
          name="baReferenceNumber"
          label="BA Reference Number"
          placeholder="BA1234567890"
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
          items={products.map((product) => ({
            label: product.name,
            value: product.id,
          }))}
          control={form.control}
          name="product"
          placeholder={{
            triggerPlaceholder: "Select product...",
            searchPlaceholder: "Search product...",
          }}
          label="Product"
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
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="status"
          label="Status"
          placeholder="Select status"
          disabled={form.formState.isSubmitting}
        >
          {Object.keys(ASSET_STATUS).map((status, key) => (
            <SelectItem key={key} value={status}>
              {ASSET_STATUS[status as keyof typeof ASSET_STATUS]}
            </SelectItem>
          ))}
        </CustomFormField>
      </div>
    </Form>
  );
};

export default AssetForm;
