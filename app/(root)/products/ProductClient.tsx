"use client";

import DialogFormButton from "@/components/shared/buttons/DialogFormButton";
import Header from "@/components/shared/Header";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/shared/ResponsiveDialog";
import {
  ProductColumns,
  visibleProductColumns,
} from "@/components/shared/table/columns/ProductColumns";
import {
  ProjectProductColumns,
  visibleProjectProductColumns,
} from "@/components/shared/table/columns/ProjectProductColumns";
import { DataTable } from "@/components/shared/table/data-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormModeEnum, UserRoleEnum } from "@/enums";
import { useResponsive } from "@/hooks";
import { hasPermission } from "@/lib/auth";
import { filterProductsByExpiration, generateProductSKU } from "@/lib/utils";
import { Classification } from "@/types/generics";
import { Category, Product, ProductSKU, Type } from "@/types/product";
import { ProjectProduct } from "@/types/project";
import { User } from "@/types/user";
import { File as FileIcon, PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import ProductFilter from "./components/ProductFilter";
import ProductForm, { useProductForm } from "./components/ProductForm";

type Props = {
  user: User;
  products: Product[];
  projectProducts: ProjectProduct[];
  brands: Classification[];
  categories: Category[];
  types: Type[];
};

const ProductClient = ({
  user,
  products,
  projectProducts,
  brands,
  categories,
  types,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const isDesktop = useResponsive("desktop");
  const { form, onSubmit } = useProductForm({ mode: FormModeEnum.CREATE });

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

  const renderProjectProductTable = (
    condition: "brands" | "near_expiration" | "expired",
  ) => {
    if (!isMounted) return null;

    const categorizedProducts = filterProductsByExpiration(projectProducts);

    const commonTabsList = (
      <TabsList className="min-w-[20rem]">
        <TabsTrigger value="brands" className="flex-grow">
          Brands
        </TabsTrigger>
        <TabsTrigger value="near_expiration" className="flex-grow">
          Near Expiration
        </TabsTrigger>
        <TabsTrigger value="expired" className="flex-grow">
          Expired
        </TabsTrigger>
      </TabsList>
    );

    const getVisibleColumns = (isProjectProduct: boolean) => {
      return isDesktop
        ? (isProjectProduct
            ? visibleProjectProductColumns()
            : visibleProductColumns(user.roles)
          ).desktop
        : (isProjectProduct
            ? visibleProjectProductColumns()
            : visibleProductColumns(user.roles)
          ).mobile;
    };

    const getProjectProducts = () => {
      switch (condition) {
        case "near_expiration":
          return categorizedProducts.nearExpiration;
        case "expired":
          return categorizedProducts.expired;
        default:
          return [];
      }
    };

    const isProductProject =
      condition === "near_expiration" || condition === "expired";

    return (
      <React.Fragment>
        {!isProductProject ? (
          <DataTable
            columns={ProductColumns(user.roles)}
            data={products}
            visibleColumns={getVisibleColumns(isProductProject)}
            leftTools={{
              searchField: {
                column: "name",
                placeholder: "Search product...",
              },
              extra: <ProductFilter brands={brands} />,
            }}
            tabsList={commonTabsList}
          />
        ) : (
          <DataTable
            columns={ProjectProductColumns}
            data={getProjectProducts()}
            visibleColumns={getVisibleColumns(isProductProject)}
            leftTools={{
              searchField: {
                column: "ba_reference_number",
                placeholder: "Search BA ref number...",
              },
            }}
            tabsList={commonTabsList}
          />
        )}
      </React.Fragment>
    );
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <React.Fragment>
      <Header overrideHeaderTitle="Products">
        <div className="flex items-center justify-end gap-2">
          <CSVLink data={productsToExport}>
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <FileIcon className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
          </CSVLink>

          {hasPermission(user.roles, [
            UserRoleEnum.ADMIN,
            UserRoleEnum.LOGISTICS_TEAM_MEMBER,
          ]) && (
            <ResponsiveDialog open={open} setOpen={setOpen}>
              <ResponsiveDialogTrigger>
                <Button className="h-8">
                  <PlusCircle className="mr-9 md:mr-2 size-4" />
                  <span className="hidden sm:inline">Add Product</span>
                </Button>
              </ResponsiveDialogTrigger>
              <ResponsiveDialogContent>
                <ResponsiveDialogHeader className="px-1">
                  <ResponsiveDialogTitle>Add Product</ResponsiveDialogTitle>
                </ResponsiveDialogHeader>
                <ProductForm
                  form={form}
                  className="px-4 md:px-1 pb-2"
                  brands={brands}
                  categories={categories}
                  types={types}
                  mode={FormModeEnum.CREATE}
                />
                <ResponsiveDialogFooter className="px-1">
                  <div className="flex flex-row w-full gap-2">
                    <Button
                      variant={"outline"}
                      className="flex-grow w-full"
                      onClick={() => form.reset()}
                    >
                      Reset
                    </Button>
                    <Button
                      className="flex-grow"
                      variant={"outline"}
                      onClick={async () => {
                        // Only fetch and set values when sku is initially null
                        // to avoid overload fetching
                        if (!form.getValues("sku")) {
                          const productSKUFormat: ProductSKU = {
                            name: productName,
                            category: form.watch("category"),
                            type: form.watch("type"),
                          };
                          const productSKU =
                            generateProductSKU(productSKUFormat);
                          form.setValue("sku", productSKU);
                        }
                      }}
                      disabled={
                        form.formState.isSubmitting ||
                        !(productName && productCategory && productType)
                      }
                    >
                      <span>Generate SKU</span>
                    </Button>
                    <DialogFormButton
                      onClick={form.handleSubmit((values) =>
                        onSubmit(values, setOpen),
                      )}
                      disabled={
                        !form.formState.isValid || form.formState.isSubmitting
                      }
                      loading={form.formState.isSubmitting}
                    >
                      Add Product
                    </DialogFormButton>
                  </div>
                </ResponsiveDialogFooter>
              </ResponsiveDialogContent>
            </ResponsiveDialog>
          )}
        </div>
      </Header>
      <main className="main-container">
        <Tabs defaultValue="brands">
          <TabsContent value="brands">
            {renderProjectProductTable("brands")}
          </TabsContent>
          <TabsContent value="near_expiration">
            {renderProjectProductTable("near_expiration")}
          </TabsContent>
          <TabsContent value="expired">
            {renderProjectProductTable("expired")}
          </TabsContent>
        </Tabs>
      </main>
    </React.Fragment>
  );
};

export default ProductClient;
