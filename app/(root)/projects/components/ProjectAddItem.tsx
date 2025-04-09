"use client";

import IconButton from "@/components/shared/buttons/IconButton";
import ComboBoxFormField from "@/components/shared/ComboBoxFormField";
import CustomFormField, {
  FormFieldType,
  InputType,
} from "@/components/shared/CustomFormField";
import QuantityAdjuster from "@/components/shared/QuantityAdjuster";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { imagePlaceholder } from "@/constants";
import { MaterialStatusEnum } from "@/enums";
import { getMaterials } from "@/lib/actions/material.actions";
import { getProducts } from "@/lib/actions/product.actions";
import { useProjectItemStore } from "@/lib/store";
import { cn, formatExpiration } from "@/lib/utils";
import { ProjectItemFormdata, projectItemSchema } from "@/schemas";
import { Material } from "@/types/material";
import { Product } from "@/types/product";
import { ProjectMaterial, ProjectProduct } from "@/types/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type ProjectItemType = "product" | "material";

type ProjectAddItemProps = {
  itemType: ProjectItemType;
  className?: string;
};

const useProjectAddItemForm = (type: ProjectItemType) => {
  return useForm<ProjectItemFormdata>({
    resolver: zodResolver(projectItemSchema),
    defaultValues: {
      item: "",
      quantity: 1,
      type,
    },
  });
};

const ProjectAddItem = ({ itemType, className }: ProjectAddItemProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useProjectAddItemForm(itemType);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["fetch-project-items", itemType],
    queryFn: async () => {
      const filteredMaterials = (await getMaterials()).filter(
        (material) =>
          material.status === MaterialStatusEnum.AVAILABLE &&
          !material.archived,
      );
      const filteredProducts = (await getProducts()).filter(
        (product) => !product.discontinued,
      );
      const items =
        itemType === "product" ? filteredProducts : filteredMaterials;
      return items;
    },
  });

  const { items, addItem, removeItem, updateQuantity, clearItems } =
    useProjectItemStore();

  const findItemById = (id: string) => {
    return (data ?? []).find((item) => item.id === id);
  };

  const onSubmit = async (values: z.infer<typeof projectItemSchema>) => {
    const item = findItemById(values.item);
    if (!item) {
      setErrorMessage("Item not found.");
      return;
    }

    const projectProduct = {
      id: `${item.id}-${values.expiration}`,
      product: item as Product,
      quantity: values.quantity,
      expiration: values.expiration ? values.expiration.toISOString() : "",
      used_quantity: 0,
      remaining_quantity: 0,
    };
    const projectMaterial = {
      id: item.id,
      material: item as Material,
      material_name: "",
      material_type: "",
      quantity: values.quantity,
      used_quantity: 0,
    };

    addItem(itemType === "product" ? projectProduct : projectMaterial);
  };

  return (
    <Form {...form}>
      <div className={cn("space-y-2 px-1", className)}>
        <ComboBoxFormField
          items={(data ?? []).map((item) => ({
            label: item.name,
            value: item.id,
            children:
              itemType === "material" ? (
                <Badge
                  key={item.id}
                  variant="outline"
                  className="rounded-md p-1.5 w-20 text-center flex-shrink-0 flex items-center justify-center"
                >
                  <span className="font-semibold">Stock:</span> {item.stock}
                </Badge>
              ) : null,
          }))}
          control={form.control}
          name="item"
          placeholder={{
            triggerPlaceholder:
              itemType === "product"
                ? "Select product..."
                : "Select material...",
            searchPlaceholder:
              itemType === "product"
                ? "Search product..."
                : "Search material...",
          }}
          label={itemType === "product" ? "Product" : "Material"}
          popOverSize="md:min-w-[26rem]"
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
            {itemType === "product" ? "Add Product" : "Add Material"}
          </Button>
          <Button
            variant="outline"
            className="flex-grow w-full"
            disabled={items.length === 0}
            onClick={() => clearItems(itemType)}
          >
            {itemType === "product" ? "Clear Products" : "Clear Materials"}
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
        {!errorMessage && items.length > 0 && (
          <div
            key={itemType}
            className="max-h-80 overflow-auto border bg-muted p-4 rounded-md"
          >
            <div className="flex flex-col gap-2">
              {items
                .filter((item) =>
                  itemType === "product"
                    ? "product" in item
                    : "material" in item,
                )
                .map((object, index) => {
                  const projectItem =
                    itemType === "product"
                      ? (object as ProjectProduct).product
                      : (object as ProjectMaterial).material;
                  const isDecrementDisabled = object.quantity <= 1;
                  const isIncrementDisabled =
                    itemType === "material"
                      ? object.quantity >= projectItem.stock
                      : false;

                  return (
                    <Card key={index}>
                      <CardContent className="p-4 space-y-2.5">
                        <div className="flex items-center gap-3">
                          <Image
                            src={projectItem.thumbnail ?? imagePlaceholder}
                            alt={`${itemType}-thumbnail`}
                            className="h-[3.5rem] w-auto object-contain rounded-sm"
                            priority
                            width={100}
                            height={100}
                          />
                          <div className="grid flex-1 gap-1 text-left text-sm leading-tight">
                            <span className="truncate max-w-lg font-semibold">
                              {projectItem.name || "Unknown"}
                            </span>
                            <div className="flex space-x-2 items-center">
                              <span className="truncate text-xs">
                                {projectItem.type.name}
                              </span>
                              {(object as ProjectProduct).expiration && (
                                <>
                                  <Separator
                                    orientation="vertical"
                                    className="h-2"
                                  />
                                  <span className="truncate text-xs">
                                    <strong>EXP: </strong>
                                    {formatExpiration(
                                      (object as ProjectProduct).expiration,
                                    )}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto items-center">
                          <div className="flex items-center">
                            <Badge
                              className="text-xs p-3 rounded-lg truncate"
                              variant={"outline"}
                            >
                              Quantity
                            </Badge>
                          </div>
                          <div>
                            <QuantityAdjuster
                              value={object.quantity}
                              onChange={(newQuantity) =>
                                updateQuantity(object.id, newQuantity)
                              }
                              minMax={
                                itemType === "material"
                                  ? {
                                      min: 1,
                                      max: projectItem.stock,
                                      onMinClick: () =>
                                        updateQuantity(object.id, 1),
                                      onMaxClick: () =>
                                        updateQuantity(
                                          object.id,
                                          projectItem.stock,
                                        ),
                                    }
                                  : null
                              }
                              stepButtons={{
                                decrementDisabled: isDecrementDisabled,
                                incrementDisabled: isIncrementDisabled,
                                onDecrementClick: () =>
                                  updateQuantity(
                                    object.id,
                                    object.quantity - 1,
                                  ),
                                onIncrementClick: () =>
                                  updateQuantity(
                                    object.id,
                                    object.quantity + 1,
                                  ),
                              }}
                            />
                          </div>
                          <IconButton
                            className="w-full"
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
          </div>
        )}
      </div>
    </Form>
  );
};

export default ProjectAddItem;
