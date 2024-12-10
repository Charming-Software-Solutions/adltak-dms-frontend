"use client";

import DialogFormButton from "@/components/shared/buttons/DialogFormButton";
import FilterBadge from "@/components/shared/filter/FilterBadge";
import FilterDialog from "@/components/shared/filter/FilterDialog";
import FilterSelect from "@/components/shared/filter/FilterSelect";
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
  AllocationProductColumns,
  visibleAllocationProductColumns,
} from "@/components/shared/table/columns/AllocationProductColumns";
import {
  ProductColumns,
  visibleProductColumns,
} from "@/components/shared/table/columns/ProductColumns";
import { DataTable } from "@/components/shared/table/data-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { productStockStatuses } from "@/constants";
import { UserRoleEnum } from "@/enums";
import {
  getCategoryById,
  getTypeById,
} from "@/lib/actions/product.classications.actions";
import { hasPermission } from "@/lib/auth";
import {
  filterDataTable,
  filterProductsByExpiration,
  formatFilterValue,
  generateProductSKU,
} from "@/lib/utils";
import { DistributionProduct } from "@/types/distribution";
import { Brand, Category, Product, ProductSKU, Type } from "@/types/product";
import { UserSession } from "@/types/user";
import { File as FileIcon, PlusCircle } from "lucide-react";
import { parseAsString, useQueryStates } from "nuqs";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import React, { useEffect, useState } from "react";
import { Separator } from "react-aria-components";
import { CSVLink } from "react-csv";
import { useMediaQuery } from "react-responsive";
import ProductForm, { useProductForm } from "./components/ProductForm";

type Props = {
  user: UserSession;
  products: Product[];
  allocationProducts: DistributionProduct[];
  brands: Brand[];
  categories: Category[];
  types: Type[];
};

type AppliedFilters = {
  stock?: string;
  brand?: string;
  category?: string;
  type?: string;
};

const ProductClient = ({
  user,
  products,
  allocationProducts,
  brands,
  categories,
  types,
}: Props) => {
  console.log(allocationProducts);
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);

  const [productFilters, setProductFilters] = useQueryStates({
    stock: parseAsString.withDefault(""),
    brand: parseAsString.withDefault(""),
    category: parseAsString.withDefault(""),
    type: parseAsString.withDefault(""),
  });
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    stock: productFilters.stock,
    brand: productFilters.brand,
    category: productFilters.category,
    type: productFilters.type,
  });

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

  const getFilteredProducts = () => {
    const tempInitialStock = 100;
    const stockThreshold = tempInitialStock * 0.2;

    return filterDataTable(products, (product) => {
      const isStockValid =
        productFilters.stock === "OUT_OF_STOCK"
          ? product.stock <= 0
          : productFilters.stock === "LOW_STOCK"
            ? product.stock > 0 && product.stock <= stockThreshold
            : productFilters.stock === "IN_STOCK"
              ? product.stock > stockThreshold
              : true;
      const isBrandValid = productFilters.brand
        ? product.brand.name === productFilters.brand
        : true;
      const isCategoryValid = productFilters.category
        ? product.category.name === productFilters.category
        : true;
      const isTypeValid = productFilters.type
        ? product.type.name === productFilters.type
        : true;
      return isStockValid && isBrandValid && isCategoryValid && isTypeValid;
    });
  };

  const updateFilter = (
    key: keyof AppliedFilters,
    value: string | number | undefined,
  ) => {
    setAppliedFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const hasActiveFilters = () => {
    return Object.values(productFilters).some((value) => value !== "");
  };

  const handleClearFilters = () => {
    setProductFilters(null);
    setAppliedFilters({
      stock: "",
      brand: "",
      category: "",
      type: "",
    });
  };

  const renderAllocationProductTable = (
    condition: "all" | "near_expiration" | "expired",
  ) => {
    if (!isMounted) return null;

    const data = hasActiveFilters() ? getFilteredProducts() : products;

    const categorizedProducts = filterProductsByExpiration(allocationProducts);

    switch (condition) {
      case "all":
        return (
          <DataTable
            columns={ProductColumns}
            data={data}
            visibleColumns={
              isDesktop
                ? visibleProductColumns(user.role).desktop
                : visibleProductColumns(user.role).mobile
            }
            searchField={{ column: "name", placeholder: "Search product..." }}
            filterOnBottom={
              <div className="flex items-start gap-2 flex-wrap w-full flex-grow">
                {Object.entries(productFilters).map(([key, value]) => {
                  if (key !== "expiration" && value) {
                    return (
                      <FilterBadge
                        key={key}
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                        value={formatFilterValue(value.toString())}
                        onRemove={() => {
                          setProductFilters({ [key]: "" });
                        }}
                      />
                    );
                  }
                })}
              </div>
            }
            filters={
              <div className="flex ml-2 gap-2">
                <FilterDialog
                  open={openFilterDialog}
                  setOpen={setOpenFilterDialog}
                >
                  <FilterSelect
                    name="Total Quantity Status"
                    items={productStockStatuses}
                    placeholder="Select status"
                    onChange={(value) => updateFilter("stock", value)}
                    onRemove={() => updateFilter("stock", "")}
                    value={appliedFilters.stock}
                    className="px-4"
                    isObject={true}
                  />
                  <FilterSelect
                    name="Brand"
                    items={brands}
                    placeholder="Select brand"
                    onChange={(value) => updateFilter("brand", value)}
                    onRemove={() => updateFilter("brand", "")}
                    value={appliedFilters.brand}
                    className="px-4"
                    isObject={true}
                  />
                  <FilterSelect
                    name="Category"
                    items={categories}
                    placeholder="Select category"
                    onChange={(value) => updateFilter("category", value)}
                    onRemove={() => updateFilter("category", "")}
                    value={appliedFilters.category}
                    className="px-4"
                    isObject={true}
                  />
                  <FilterSelect
                    name="Type"
                    items={types}
                    placeholder="Select type"
                    onChange={(value) => updateFilter("type", value)}
                    onRemove={() => updateFilter("type", "")}
                    value={appliedFilters.type}
                    className="px-4"
                    isObject={true}
                  />
                  <Separator className="mt-4" />
                  <ResponsiveDialogFooter className="px-4">
                    <div className="flex flex-row flex-grow w-full gap-2">
                      <Button
                        variant="outline"
                        className="flex-grow w-full"
                        onClick={handleClearFilters}
                      >
                        Clear Filters
                      </Button>
                      <Button
                        className="flex-grow w-full"
                        onClick={() => {
                          setProductFilters({
                            stock: appliedFilters.stock || "",
                            brand: appliedFilters.brand || "",
                            category: appliedFilters.category || "",
                            type: appliedFilters.type || "",
                          });
                          setOpenFilterDialog(false);
                        }}
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </ResponsiveDialogFooter>
                </FilterDialog>
              </div>
            }
            tabsList={
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
            }
          />
        );
      case "near_expiration":
        return (
          <DataTable
            columns={AllocationProductColumns}
            data={categorizedProducts.nearExpiration}
            visibleColumns={
              isDesktop
                ? visibleAllocationProductColumns().desktop
                : visibleAllocationProductColumns().mobile
            }
            searchField={{
              column: "ba_reference_number",
              placeholder: "Search BA ref number...",
            }}
            tabsList={
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
            }
          />
        );

      case "expired":
        return (
          <DataTable
            columns={AllocationProductColumns}
            data={categorizedProducts.expired}
            visibleColumns={
              isDesktop
                ? visibleAllocationProductColumns().desktop
                : visibleAllocationProductColumns().mobile
            }
            searchField={{
              column: "ba_reference_number",
              placeholder: "Search BA ref number...",
            }}
            tabsList={
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
            }
          />
        );
      default:
        return null;
    }
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

          {hasPermission(user.role, [
            UserRoleEnum.ADMIN,
            UserRoleEnum.LOGISTICS_SPECIALIST,
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
                <OverlayScrollbarsComponent
                  defer
                  options={{
                    scrollbars: {
                      autoHide: "leave",
                      autoHideDelay: 200,
                      theme: "os-theme-dark",
                    },
                  }}
                  className="max-h-[38.7rem]"
                >
                  <ProductForm
                    form={form}
                    className="px-4 md:px-1 pb-2"
                    brands={brands}
                    categories={categories}
                    types={types}
                    mode="create"
                  />
                </OverlayScrollbarsComponent>
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
                          const category =
                            await getCategoryById(productCategory);
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
        <Tabs defaultValue="all">
          <TabsContent value="all">
            {renderAllocationProductTable("all")}
          </TabsContent>
          <TabsContent value="near_expiration">
            {renderAllocationProductTable("near_expiration")}
          </TabsContent>
          <TabsContent value="expired">
            {renderAllocationProductTable("expired")}
          </TabsContent>
        </Tabs>
      </main>
    </React.Fragment>
  );
};

export default ProductClient;
