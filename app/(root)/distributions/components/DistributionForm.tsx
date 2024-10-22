import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DistributionFormData } from "@/schemas";
import { SelectItemType } from "@/types/primitives";
import { UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<DistributionFormData>;
  className?: string;
};

const distributionTypes: SelectItemType[] = [
  {
    label: "Import",
    value: "IMPORT",
  },
  {
    label: "Export",
    value: "EXPORT",
  },
];

const DistributionForm = ({ form, className }: Props) => {
  return (
    <Form {...form}>
      <div className={cn("space-y-2 px-1", className)}>
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="type"
          label="Distribution Type"
          placeholder="Select Type"
        >
          {distributionTypes.map((type, key) => (
            <SelectItem key={key} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </CustomFormField>
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="client"
          label="Client"
          placeholder="John Doe"
        />
      </div>
    </Form>
  );
};

export default DistributionForm;
