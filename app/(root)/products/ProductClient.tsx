"use client";

import FilterDialog from "@/components/shared/filter/FilterDialog";
import FilterSelect from "@/components/shared/filter/FilterSelect";
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
import { productMonthExpirationFreq, productStockStatuses } from "@/constants";
import {
  getCategoryById,
  getTypeById,
} from "@/lib/actions/product.classications.actions";
import {
  filterDataTable,
  formatFilterValue,
  generateProductSKU,
  monthsFromNow,
} from "@/lib/utils";
import { Brand, Category, Product, ProductSKU, Type } from "@/types/product";
import { File as FileIcon, PlusCircle } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import React, { useEffect, useState } from "react";
import { Separator } from "react-aria-components";
import { CSVLink } from "react-csv";
import { useMediaQuery } from "react-responsive";
import ProductForm, { useProductForm } from "./components/ProductForm";
import FilterBadge from "@/components/shared/filter/FilterBadge";

type Props = {
  products: Product[];
  brands: Brand[];
  categories: Category[];
  types: Type[];
};

type AppliedFilters = {
  stock?: string;
  brand?: string;
  category?: string;
  type?: string;
  expiration: number | undefined;
};

const ProductClient = ({ products, brands, categories, types }: Props) => {
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);

  const [productFilters, setProductFilters] = useQueryStates({
    stock: parseAsString.withDefault(""),
    brand: parseAsString.withDefault(""),
    category: parseAsString.withDefault(""),
    type: parseAsString.withDefault(""),
    expiration: parseAsInteger,
  });
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    stock: productFilters.stock,
    brand: productFilters.brand,
    category: productFilters.category,
    type: productFilters.type,
    expiration: productFilters.expiration ?? undefined,
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
      const isExpirationValid = productFilters.expiration
        ? new Date(product.expiration).getTime() <=
          monthsFromNow(new Date(), productFilters.expiration).getTime()
        : true;
      return (
        isStockValid &&
        isBrandValid &&
        isCategoryValid &&
        isTypeValid &&
        isExpirationValid
      );
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
      expiration: undefined,
    });
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
            data={hasActiveFilters() ? getFilteredProducts() : products}
            visibleColumns={
              isDesktop
                ? visibleProductColumns.desktop
                : visibleProductColumns.mobile
            }
            searchField={{ column: "name", placeholder: "Search product..." }}
            filters={
              <div className="flex gap-2">
                <div className="flex items-center gap-2">
                  {productFilters.expiration && (
                    <FilterBadge
                      key="expiration"
                      onRemove={() => {
                        setProductFilters({ expiration: null });
                      }}
                      label="Expiration"
                      value={
                        productMonthExpirationFreq.find(
                          (item) =>
                            item.value === String(productFilters.expiration),
                        )?.label || "Unknown"
                      }
                    />
                  )}

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
                <FilterDialog
                  open={openFilterDialog}
                  setOpen={setOpenFilterDialog}
                >
                  <FilterSelect
                    name="Stock Status"
                    items={productStockStatuses}
                    placeholder="Select status"
                    onChange={(value) => updateFilter("stock", value)}
                    value={appliedFilters.stock}
                    className="px-4"
                    isObject={true}
                  />
                  <FilterSelect
                    name="Brand"
                    items={brands}
                    placeholder="Select brand"
                    onChange={(value) => updateFilter("brand", value)}
                    value={appliedFilters.brand}
                    className="px-4"
                    isObject={true}
                  />
                  <FilterSelect
                    name="Category"
                    items={categories}
                    placeholder="Select category"
                    onChange={(value) => updateFilter("category", value)}
                    value={appliedFilters.category}
                    className="px-4"
                    isObject={true}
                  />
                  <FilterSelect
                    name="Type"
                    items={types}
                    placeholder="Select type"
                    onChange={(value) => updateFilter("type", value)}
                    value={appliedFilters.type}
                    className="px-4"
                    isObject={true}
                  />
                  <FilterSelect
                    name="Expiration"
                    items={productMonthExpirationFreq}
                    placeholder="Select expiration"
                    onChange={(value) =>
                      updateFilter("expiration", Number(value))
                    }
                    value={
                      appliedFilters.expiration !== undefined
                        ? productMonthExpirationFreq.find(
                            (item) =>
                              item.value === String(appliedFilters.expiration),
                          )?.value
                        : undefined
                    }
                    className="px-4"
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
                            expiration: appliedFilters.expiration
                              ? appliedFilters.expiration
                              : null,
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
          />
        ) : null}
      </main>
    </React.Fragment>
  );
};

export default ProductClient;
