"use client";

import { CalendarDateRangePicker } from "@/components/shared/DateRangePicker";
import Header from "@/components/shared/Header";
import ResponsiveDialog from "@/components/shared/ResponsiveDialog";
import {
  DistributionColumns,
  visibleDistributionColumns,
} from "@/components/shared/table/columns/DistributionColumns";
import { DataTable } from "@/components/shared/table/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DistributionStatuses } from "@/constants";
import { useDistributionForm } from "@/hooks";
import { ICreateDistribution } from "@/interfaces";
import { createDistribution } from "@/lib/actions/distribution.actions";
import { useDistributionStore } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";
import { distributionFormSchema } from "@/schemas";
import { ApiResponse } from "@/types/api";
import { Distribution, DistributionType } from "@/types/distribution";
import { Brand, Product } from "@/types/product";
import { ListFilter, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { toast } from "sonner";
import { z } from "zod";
import { useShallow } from "zustand/shallow";
import DistributionAddProduct from "./components/DistributionAddProduct";
import DistributionForm from "./components/DistributionForm";
import FilterBadge from "./components/FilterBadge";
import FilterSelect from "./components/FilterSelect";

type Props = {
  distributions: Distribution[];
  brands: Brand[];
  products: Product[];
};

type AppliedFilters = {
  status?: string;
  brand?: string;
  startDate?: Date;
  endDate?: Date;
};

const DistributionClient = ({ distributions, brands, products }: Props) => {
  const [openDistributionDialog, setOpenDistributionDialog] = useState(false);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    status: "",
    brand: "",
    startDate: undefined,
    endDate: undefined,
  });

  const isDesktop = useMediaQuery({ query: "(min-width: 1224px)" });
  const distributionForm = useDistributionForm();
  const { items, clearItems } = useDistributionStore(
    useShallow((state) => ({
      items: state.items,
      clearItems: state.clearItems,
    })),
  );
  const router = useRouter();

  const hasFilters =
    appliedFilters.status ||
    appliedFilters.brand ||
    appliedFilters.startDate ||
    appliedFilters.endDate;

  const updateFilter = (
    key: keyof AppliedFilters,
    value: string | Date | undefined,
  ) => {
    setAppliedFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getFilteredDistributions = (type: DistributionType) => {
    const filtered = distributions.filter((distribution) => {
      return distribution.type === type;
    });

    return filtered;
  };

  const renderDistributionTable = (type: DistributionType) => {
    if (!isMounted) return null;

    return (
      <DataTable
        columns={DistributionColumns}
        data={getFilteredDistributions(type)}
        visibleColumns={
          isDesktop
            ? {
                ...visibleDistributionColumns.desktop,
                client:
                  type === "IMPORT"
                    ? false
                    : visibleDistributionColumns.desktop.client,
              }
            : visibleDistributionColumns.mobile
        }
      />
    );
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit = async (values: z.infer<typeof distributionFormSchema>) => {
    const distribution: ICreateDistribution = {
      employee: "Jonny English",
      products: items.map((item) => ({
        product: item.id,
        quantity: item.quantity,
      })),
      type: values.type,
      status: "Pending",
      client: values.client,
    };

    const result: ApiResponse<Distribution> =
      await createDistribution(distribution);

    if (result.errors) {
      toast.error(`${result.errors}`, {
        position: "top-center",
      });
    } else {
      setOpenDistributionDialog(false);
      router.refresh();
      distributionForm.reset();
      clearItems();
    }
  };

  return (
    <React.Fragment>
      <Header>
        <div className="flex items-center justify-end gap-2">
          <ResponsiveDialog
            open={openFilterDialog}
            setOpen={setOpenFilterDialog}
            title="Filters"
            description=""
            trigger={
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            }
            footer={
              <div className="flex flex-row flex-grow w-full gap-2">
                <Button
                  variant="outline"
                  className="flex-grow w-full"
                  onClick={() =>
                    setAppliedFilters({
                      status: "",
                      brand: "",
                      startDate: undefined,
                      endDate: undefined,
                    })
                  }
                >
                  Clear Filters
                </Button>
                <Button className="flex-grow w-full">Apply Filters</Button>
              </div>
            }
          >
            <div className="flex flex-col gap-2">
              {brands?.length > 0 && (
                <FilterSelect
                  name="Brands"
                  items={brands}
                  isObject={true}
                  placeholder="Select Brand"
                  onChange={(brand: Brand) => updateFilter("brand", brand.name)}
                  value={appliedFilters.brand}
                />
              )}
              <FilterSelect
                name="Status"
                items={DistributionStatuses}
                isObject={false}
                placeholder="Select Status"
                onChange={(value) => updateFilter("status", value)}
                value={appliedFilters.status}
              />

              <div className="space-y-2">
                <span className="text-sm">Date</span>
                <div className="flex justify-between gap-2">
                  <CalendarDateRangePicker
                    onChange={(range) => {
                      const startDate = range?.from ?? undefined;
                      const endDate = range?.to ?? undefined;

                      setAppliedFilters((prev) => ({
                        ...prev,
                        startDate,
                        endDate,
                      }));
                    }}
                  />
                  <Button
                    variant={"outline"}
                    className="flex-grow w-full"
                    onClick={() => {
                      const today = new Date();
                      updateFilter("startDate", today);
                      updateFilter("endDate", today);
                    }}
                  >
                    <span className="text-xs">Set Current</span>
                  </Button>
                </div>
              </div>

              <Separator className="mt-4" />
              <div className="space-y-2">
                <span className="text-sm">Applied Filters</span>
                {hasFilters && (
                  <div className="flex flex-row flex-wrap gap-2">
                    {appliedFilters.status && (
                      <FilterBadge
                        onRemove={() => {
                          setAppliedFilters((prev) => ({
                            ...prev,
                            status: undefined, // Set the status to undefined to remove it
                          }));
                        }}
                      >
                        Status: {appliedFilters.status}
                      </FilterBadge>
                    )}
                    {appliedFilters.brand && (
                      <FilterBadge
                        onRemove={() => {
                          setAppliedFilters((prev) => ({
                            ...prev,
                            brand: undefined, // Set the brand to undefined to remove it
                          }));
                        }}
                      >
                        Brand: {appliedFilters.brand}
                      </FilterBadge>
                    )}
                    {appliedFilters.startDate && (
                      <FilterBadge
                        onRemove={() => {
                          setAppliedFilters((prev) => ({
                            ...prev,
                            startDate: undefined, // Set the startDate to undefined to remove it
                          }));
                        }}
                      >
                        Start Date: {formatDateTime(appliedFilters.startDate)}
                      </FilterBadge>
                    )}
                    {appliedFilters.endDate && (
                      <FilterBadge
                        onRemove={() => {
                          setAppliedFilters((prev) => ({
                            ...prev,
                            endDate: undefined, // Set the endDate to undefined to remove it
                          }));
                        }}
                      >
                        End Date: {formatDateTime(appliedFilters.endDate)}
                      </FilterBadge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </ResponsiveDialog>
          <ResponsiveDialog
            open={openDistributionDialog}
            setOpen={setOpenDistributionDialog}
            title="Create Distribution"
            description=""
            trigger={
              <Button className="h-8">
                <PlusCircle className="mr-9 md:mr-2 size-4" />
                <span className="hidden sm:inline">Create Distribution</span>
              </Button>
            }
            footer={
              <div className="flex flex-row w-full gap-2">
                <Button
                  className="flex-grow w-full"
                  variant={"outline"}
                  onClick={() => setOpenDistributionDialog(false)}
                >
                  <span>Cancel</span>
                </Button>
                <Button
                  className="flex-grow w-full"
                  onClick={() => distributionForm.handleSubmit(onSubmit)()}
                  disabled={
                    // disabled only when form is not valid, isSubmitting, or
                    // product list is empty
                    !(distributionForm.formState.isValid && items.length > 0) ||
                    distributionForm.formState.isSubmitting
                  }
                >
                  Add Product
                </Button>
              </div>
            }
          >
            <div className="space-y-2">
              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="products">Products</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                  <Card className="p-4">
                    <DistributionForm form={distributionForm} />
                  </Card>
                </TabsContent>
                <TabsContent value="products">
                  <Card className="p-4">
                    <DistributionAddProduct products={products} />
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </ResponsiveDialog>
        </div>
      </Header>
      <main className="main-container">
        <Tabs defaultValue="exports">
          <div className="flex flex-col gap-2 md:flex-row items-start justify-between">
            <TabsList>
              <TabsTrigger value="exports">Exports</TabsTrigger>
              <TabsTrigger value="imports">Imports</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              {/* <CalendarDateRangePicker /> */}
              <Button>Download</Button>
            </div>
          </div>
          <TabsContent value="exports">
            {renderDistributionTable("EXPORT")}
          </TabsContent>
          <TabsContent value="imports">
            {renderDistributionTable("IMPORT")}
          </TabsContent>
        </Tabs>
      </main>
    </React.Fragment>
  );
};

export default DistributionClient;
