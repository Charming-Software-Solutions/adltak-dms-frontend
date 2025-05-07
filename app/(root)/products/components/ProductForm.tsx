"use client";

import ComboBoxFormField from "@/components/shared/ComboBoxFormField";
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import ImageDropzone from "@/components/shared/image/ImageDropzone";
import SwitchFormField from "@/components/shared/SwitchFormField";
import { Form } from "@/components/ui/form";
import { FormModeEnum, UserRoleEnum } from "@/enums";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { hasPermission } from "@/lib/auth";
import { formatErrorResponse } from "@/lib/formatters";
import { cn, showSuccessMessage } from "@/lib/utils";
import { ProductFormData, productFormSchema } from "@/schemas";
import { ApiResponse } from "@/types/api";
import { Brand, Category, Product, Type } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  form: UseFormReturn<ProductFormData>;
  userRoles?: UserRoleEnum[];
  brands: Brand[];
  categories: Category[];
  types: Type[];
  mode: FormModeEnum;
  className?: string;
};

export const useProductForm = ({
  product = undefined,
  mode,
}: {
  product?: Product;
  mode: FormModeEnum;
}) => {
  const router = useRouter();
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      sku: product?.sku ?? "",
      name: product?.name ?? "",
      brand: product?.brand.id ?? "",
      category: product?.category.id ?? "",
      type: product?.type.id ?? "",
      thumbnail: product?.thumbnail ?? "",
      area: product?.area ?? "",
      discontinued: product?.discontinued ?? false,
    },
  });

  const onSubmit = async (
    values: z.infer<typeof productFormSchema>,
    setOpen: (value: boolean) => void,
  ) => {
    const formData = new FormData();
    formData.append("sku", values.sku);
    formData.append("name", values.name);
    formData.append("brand", values.brand);
    formData.append("category", values.category);
    formData.append("type", values.type);
    formData.append("area", values.area);
    formData.append("discontinued", values.discontinued.toString());

    if (values.thumbnail instanceof File) {
      formData.append("thumbnail", values.thumbnail);
    }

    const result: ApiResponse<Product> =
      mode === FormModeEnum.CREATE
        ? await createProduct(formData)
        : await updateProduct(product!.id, formData);

    if (result.errors) {
      toast.error(formatErrorResponse(result.errors), {
        position: "top-center",
      });
      return;
    }

    // If successful
    showSuccessMessage(mode as FormModeEnum, "product");
    setOpen(false);
    form.reset(mode === FormModeEnum.CREATE ? undefined : values);
    router.refresh();
  };

  return { form, onSubmit };
};

const ProductForm = ({
  form,
  userRoles = [],
  brands,
  categories,
  types,
  mode,
  className,
}: Props) => {
  const router = useRouter();
  const formDisabled =
    form.formState.isSubmitting ||
    (userRoles.length > 0 && !hasPermission(userRoles, [UserRoleEnum.ADMIN]));

  return (
    <Form {...form}>
      <div
        className={cn(
          "-mx-6 max-h-[40rem] overflow-y-auto px-6 text-sm flex flex-col gap-4",
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
              label="Product Name"
              placeholder="Piattos"
              disabled={formDisabled}
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="sku"
              label="Product SKU"
              placeholder="SKU-123"
              disabled={formDisabled}
            />
          </div>
        </div>
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
          popOverSize="md:min-w-[29rem]"
          footer={{
            onSelect: () => router.push("/classifications"),
            label: "Add brand",
          }}
          disabled={form.formState.isSubmitting}
        />
        <ComboBoxFormField
          items={(categories ?? []).map((category) => ({
            label: category.name,
            value: category.id,
          }))}
          control={form.control}
          name="category"
          placeholder={{
            triggerPlaceholder: "Select category...",
            searchPlaceholder: "Search category...",
          }}
          label="Category"
          popOverSize="md:min-w-[29rem]"
          footer={{
            onSelect: () => router.push("/classifications"),
            label: "Add category",
          }}
          disabled={form.formState.isSubmitting}
        />
        <ComboBoxFormField
          items={(types ?? []).map((type) => ({
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
          popOverSize="md:min-w-[29rem]"
          footer={{
            onSelect: () => router.push("/classifications"),
            label: "Add type",
          }}
          disabled={form.formState.isSubmitting}
        />
        {mode === FormModeEnum.EDIT && (
          <SwitchFormField
            control={form.control}
            name="discontinued"
            label="Discontinued"
            description="Mark this option if the product is no longer available for sale or actively produced."
          />
        )}
      </div>
    </Form>
  );
};

export default ProductForm;
