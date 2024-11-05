import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { DISTRIBUTION_STATUSES } from "@/constants";
import { ICreateDistribution } from "@/interfaces";
import {
  createDistribution,
  updateDistribution,
} from "@/lib/actions/distribution.actions";
import { formatErrorResponse } from "@/lib/formatters";
import { QuantityItem } from "@/lib/store";
import { cn } from "@/lib/utils";
import { DistributionFormData, distributionFormSchema } from "@/schemas";
import { ApiResponse } from "@/types/api";
import { Distribution, DistributionProduct } from "@/types/distribution";
import { SelectItemType } from "@/types/primitives";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

export const useDistributionForm = ({
  distribution = undefined,
  mode,
}: {
  distribution?: Distribution;
  mode: "create" | "edit";
}) => {
  const router = useRouter();

  const form = useForm<DistributionFormData>({
    resolver: zodResolver(distributionFormSchema),
    defaultValues: {
      client: distribution?.client ?? "",
      type: distribution?.type ?? "",
      status: distribution?.status ?? "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof distributionFormSchema>,
    setOpen: (value: boolean) => void,
    items?: QuantityItem<DistributionProduct>[],
    clearItems?: () => void,
  ) => {
    let distributionCreate: ICreateDistribution | undefined;
    const distributionUpdate = new FormData();

    if (mode === "create" && items && items.length > 0) {
      distributionCreate = {
        employee: "Jonny English",
        products: items.map((item) => ({
          product: item.id,
          quantity: item.quantity,
        })),
        type: values.type,
        status: values.status,
        client: values.client,
      };
    } else {
      distributionUpdate.append("employee", "Johnny English");
      distributionUpdate.append("type", values.type);
      distributionUpdate.append("status", values.status);
      distributionUpdate.append("client", values.client);
    }

    const result: ApiResponse<Distribution> =
      mode === "create"
        ? await createDistribution(distributionCreate!)
        : await updateDistribution(distribution!.id, distributionUpdate);

    if (result.errors) {
      toast.error(formatErrorResponse(result.errors), {
        position: "top-center",
      });
    } else {
      setOpen(false);
      router.refresh();
      form.reset();
      clearItems?.();
    }
  };

  return { form, onSubmit };
};

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
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="status"
          label="Status"
          placeholder="Select status"
        >
          {Object.keys(DISTRIBUTION_STATUSES).map((status, key) => (
            <SelectItem key={key} value={status}>
              {
                DISTRIBUTION_STATUSES[
                  status as keyof typeof DISTRIBUTION_STATUSES
                ]
              }
            </SelectItem>
          ))}
        </CustomFormField>
      </div>
    </Form>
  );
};

export default DistributionForm;
