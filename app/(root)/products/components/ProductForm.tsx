"use client";

import CustomFormField, {
  FormFieldType,
  InputType,
} from "@/components/shared/CustomFormField";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ProductFormData } from "@/schemas";
import { Brand, Category, Type } from "@/types/product";
import { UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<ProductFormData>;
  brands: Brand[];
  categories: Category[];
  types: Type[];
  className?: string;
  formReset: boolean;
};

const ProductForm = ({
  form,
  brands,
  categories,
  types,
  className,
  formReset,
}: Props) => {
  return (
    <Form {...form}>
      <div className={cn("flex flex-col gap-4 px-1", className)}>
        <CustomFormField
          fieldType={FormFieldType.IMAGE}
          control={form.control}
          name="thumbnail"
          formReset={formReset}
          disabled={form.formState.isSubmitting}
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Product Name"
          placeholder="Piattos"
        />
        <div className="flex gap-2 items-end">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="sku"
            label="Product SKU"
            placeholder="SKU-123"
          />
        </div>
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="brand"
          label="Product Brand"
          placeholder="Select brand"
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
        />
      </div>
    </Form>
  );
};

export default ProductForm;
