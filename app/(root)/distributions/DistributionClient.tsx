"use client";

import CalendarPicker from "@/components/shared/CalendarPicker";
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
  DistributionColumns,
  visibleDistributionColumns,
} from "@/components/shared/table/columns/DistributionColumns";
import { DataTable } from "@/components/shared/table/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DISTRIBUTION_STATUSES, distributionTypes } from "@/constants";
import { useDistributionStore } from "@/lib/store";
import { filterDataTable, formatFilterValue, toPSTDate } from "@/lib/utils";
import { Distribution } from "@/types/distribution";
import { Brand, Product } from "@/types/product";
import { FileIcon, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsIsoDate, parseAsString, useQueryStates } from "nuqs";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useShallow } from "zustand/shallow";
import DistributionAddProduct from "./components/DistributionAddProduct";
import DistributionForm, {
  useDistributionForm,
} from "./components/DistributionForm";

type Props = {
  distributions: Distribution[];
  brands: Brand[];
  products: Product[];
};

type AppliedFilters = {
  distType?: string;
  status?: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
};

const DistributionClient = ({ distributions, products }: Props) => {
  const DistributionStatus = Object.entries(DISTRIBUTION_STATUSES).map(
    ([key, value]) => {
      return {
        value: key,
        label: value,
      };
    },
  );

  const [openDistributionDialog, setOpenDistributionDialog] = useState(false);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);

  const [isMounted, setIsMounted] = useState(false);
  const [filters, setFilters] = useQueryStates({
    type: parseAsString.withDefault(""),
    status: parseAsString.withDefault(""),
    startDate: parseAsIsoDate,
    endDate: parseAsIsoDate,
  });
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    distType: filters.type,
    status: filters.status,
    startDate: filters.startDate ?? undefined,
    endDate: filters.endDate ?? undefined,
  });

  const router = useRouter();
  const { form, onSubmit } = useDistributionForm({ mode: "create" });
  const isDesktop = useMediaQuery({ query: "(min-width: 1224px)" });
  const { items, clearItems } = useDistributionStore(
    useShallow((state) => ({
      items: state.items,
      clearItems: state.clearItems,
    })),
  );

  const updateFilter = (
    key: keyof AppliedFilters,
    value: string | Date | undefined,
  ) => {
    setAppliedFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getFilteredDistributions = () => {
    return filterDataTable(
      distributions,
      (distribution) =>
        (filters.type ? distribution.type === filters.type : true) &&
        (filters.status ? distribution.status === filters.status : true) &&
        (!filters.startDate ||
          new Date(new Date(distribution.created_at).setHours(0, 0, 0, 0)) >=
            new Date(filters.startDate.setHours(0, 0, 0, 0))) &&
        (!filters.endDate ||
          new Date(new Date(distribution.created_at).setHours(0, 0, 0, 0)) <=
            new Date(filters.endDate.setHours(0, 0, 0, 0))),
    );
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some((value) => value !== "");
  };

  const handleClearFilters = () => {
    setFilters(null);
    setAppliedFilters({
      distType: "",
      status: "",
      startDate: undefined,
      endDate: undefined,
    });
    router.refresh();
  };

  const renderDistributionTable = () => {
    if (!isMounted) return null;
    return (
      <DataTable
        columns={DistributionColumns}
        data={hasActiveFilters() ? getFilteredDistributions() : distributions}
        visibleColumns={
          isDesktop
            ? visibleDistributionColumns.desktop
            : visibleDistributionColumns.mobile
        }
        searchField={{ column: "client", placeholder: "Search by client" }}
        filters={
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              {filters.startDate && filters.endDate && (
                <FilterBadge
                  key="dateRange"
                  onRemove={() => {
                    setFilters({ startDate: null, endDate: null });
                    router.refresh();
                  }}
                  label="Date"
                  value={`${filters.startDate.toLocaleDateString()} - ${filters.endDate.toLocaleDateString()}`}
                />
              )}
              {Object.entries(filters).map(([key, value]) => {
                if (key !== "startDate" && key !== "endDate" && value) {
                  return (
                    <FilterBadge
                      key={key}
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      value={
                        value instanceof Date
                          ? value.toLocaleDateString()
                          : formatFilterValue(value)
                      }
                      onRemove={() => {
                        setFilters({ [key]: "" });
                        router.refresh();
                      }}
                    />
                  );
                }
                return null;
              })}
            </div>
            <FilterDialog open={openFilterDialog} setOpen={setOpenFilterDialog}>
              <FilterSelect
                name="Type"
                items={distributionTypes}
                placeholder="Select type"
                onChange={(value) => updateFilter("distType", value)}
                value={appliedFilters.distType}
                className="px-4"
              />
              <FilterSelect
                name="Status"
                items={DistributionStatus}
                placeholder="Select status"
                onChange={(value) => updateFilter("status", value)}
                value={appliedFilters.status}
                className="px-4"
              />
              <div className="space-y-2 px-4 w-full">
                <span className="text-sm font-semibold">Date Range</span>
                <div className="flex space-x-2 w-full">
                  <CalendarPicker
                    date={appliedFilters.startDate}
                    placeholder="Select start date"
                    type="from"
                    onSelect={(value) =>
                      updateFilter("startDate", value as Date | undefined)
                    }
                    label="From:"
                  />

                  <CalendarPicker
                    date={appliedFilters.endDate}
                    placeholder="Select end date"
                    onSelect={(value) =>
                      updateFilter("endDate", value as Date | undefined)
                    }
                    type="to"
                    label="To:"
                    disabled={!appliedFilters.startDate}
                  />
                </div>
              </div>
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
                      setFilters({
                        type: appliedFilters.distType || "",
                        status: appliedFilters.status || "",
                        startDate: appliedFilters.startDate
                          ? toPSTDate(appliedFilters.startDate)
                          : null,
                        endDate: appliedFilters.endDate
                          ? toPSTDate(appliedFilters.endDate)
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
    );
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <React.Fragment>
      <Header>
        <div className="flex items-center justify-end gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <FileIcon className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <ResponsiveDialog
            open={openDistributionDialog}
            setOpen={setOpenDistributionDialog}
          >
            <ResponsiveDialogTrigger>
              <Button className="h-8">
                <PlusCircle className="mr-9 md:mr-2 size-4" />
                <span className="hidden sm:inline">Create Distribution</span>
              </Button>
            </ResponsiveDialogTrigger>
            <ResponsiveDialogContent>
              <ResponsiveDialogHeader>
                <ResponsiveDialogTitle>
                  Create Distribution
                </ResponsiveDialogTitle>
              </ResponsiveDialogHeader>
              <div className="space-y-2 px-4 md:px-0">
                <Tabs defaultValue="details">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details">
                    <Card className="p-4">
                      <DistributionForm form={form} />
                    </Card>
                  </TabsContent>
                  <TabsContent value="products">
                    <Card className="p-4">
                      <DistributionAddProduct products={products} />
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              <ResponsiveDialogFooter>
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
                    onClick={form.handleSubmit((values) =>
                      onSubmit(
                        values,
                        setOpenDistributionDialog,
                        items,
                        clearItems,
                      ),
                    )}
                    disabled={
                      // disabled only when form is not valid, isSubmitting, or
                      // product list is empty
                      !(form.formState.isValid && items.length > 0) ||
                      form.formState.isSubmitting
                    }
                  >
                    Create Distribution
                  </Button>
                </div>
              </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
          </ResponsiveDialog>
        </div>
      </Header>
      <main className="grid flex-1 items-start p-4 lg:px-6 h-[200px]">
        <div className="space-y-2">{renderDistributionTable()}</div>
      </main>
    </React.Fragment>
  );
};

export default DistributionClient;
