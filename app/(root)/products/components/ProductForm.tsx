"use client";

import CustomFormField, {
  FormFieldType,
  InputType,
} from "@/components/shared/CustomFormField";
import ImageDropzone from "@/components/shared/image/ImageDropzone";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { formatErrorResponse } from "@/lib/formatters";
import { cn } from "@/lib/utils";
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
  brands: Brand[];
  categories: Category[];
  types: Type[];
  className?: string;
};

export const useProductForm = ({
  product = undefined,
  mode,
}: {
  product?: Product;
  mode: "create" | "edit";
}) => {
  const router = useRouter();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      sku: product?.sku,
      name: product?.name,
      brand: product?.brand.id,
      category: product?.category.id,
      type: product?.type.id,
      thumbnail: product?.thumbnail,
      stock: product?.stock,
      expiration: product?.expiration
        ? new Date(product?.expiration)
        : undefined,
      area: product?.area ?? "",
      baReferenceNumber: product?.ba_reference_number ?? "",
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
    formData.append("stock", values.stock.toString());
    formData.append("expiration", values.expiration.toISOString());
    formData.append("area", values.area);
    formData.append("ba_reference_number", values.baReferenceNumber);

    if (values.thumbnail instanceof File) {
      formData.append("thumbnail", values.thumbnail);
    }

    try {
      const result: ApiResponse<Product> =
        mode === "create"
          ? await createProduct(formData)
          : await updateProduct(product!.id, formData);

      if (result.errors) {
        toast.error(formatErrorResponse(result.errors), {
          position: "top-center",
        });
      } else {
        form.reset();
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return { form, onSubmit };
};

const ProductForm = ({ form, brands, categories, types, className }: Props) => {
  return (
    <Form {...form}>
      <div className={cn("flex flex-col gap-4 h-full", className)}>
        <div className="flex flex-row gap-2 items-start ">
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
              disabled={form.formState.isSubmitting}
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="sku"
              label="Product SKU"
              placeholder="SKU-123"
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
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="brand"
          label="Product Brand"
          placeholder="Select brand"
          disabled={form.formState.isSubmitting}
        >
          {brands.map((brand, key) => (
            <SelectItem key={key} value={brand.id}>
              {brand.name}
            </SelectItem>
          ))}
        </CustomFormField>
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="category"
          label="Product Category"
          placeholder="Select category"
          disabled={form.formState.isSubmitting}
        >
          {categories.map((category, key) => (
            <SelectItem key={key} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </CustomFormField>
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="type"
          label="Product Type"
          placeholder="Select type"
          disabled={form.formState.isSubmitting}
        >
          {types.map((brand, key) => (
            <SelectItem key={key} value={brand.id}>
              {brand.name}
            </SelectItem>
          ))}
        </CustomFormField>
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          inputType={InputType.NUMBER}
          control={form.control}
          name="stock"
          label="Product stock"
          placeholder="10"
          disabled={form.formState.isSubmitting}
        />
        <CustomFormField
          fieldType={FormFieldType.DATE}
          control={form.control}
          name="expiration"
          label="Product Expiration"
          placeholder="Select date"
          disabled={form.formState.isSubmitting}
        />
      </div>
    </Form>
  );
};

export default ProductForm;
