"use client";

import React from "react";
import { Card, CardContent } from "../ui/card";
import { FormDescription, FormLabel } from "../ui/form";
import CustomFormField, { FormFieldType } from "./CustomFormField";
import { Control } from "react-hook-form";

type SwitchFormFieldProps = {
  control: Control<any>;
  name: string;
  label: string;
  description: string;
  disabled?: boolean;
};

const SwitchFormField = ({
  control,
  name,
  label,
  description,
  disabled,
}: SwitchFormFieldProps) => {
  return (
    <Card>
      <CardContent className="flex flex-row items-center justify-between p-4">
        <div className="space-y-0.5">
          <FormLabel className="text-base">{label}</FormLabel>
          <FormDescription className="text-xs">{description}</FormDescription>
        </div>
        <CustomFormField
          fieldType={FormFieldType.SWITCH}
          control={control}
          name={name}
          disabled={disabled}
        />
      </CardContent>
    </Card>
  );
};

export default SwitchFormField;
