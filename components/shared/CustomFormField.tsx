"use client";

import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import ImageInput from "./image/ImageInput";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  CHECKBOX = "checkbox",
  SELECT = "select",
  SKELETON = "skeleton",
  IMAGE = "image",
}

export enum InputType {
  TEXT = "text",
  NUMBER = "number",
  EMAIL = "email",
}

// Main interface for form field props
interface BaseCustomProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: React.ReactNode;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FormFieldType;
  inputType?: InputType;
}

// Additional props for ImageField that require `formReset`
interface ImageFieldProps extends BaseCustomProps {
  fieldType: FormFieldType.IMAGE; // Ensure it's specifically for IMAGE
  formReset: boolean; // Required
  disabled: boolean;
  size: string;
}

// Union type for custom props
type CustomProps = BaseCustomProps | ImageFieldProps;

const RenderInput = ({ field, props }: { field: any; props: CustomProps }) => {
  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-md border items-center">
          {props.iconSrc}
          <FormControl>
            <Input
              placeholder={props.placeholder}
              {...field}
              className="h-11 p-regular-16 md:p-regular-14 border-0"
              type={props.inputType ?? "text"}
            />
          </FormControl>
        </div>
      );
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            disabled={props.disabled}
          />
        </FormControl>
      );
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>{props.children}</SelectContent>
          </Select>
        </FormControl>
      );
    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;
    case FormFieldType.IMAGE:
      const imageProps = props as ImageFieldProps;
      return (
        <FormControl>
          <ImageInput
            mode={"create"}
            value={field.value}
            disabled={imageProps.disabled}
            formReset={imageProps.formReset}
            onChange={field.onChange}
          />
        </FormControl>
      );
    default:
      return null;
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, name, label } = props;

  return (
    <FormField
      disabled={props.disabled}
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {props.fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel>{label}</FormLabel>
          )}
          <RenderInput field={field} props={props} />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
