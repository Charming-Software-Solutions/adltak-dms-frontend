import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { DISTRIBUTION_STATUSES, distributionTypes } from "@/constants";
import { FormModeEnum } from "@/enums";
import { ICreateDistribution } from "@/interfaces";
import {
  createDistribution,
  updateDistribution,
} from "@/lib/actions/distribution.actions";
import { formatErrorResponse } from "@/lib/formatters";
import { useAllocationStore } from "@/lib/store";
import { cn, showSuccessMessage } from "@/lib/utils";
import { DistributionFormData, distributionFormSchema } from "@/schemas";
import { ApiResponse } from "@/types/api";
import { Distribution } from "@/types/distribution";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  form: UseFormReturn<DistributionFormData>;
  mode?: FormModeEnum;
  className?: string;
};

export const useDistributionForm = ({
  distribution = undefined,
  mode,
  employee,
}: {
  distribution?: Distribution;
  mode: "create" | "edit";
  employee?: string;
}) => {
  const router = useRouter();
  const { items, clearItems } = useAllocationStore();

  const form = useForm<DistributionFormData>({
    resolver: zodResolver(distributionFormSchema),
    defaultValues: {
      baReferenceNumber: distribution?.ba_reference_number ?? "",
      client: distribution?.client ?? "",
      type: distribution?.type ?? "",
      status: distribution?.status ?? "PENDING",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof distributionFormSchema>,
    setOpen: (value: boolean) => void,
  ) => {
    let distributionCreate: ICreateDistribution | undefined;
    const distributionUpdate = new FormData();

    // Get items directly from the zustand store
    const productItems = items.filter((item) => "product" in item);
    const assetItems = items.filter((item) => "asset" in item);

    if (mode === "create" && productItems.length > 0) {
      distributionCreate = {
        employee: employee!,
        products: productItems.map((object) => ({
          product: object.product.id,
          quantity: object.quantity,
          expiration: object.expiration,
        })),
        assets: assetItems.map((asset) => ({
          asset: asset.asset.id,
          quantity: asset.quantity,
        })),
        ba_reference_number: values.baReferenceNumber,
        type: values.type,
        status: values.status,
        client: values.client,
      };
    } else {
      distributionUpdate.append(
        "ba_reference_number",
        values.baReferenceNumber,
      );
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
      if (mode === "create") {
        form.reset();
        clearItems();
      }
      showSuccessMessage(mode as FormModeEnum, "distribution");
      setOpen(false);
      router.refresh();
    }
  };

  return { form, onSubmit };
};

const DistributionForm = ({
  form,
  mode = FormModeEnum.CREATE,
  className,
}: Props) => {
  return (
    <Form {...form}>
      <div className={cn("space-y-2 px-1", className)}>
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="baReferenceNumber"
          label="BA Reference Number"
          placeholder="BAmmddyyxx"
          disabled={form.formState.isSubmitting}
        />
        {mode === FormModeEnum.CREATE && (
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="type"
            label="Allocation Type"
            placeholder="Select Type"
            disabled={form.formState.isSubmitting}
          >
            {distributionTypes.map((type, key) => (
              <SelectItem key={key} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </CustomFormField>
        )}
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="client"
          label="Client"
          placeholder="John Doe"
          disabled={form.formState.isSubmitting}
        />
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="status"
          label="Status"
          placeholder="Select status"
          disabled={form.formState.isSubmitting}
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
