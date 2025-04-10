"use client";

import DialogFormButton from "@/components/shared/buttons/DialogFormButton";
import FilterBadge from "@/components/shared/filter/FilterBadge";
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
import { DataTableSearch } from "@/components/shared/table/data-table-search";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormModeEnum, UserRoleEnum } from "@/enums";
import { useDataTable } from "@/hooks/use-data-table";
import { useProductFilters } from "@/hooks/use-filters";
import { hasPermission } from "@/lib/auth";
import {
  filterProductsByExpiration,
  formatFilterValue,
  generateProductSKU,
} from "@/lib/utils";
import { Classification } from "@/types/generics";
import { Product, ProductSKU } from "@/types/product";
import { ProjectProduct } from "@/types/project";
import { User } from "@/types/user";
import { File as FileIcon, PlusCircle } from "lucide-react";
import React, { use, useMemo, useState } from "react";
import { CSVLink } from "react-csv";
import ProductFilter from "./components/ProductFilter";
import ProductForm, { useProductForm } from "./components/ProductForm";

type Props = {
  user: User;
  products: Product[];
  projectProducts: ProjectProduct[];
  classifications: {
    brands: Classification[];
    categories: Classification[];
    types: Classification[];
  };
};

const ProductClient = ({
  user,
  products,
  projectProducts,
  classifications,
}: Props) => {
  const [open, setOpen] = useState(false);
  const { form, onSubmit } = useProductForm({ mode: FormModeEnum.CREATE });
  const [productFilters, setProductFilters] = useProductFilters();

  // Form values to watch for SKU generation
  const productName = form.watch("name");
  const productCategory = form.watch("category");
  const productType = form.watch("type");

  const productsExport = useMemo(() => {
    return products.map((product) => ({
      name: product.name,
      sku: product.sku,
      brand: product.brand.name,
      category: product.category.name,
      type: product.type.name,
      stock: product.stock,
      area: product.area,
    }));
  }, [products]);

  const renderProjectProductTable = (
    condition: "all" | "near_expiration" | "expired",
  ) => {
    const categorizedProducts = useMemo(
      () => filterProductsByExpiration(projectProducts),
      [projectProducts],
    );

    const commonTabsList = (
      <TabsList className="min-w-[20rem]">
        <TabsTrigger value="all" className="flex-grow">
          All
        </TabsTrigger>
        <TabsTrigger value="near_expiration" className="flex-grow">
          Near Expiration
        </TabsTrigger>
        <TabsTrigger value="expired" className="flex-grow">
          Expired
        </TabsTrigger>
      </TabsList>
    );

    const projectProductData = useMemo(() => {
      switch (condition) {
        case "near_expiration":
          return categorizedProducts.nearExpiration;
        case "expired":
          return categorizedProducts.expired;
        default:
          return [];
      }
    }, [categorizedProducts, condition]);

    const productTableData = useMemo(() => products, [products]);

    const { table: productTable } = useDataTable({
      columns: ProductColumns(user.roles),
      data: productTableData,
    });

    const { table: projectProductTable } = useDataTable({
      columns: ProjectProductColumns,
      data: projectProductData,
    });

    const isProductProject =
      condition === "near_expiration" || condition === "expired";

    return (
      <React.Fragment>
        {!isProductProject ? (
          <DataTable
            table={productTable}
            visibleColumns={visibleProductColumns(user.roles)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DataTableSearch
                  table={productTable}
                  column={"name"}
                  placeholder={"Search product..."}
                />
                <ProductFilter
                  classfications={classifications}
                  isFilteredByBrands={true}
                />
              </div>
              <div className="flex items-center space-x-2">
                {commonTabsList}
                <ProductFilter classfications={classifications} />
              </div>
            </div>

            <div className="flex items-start gap-2 flex-wrap w-full flex-grow">
              {Object.entries(productFilters).map(([key, value]) => {
                if (key !== "expiration" && value) {
                  return (
                    <FilterBadge
                      key={key}
                      label={
                        key === "product_type"
                          ? "Type"
                          : key.charAt(0).toUpperCase() + key.slice(1)
                      }
                      value={formatFilterValue(value.toString())}
                      onRemove={() => {
                        setProductFilters({ [key]: "" });
                      }}
                    />
                  );
                }
                return null;
              })}
            </div>
          </DataTable>
        ) : (
          <DataTable
            table={projectProductTable}
            visibleColumns={visibleProjectProductColumns}
          >
            <div className="flex items-center justify-between">
              <DataTableSearch
                table={productTable}
                column={"ba_reference_number"}
                placeholder={"Search BA ref number..."}
              />

              {commonTabsList}
            </div>
          </DataTable>
        )}
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <Header overrideHeaderTitle="Products">
        <div className="flex items-center justify-end gap-2">
          <CSVLink data={productsExport}>
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
                  mode={FormModeEnum.CREATE}
                  brands={classifications.brands}
                  categories={classifications.categories}
                  types={classifications.types}
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
                          await form.trigger();
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
        <Tabs defaultValue="all" className="overflow-auto">
          <TabsContent value="all">
            {renderProjectProductTable("all")}
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
