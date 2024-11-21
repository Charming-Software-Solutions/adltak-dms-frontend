"use client";

import ComboBoxFormField from "@/components/shared/ComboBoxFormField";
import CustomFormField, {
  FormFieldType,
  InputType,
} from "@/components/shared/CustomFormField";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { imagePlaceholder } from "@/constants";
import { cn } from "@/lib/utils";
import { DistributionItemFormData, distributionItemSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { UseBoundStore } from "zustand";

type Props<T> = {
  items: T[];
  type: "product" | "asset";
  store: UseBoundStore<any>;
  className?: string;
};

type DistributionBase<T> = {
  id: string;
  [key: string]: T | string | number;
};

function createDistributionItem<T extends { id: string }>(
  item: T,
  quantity: number,
  key: string,
): DistributionBase<T> {
  return {
    id: item.id,
    [key]: item,
    quantity,
  };
}

const useDistributionItemForm = () => {
  return useForm<DistributionItemFormData>({
    resolver: zodResolver(distributionItemSchema),
    defaultValues: {
      item: "",
      quantity: 1,
    },
  });
};

const DistributionAddItem = <T extends { id: string; name: string }>({
  items,
  type,
  store,
  className,
}: Props<T>) => {
  const form = useDistributionItemForm();
  const { addItem, clearItems, removeItem, updateQuantity } = store();

  const findItemById = (id: string): T | undefined => {
    return items.find((item) => item.id === id);
  };

  const onSubmit = async (values: z.infer<typeof distributionItemSchema>) => {
    const item = findItemById(values.item);

    if (!item) {
      toast.error("Item does not exist", {
        position: "top-center",
      });
    } else {
      const distributionItem = createDistributionItem(
        item,
        values.quantity,
        type,
      );
      addItem(distributionItem);
    }
  };

  return (
    <Form {...form}>
      <div className={cn("space-y-2 px-1", className)}>
        <ComboBoxFormField
          items={items.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          control={form.control}
          name="item"
          placeholder={{
            triggerPlaceholder:
              type === "product" ? "Select product..." : "Select asset...",
            searchPlaceholder:
              type === "product" ? "Search product..." : "Search asset...",
          }}
          label={type === "product" ? "Product" : "Asset"}
        />
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
            {type === "product" ? "Add Product" : "Add Asset"}
          </Button>
          <Button
            variant={"outline"}
            className="flex-grow w-full"
            disabled={items.length === 0}
            onClick={() => clearItems()}
          >
            {type === "product" ? "Clear Products" : "Clear Assets"}
          </Button>
        </div>
      </div>

      <ScrollArea className="h-85">
        <div className="flex flex-col gap-2 pt-3 px-1">
          {store.getState().items.map((storeItem: any) => {
            const itemThumbnail =
              type === "product"
                ? storeItem.item.product.thumbnail
                : storeItem.item.asset.thumbnail;
            const itemName =
              type === "product"
                ? storeItem.item.product.name
                : storeItem.item.asset.name;
            const itemClassification =
              type === "product"
                ? storeItem.item.product.brand.name
                : storeItem.item.asset.type.name;
            return (
              <Card
                className="flex items-center justify-between px-3 py-2"
                key={storeItem.id}
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={itemThumbnail || imagePlaceholder}
                    alt={`${type}-thumbnail`}
                    className="h-[3.5rem] w-auto object-contain rounded-sm"
                    priority
                    width={100}
                    height={100}
                  />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate max-w-[12rem] font-semibold">
                      {itemName}
                    </span>
                    <span className="truncate text-xs">
                      {itemClassification}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex flex-row items-center justify-between border rounded-md px-2">
                    <MinusIcon
                      className="size-4 cursor-pointer"
                      onClick={() =>
                        updateQuantity(storeItem.id, storeItem.quantity - 1)
                      }
                    />
                    <span className="text-sm mx-5 w-6 text-center inline-block select-none">
                      {storeItem.quantity}
                    </span>
                    <PlusIcon
                      className="size-4 cursor-pointer"
                      onClick={() =>
                        updateQuantity(storeItem.id, storeItem.quantity + 1)
                      }
                    />
                  </div>
                  <Button
                    variant={"outline"}
                    size={"icon"}
                    onClick={() => removeItem(storeItem.id)}
                  >
                    <Trash className="size-4 text-red-500" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </Form>
  );
};

export default DistributionAddItem;
