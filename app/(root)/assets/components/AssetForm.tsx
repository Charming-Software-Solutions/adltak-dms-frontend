"use client";

import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AssetFormData } from "@/schemas";
import { Classification } from "@/types/generics";
import React from "react";
import { UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<AssetFormData>;
  assetTypes: Classification[];
  className?: string;
};

const AssetForm = ({ form, assetTypes, className }: Props) => {
  return (
    <Form {...form}>
      <div className={cn("form-container", className)}>
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Asset Name"
          placeholder="Monobloc Chair"
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="code"
          label="Asset Code"
          placeholder="MC001"
        />
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="type"
          label="Asset Type"
          placeholder="Select type"
        >
          {assetTypes.map((type, key) => (
            <SelectItem key={key} value={type.id}>
              {type.name}
            </SelectItem>
          ))}
        </CustomFormField>
      </div>
    </Form>
  );
};

export default AssetForm;
