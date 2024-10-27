"use client";

import Header from "@/components/shared/Header";
import ResponsiveDialog from "@/components/shared/ResponsiveDialog";
import {
  ProductColumns,
  visibleProductColumns,
} from "@/components/shared/table/columns/ProductColumns";
import { DataTable } from "@/components/shared/table/data-table";
import { Button } from "@/components/ui/button";
import { useProductForm } from "@/hooks";
import { createProduct } from "@/lib/actions/product.actions";
import {
  getCategoryById,
  getTypeById,
} from "@/lib/actions/product.classications.actions";
import { generateProductSKU } from "@/lib/utils";
import { productFormSchema } from "@/schemas";
import { ApiResponse } from "@/types/api";
import { Brand, Category, Product, ProductSKU, Type } from "@/types/product";
import { File as FileIcon, ListFilter, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useMediaQuery } from "react-responsive";
import { z } from "zod";
import ProductForm from "./components/ProductForm";

type Props = {
  products: Product[];
  // currentProduct: Product;
  brands: Brand[];
  categories: Category[];
  types: Type[];
};

const ProductClient = ({ products, brands, categories, types }: Props) => {
  const [formReset, setFormReset] = useState(false);
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isDesktop = useMediaQuery({ query: "(min-width: 1224px)" });
  const createForm = useProductForm({ mode: "create" });
  const router = useRouter();

  // Form values to watch for SKU generation
  const productName = createForm.watch("name");
  const productCategory = createForm.watch("category");
  const productType = createForm.watch("type");

  const productsToExport = products.map((product) => ({
    ...product,
    brand: product.brand.name,
    category: product.category.name,
    type: product.type.name,
  }));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit = async (values: z.infer<typeof productFormSchema>) => {
    const formData = new FormData();
    formData.append("sku", values.sku);
    formData.append("name", values.name);
    formData.append("brand", values.brand);
    formData.append("category", values.category);
    formData.append("type", values.type);
    formData.append("stock", values.stock.toString());

    if (values.thumbnail instanceof File) {
      formData.append("thumbnail", values.thumbnail);
    }

    try {
      const result: ApiResponse<Product> = await createProduct(formData);

      if (result.errors) {
        console.log(result.errors);
      } else {
        router.refresh();
        createForm.reset();
        createForm.setValue("sku", "");
        setFormReset(true);
        setOpen(false);
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <React.Fragment>
      <Header>
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

          <ResponsiveDialog
            open={open}
            setOpen={setOpen}
            title="Add Product"
            description="Add products that you want to keep track of"
            trigger={
              <Button className="h-8">
                <PlusCircle className="mr-9 md:mr-2 size-4" />
                <span className="hidden sm:inline">Add Product</span>
              </Button>
            }
            footer={
              <div className="flex flex-row flex-grow w-full gap-2">
                <Button variant={"outline"} onClick={() => setOpen(false)}>
                  <span>Cancel</span>
                </Button>
                <Button
                  variant={"outline"}
                  onClick={async () => {
                    // Only fetch and set values when sku is initially null
                    // to avoid overload fetching
                    if (!createForm.getValues("sku")) {
                      const category = await getCategoryById(productCategory);
                      const type = await getTypeById(productType);

                      if (category.data && type.data) {
                        const productSKUFormat: ProductSKU = {
                          name: productName,
                          category: category.data.name,
                          type: type.data.name,
                        };
                        const productSKU = generateProductSKU(productSKUFormat);
                        createForm.setValue("sku", productSKU);
                      }
                    }
                  }}
                  disabled={
                    createForm.formState.isSubmitting ||
                    !(productName && productCategory && productType)
                  }
                >
                  <span>Generate SKU</span>
                </Button>
                <Button
                  className="flex-grow w-full"
                  onClick={() => createForm.handleSubmit(onSubmit)()}
                  disabled={
                    !createForm.formState.isValid ||
                    createForm.formState.isSubmitting
                  }
                >
                  Add Product
                </Button>
              </div>
            }
          >
            {/* Form when creating a product*/}
            <ProductForm
              className="px-0"
              form={createForm}
              brands={brands}
              categories={categories}
              types={types}
              formReset={formReset}
            />
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
