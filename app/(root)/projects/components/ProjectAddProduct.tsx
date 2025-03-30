"use client";

import IconButton from "@/components/shared/buttons/IconButton";
import ComboBoxFormField from "@/components/shared/ComboBoxFormField";
import CustomFormField, {
  FormFieldType,
  InputType,
} from "@/components/shared/CustomFormField";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { imagePlaceholder } from "@/constants";
import { useProjectProductStore } from "@/lib/store";
import { cn, formatExpiration } from "@/lib/utils";
import { ProjectProductFormdata, projectProductSchema } from "@/schemas";
import { Product } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, MinusIcon, PlusIcon, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type ProjectAddProductProps = {
  products: Product[];
  className?: string;
};

const useProjectAddProductForm = () => {
  return useForm<ProjectProductFormdata>({
    resolver: zodResolver(projectProductSchema),
    defaultValues: {
      product: "",
      quantity: 1,
    },
  });
};

const ProjectAddProduct = ({ products, className }: ProjectAddProductProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useProjectAddProductForm();

  const { items, addItem, removeItem, updateQuantity, clearItems } =
    useProjectProductStore();

  const findItemById = (id: string) => {
    return (products ?? []).find((item) => item.id === id);
  };

  const onSubmit = async (values: z.infer<typeof projectProductSchema>) => {
    const item = findItemById(values.product);
    if (!item) {
      setErrorMessage("Item not found.");
      return;
    }

    addItem({
      id: `${item.id}-${values.expiration}`,
      product: item as Product,
      quantity: values.quantity,
      expiration: values.expiration ? values.expiration.toISOString() : "",
      used_quantity: 0,
    });
  };

  return (
    <Form {...form}>
      <div className={cn("space-y-2 px-1", className)}>
        <ComboBoxFormField
          items={(products ?? []).map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          control={form.control}
          name="product"
          placeholder={{
            triggerPlaceholder: "Select product...",
            searchPlaceholder: "Search product...",
          }}
          label="Product"
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
        <CustomFormField
          fieldType={FormFieldType.DATE}
          control={form.control}
          name="expiration"
          label="Expiration"
          placeholder="Select date"
          disabled={form.formState.isSubmitting}
        />

        <div className="flex w-full gap-2">
          <Button
            variant="outline"
            className="flex-grow w-full"
            disabled={!form.formState.isValid}
            onClick={() => form.handleSubmit(onSubmit)()}
          >
            Add Product
          </Button>
          <Button
            variant="outline"
            className="flex-grow w-full"
            disabled={items.length === 0}
            onClick={() => clearItems()}
          >
            Clear Products
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
            {items.map((object, index) => {
              const product = object.product;
              const isMinusDisabled = object.quantity <= 1;

              return (
                <Card key={index}>
                  <CardContent className="flex flex-col items-start justify-between p-4 space-y-2.5 md:space-y-0 md:flex-row md:items-center">
                    <div className="flex items-center gap-3">
                      <Image
                        src={product?.thumbnail ?? imagePlaceholder}
                        alt="product-thumbnail"
                        className="h-[3.5rem] w-auto object-contain rounded-sm"
                        priority
                        width={100}
                        height={100}
                      />
                      <div className="grid flex-1 gap-1 text-left text-sm leading-tight">
                        <span className="truncate max-w-[12rem] font-semibold">
                          {product?.name || "Unknown"}
                        </span>
                        <div className="flex space-x-2 items-center">
                          <span className="truncate text-xs">
                            {product?.type?.name || "Unknown Type"}
                          </span>
                          {object.expiration && (
                            <>
                              <Separator
                                orientation="vertical"
                                className="h-2"
                              />
                              <span className="truncate text-xs">
                                <strong>EXP: </strong>
                                {formatExpiration(object.expiration)}
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
                          onClick={() =>
                            updateQuantity(object.id, object.quantity - 1)
                          }
                          tooltip="Decrease quantity"
                        >
                          <MinusIcon className="size-4" />
                        </IconButton>

                        <span className="text-sm mx-auto w-6 text-center inline-block select-none">
                          {object.quantity}
                        </span>

                        <IconButton
                          className="p-1 rounded-sm transition-colors size-6"
                          onClick={() =>
                            updateQuantity(object.id, object.quantity + 1)
                          }
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

export default ProjectAddProduct;
