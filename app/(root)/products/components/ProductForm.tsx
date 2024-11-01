"use client";

import CustomFormField, {
  FormFieldType,
  InputType,
} from "@/components/shared/CustomFormField";
import ImageDropzone from "@/components/shared/image/ImageDropzone";
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
};

const ProductForm = ({ form, brands, categories, types, className }: Props) => {
  return (
    <Form {...form}>
      <div className={cn("flex flex-col gap-4 px-1", className)}>
        <div className="flex flex-row gap-2 items-start">
          <ImageDropzone control={form.control} name="thumbnail" />
          <div className="space-y-2 w-full">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="name"
              label="Product Name"
              placeholder="Piattos"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="sku"
              label="Product SKU"
              placeholder="SKU-123"
            />
          </div>
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
