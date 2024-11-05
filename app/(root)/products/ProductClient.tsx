"use client";

import Header from "@/components/shared/Header";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/shared/ResponsiveDialog";
import {
  ProductColumns,
  visibleProductColumns,
} from "@/components/shared/table/columns/ProductColumns";
import { DataTable } from "@/components/shared/table/data-table";
import { Button } from "@/components/ui/button";
import {
  getCategoryById,
  getTypeById,
} from "@/lib/actions/product.classications.actions";
import { generateProductSKU } from "@/lib/utils";
import { Brand, Category, Product, ProductSKU, Type } from "@/types/product";
import { File as FileIcon, ListFilter, PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useMediaQuery } from "react-responsive";
import ProductForm, { useProductForm } from "./components/ProductForm";

type Props = {
  products: Product[];
  brands: Brand[];
  categories: Category[];
  types: Type[];
};

const ProductClient = ({ products, brands, categories, types }: Props) => {
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isDesktop = useMediaQuery({ query: "(min-width: 1224px)" });
  const { form, onSubmit } = useProductForm({ mode: "create" });

  // Form values to watch for SKU generation
  const productName = form.watch("name");
  const productCategory = form.watch("category");
  const productType = form.watch("type");

  const productsToExport = products.map((product) => ({
    ...product,
    brand: product.brand.name,
    category: product.category.name,
    type: product.type.name,
  }));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <React.Fragment>
      <Header overrideHeaderTitle="Products">
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <ListFilter className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Filter
            </span>
          </Button>
          <CSVLink data={productsToExport}>
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <FileIcon className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
          </CSVLink>

          <ResponsiveDialog open={open} setOpen={setOpen}>
            <ResponsiveDialogTrigger>
              <Button className="h-8">
                <PlusCircle className="mr-9 md:mr-2 size-4" />
                <span className="hidden sm:inline">Add Product</span>
              </Button>
            </ResponsiveDialogTrigger>
            <ResponsiveDialogContent>
              <ResponsiveDialogHeader>
                <ResponsiveDialogTitle>Add Product</ResponsiveDialogTitle>
                <ResponsiveDialogDescription>
                  Add products that you want to keep track of
                </ResponsiveDialogDescription>
              </ResponsiveDialogHeader>
              <ProductForm
                form={form}
                className="px-4 md:px-0"
                brands={brands}
                categories={categories}
                types={types}
              />
              <ResponsiveDialogFooter>
                <div className="flex flex-row flex-grow w-full gap-2">
                  <Button variant={"outline"} onClick={() => setOpen(false)}>
                    <span>Cancel</span>
                  </Button>
                  <Button
                    variant={"outline"}
                    onClick={async () => {
                      // Only fetch and set values when sku is initially null
                      // to avoid overload fetching
                      if (!form.getValues("sku")) {
                        const category = await getCategoryById(productCategory);
                        const type = await getTypeById(productType);

                        if (category.data && type.data) {
                          const productSKUFormat: ProductSKU = {
                            name: productName,
                            category: category.data.name,
                            type: type.data.name,
                          };
                          const productSKU =
                            generateProductSKU(productSKUFormat);
                          form.setValue("sku", productSKU);
                        }
                      }
                    }}
                    disabled={
                      form.formState.isSubmitting ||
                      !(productName && productCategory && productType)
                    }
                  >
                    <span>Generate SKU</span>
                  </Button>
                  <Button
                    className="flex-grow w-full"
                    onClick={form.handleSubmit((values) =>
                      onSubmit(values, setOpen),
                    )}
                    disabled={
                      !form.formState.isValid || form.formState.isSubmitting
                    }
                  >
                    Add Product
                  </Button>
                </div>
              </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
          </ResponsiveDialog>
        </div>
      </Header>
      <main className="main-container">
        {isMounted ? (
          <DataTable
            columns={ProductColumns}
            data={products}
            visibleColumns={
              isDesktop
                ? visibleProductColumns.desktop
                : visibleProductColumns.mobile
            }
          />
        ) : null}
      </main>
    </React.Fragment>
  );
};

export default ProductClient;
