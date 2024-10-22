"use client";

import CustomFormField, {
  FormFieldType,
  InputType,
} from "@/components/shared/CustomFormField";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SelectItem } from "@/components/ui/select";
import { imagePlaceholder } from "@/constants";
import { useDistributionProductForm } from "@/hooks";
import { useDistributionStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { distributionProductSchema } from "@/schemas";
import { DistributionProduct } from "@/types/distribution";
import { Product } from "@/types/product";
import { Trash } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { z } from "zod";
import { useShallow } from "zustand/shallow";

type Props = {
  products: Product[];
  className?: string;
};

const DistributionAddProduct = ({ products, className }: Props) => {
  const form = useDistributionProductForm();
  const { items, clearItems, removeItem } = useDistributionStore(
    useShallow((state) => ({
      items: state.items,
      clearItems: state.clearItems,
      removeItem: state.removeItem,
    })),
  );

  const findProductById = (id: string): Product | undefined => {
    return products.find((product) => product.id === id);
  };

  const onSubmit = async (
    values: z.infer<typeof distributionProductSchema>,
  ) => {
    const product = findProductById(values.product);

    if (!product) {
      toast.error("Product does not exist", {
        position: "top-center",
      });
    } else {
      const distributionProduct: DistributionProduct = {
        id: product.id,
        product: product,
        quantity: values.quantity,
      };

      const { addItem } = useDistributionStore.getState();
      addItem(distributionProduct);
    }
  };

  return (
    <Form {...form}>
      <div className={cn("space-y-2 px-1", className)}>
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="product"
          label="Product"
          placeholder="Select Product"
        >
          {products.map((product, key) => (
            <SelectItem key={key} value={product.id}>
              {product.name}
            </SelectItem>
          ))}
        </CustomFormField>
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          inputType={InputType.NUMBER}
          control={form.control}
          name="quantity"
          label="Quantity"
          placeholder="10"
        />
        <div className="flex w-full gap-2">
          <Button
            variant={"outline"}
            className="flex-grow w-full"
            disabled={!form.formState.isValid}
            onClick={() => form.handleSubmit(onSubmit)()}
          >
            Add Product
          </Button>
          <Button
            variant={"outline"}
            className="flex-grow w-full"
            disabled={items.length === 0}
            onClick={() => clearItems()}
          >
            Clear Products
          </Button>
        </div>
      </div>

      <ScrollArea className="h-85">
        <div className="flex flex-col gap-2 pt-3 px-1">
          {items.map((storeItem) => (
            <Card
              className="flex items-center justify-between p-1"
              key={storeItem.id}
            >
              <div className="flex items-center gap-2">
                <Image
                  src={storeItem.item.product.thumbnail ?? imagePlaceholder}
                  alt={"product-thumbnail"}
                  className="h-[3rem] w-auto object-contain rounded-sm"
                  priority
                  width={100}
                  height={100}
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate max-w-[7rem] font-semibold">
                    {storeItem.item.product.name}
                  </span>
                  <span className="truncate text-xs">
                    {storeItem.item.product.brand.name}{" "}
                  </span>
                </div>
              </div>
              <span className="text-sm">x{storeItem.quantity}</span>
              <span className="text-sm mr-2 font-semibold">
                {storeItem.item.product.sku}
              </span>
              <Button
                variant={"outline"}
                size={"icon"}
                onClick={() => removeItem(storeItem.id)}
              >
                <Trash className="size-4" />
              </Button>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Form>
  );
};

export default DistributionAddProduct;
