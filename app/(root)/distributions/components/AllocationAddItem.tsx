"use client";

import IconButton from "@/components/shared/buttons/IconButton";
import ComboBoxFormField from "@/components/shared/ComboBoxFormField";
import CustomFormField, {
  FormFieldType,
  InputType,
} from "@/components/shared/CustomFormField";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { imagePlaceholder } from "@/constants";
import { AssetStatusEnum } from "@/enums";
import { getAssets } from "@/lib/actions/asset.actions";
import { getProducts } from "@/lib/actions/product.actions";
import { useAllocationStore } from "@/lib/store";
import { cn, formatExpiration } from "@/lib/utils";
import { DistributionItemFormData, distributionItemSchema } from "@/schemas";
import { Asset } from "@/types/asset";
import {
  DistributionAsset,
  DistributionProduct,
  DistributionType,
} from "@/types/distribution";
import { Product } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, MinusIcon, PlusIcon, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type AllocationItemType = "product" | "asset";
type AllocationAddItemProps = {
  allocationType: DistributionType;
  itemType: AllocationItemType;
  className?: string;
};

const useAllocationItemForm = (type: AllocationItemType) => {
  return useForm<DistributionItemFormData>({
    resolver: zodResolver(distributionItemSchema),
    defaultValues: {
      item: "",
      quantity: 1,
      type,
    },
  });
};

const AllocationAddItem = ({
  allocationType,
  itemType,
  className,
}: AllocationAddItemProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useAllocationItemForm(itemType);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["fetch-allocation-items", itemType],
    queryFn: async () => {
      const filteredAssets = (await getAssets()).filter(
        (asset) => asset.status === AssetStatusEnum.AVAILABLE,
      );
      const items =
        itemType === "product"
          ? await getProducts()
          : allocationType === "IMPORT"
            ? await getAssets()
            : filteredAssets;
      return items;
    },
  });

  const { items, addItem, removeItem, updateQuantity, clearItems } =
    useAllocationStore();

  const findItemById = (id: string) => {
    return (data ?? []).find((item) => item.id === id);
  };

  const onSubmit = async (values: z.infer<typeof distributionItemSchema>) => {
    const item = findItemById(values.item);
    if (!item) {
      setErrorMessage("Item not found.");
      return;
    }

    const totalQuantityForProduct = items
      // If it's a product item, compare `product.id` to `item.id`
      .filter((i) => "product" in i && i.product.id === item.id)
      .reduce((acc, i) => acc + i.quantity, 0);

    // Check totalQuantityForProduct + values.quantity exceeds the item's stock
    const isOverStock =
      allocationType === "EXPORT" &&
      (values.quantity > item.stock ||
        totalQuantityForProduct + values.quantity > item.stock);

    if (isOverStock) {
      setErrorMessage("Item quantity has reached the limit.");
      return;
    }

    // Remove error message when !isOverStock
    setErrorMessage(null);

    addItem(
      itemType === "product"
        ? {
            id: `${item.id}-${values.expiration}`,
            product: item as Product,
            quantity: values.quantity,
            expiration: values.expiration
              ? values.expiration.toISOString()
              : "",
          }
        : {
            id: item.id,
            asset: item as Asset,
            quantity: values.quantity,
          },
    );
  };

  return (
    <Form {...form}>
      <div className={cn("space-y-2 px-1", className)}>
        <ComboBoxFormField
          items={(data ?? []).map((item) => ({
            label: item.name,
            value: item.id,
            children: (
              <Badge
                key={item.id}
                variant="outline"
                className="rounded-md p-1.5 w-20 text-center flex-shrink-0 flex items-center justify-center"
              >
                <span className="font-semibold">Stock:</span> {item.stock}
              </Badge>
            ),
          }))}
          control={form.control}
          name="item"
          placeholder={{
            triggerPlaceholder:
              itemType === "product" ? "Select product..." : "Select asset...",
            searchPlaceholder:
              itemType === "product" ? "Search product..." : "Search asset...",
          }}
          label={itemType === "product" ? "Product" : "Asset"}
          popOverSize="md:min-w-[30rem]"
          disabled={form.formState.isSubmitting}
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          inputType={InputType.NUMBER}
          control={form.control}
          name="quantity"
          label="Quantity"
          placeholder="10"
          disabled={form.formState.isSubmitting}
          minInputNumber={1}
        />
        {itemType === "product" && (
          <CustomFormField
            fieldType={FormFieldType.DATE}
            control={form.control}
            name="expiration"
            label="Expiration"
            placeholder="Select date"
            disabled={form.formState.isSubmitting}
          />
        )}

        <div className="flex w-full gap-2">
          <Button
            variant="outline"
            className="flex-grow w-full"
            disabled={!form.formState.isValid}
            onClick={() => form.handleSubmit(onSubmit)()}
          >
            {itemType === "product" ? "Add Product" : "Add Asset"}
          </Button>
          <Button
            variant="outline"
            className="flex-grow w-full"
            disabled={items.length === 0}
            onClick={() => clearItems(itemType)}
          >
            {itemType === "product" ? "Clear Products" : "Clear Assets"}
          </Button>
        </div>
        {errorMessage && (
          <Alert variant="destructive" className="bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </div>
              <Button
                variant={"outline"}
                className="text-foreground h-8"
                onClick={() => setErrorMessage("")}
              >
                Clear
              </Button>
            </div>
          </Alert>
        )}
      </div>

      {!errorMessage && (
        <ScrollArea className="h-85">
          <div className="flex flex-col gap-2 pt-3 px-1">
            {items
              .filter((item) =>
                itemType === "product" ? "product" in item : "asset" in item,
              )
              .map((object, index) => {
                const allocationItem =
                  itemType === "product"
                    ? (object as DistributionProduct).product
                    : (object as DistributionAsset).asset;
                const isMinusDisabled = object.quantity <= 1;

                // Checks if total quantity for all products that have the
                // same product id exceeds the total stock when added all up
                const totalQtyForSameProduct = items
                  .filter((i) => {
                    if (itemType === "product" && "product" in i) {
                      return i.product.id === allocationItem?.id;
                    }
                    return false;
                  })
                  .reduce((acc, i) => acc + i.quantity, 0);

                const isPlusDisabled =
                  allocationType === "EXPORT" &&
                  totalQtyForSameProduct + 1 > (allocationItem?.stock ?? 0);

                return (
                  <Card key={index}>
                    <CardContent className="flex flex-col items-start justify-between p-4 space-y-2.5 md:space-y-0 md:flex-row md:items-center ">
                      <div className="flex items-center gap-3">
                        <Image
                          src={allocationItem?.thumbnail ?? imagePlaceholder}
                          alt={`${itemType}-thumbnail`}
                          className="h-[3.5rem] w-auto object-contain rounded-sm"
                          priority
                          width={100}
                          height={100}
                        />
                        <div className="grid flex-1 gap-1 text-left text-sm leading-tight">
                          <span className="truncate max-w-[12rem] font-semibold">
                            {allocationItem?.name || "Unknown"}
                          </span>
                          <div className="flex space-x-2 items-center">
                            <span className="truncate text-xs">
                              {allocationItem?.type?.name || "Unknown Type"}
                            </span>

                            {(object as DistributionProduct).expiration && (
                              <>
                                <Separator
                                  orientation="vertical"
                                  className="h-2"
                                />
                                <span className="truncate text-xs">
                                  <strong>EXP: </strong>
                                  {formatExpiration(
                                    (object as DistributionProduct).expiration,
                                  )}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        <div className="flex flex-row w-full items-center justify-between border rounded-md px-2">
                          <IconButton
                            className="p-1 rounded-sm transition-colors size-6"
                            disabled={isMinusDisabled}
                            onClick={() => {
                              updateQuantity(object.id, object.quantity - 1);
                            }}
                            tooltip="Decrease quantity"
                          >
                            <MinusIcon className="size-4" />
                          </IconButton>

                          <span className="text-sm mx-auto w-6 text-center inline-block select-none">
                            {object.quantity}
                          </span>

                          <IconButton
                            className="p-1 rounded-sm transition-colors size-6"
                            disabled={isPlusDisabled}
                            onClick={() => {
                              updateQuantity(object.id, object.quantity + 1);
                            }}
                            tooltip="Increase quantity"
                          >
                            <PlusIcon className="size-4" />
                          </IconButton>
                        </div>
                        <IconButton
                          className="w-16"
                          onClick={() => removeItem(object.id)}
                          tooltip="Delete Item"
                        >
                          <Trash className="size-4 text-red-500" />
                        </IconButton>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </ScrollArea>
      )}
    </Form>
  );
};

export default AllocationAddItem;
