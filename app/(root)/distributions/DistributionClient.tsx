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
  DistributionColumns,
  visibleDistributionColumns,
} from "@/components/shared/table/columns/DistributionColumns";
import { DataTable } from "@/components/shared/table/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDistributionForm } from "@/hooks";
import { ICreateDistribution } from "@/interfaces";
import { createDistribution } from "@/lib/actions/distribution.actions";
import { useDistributionStore } from "@/lib/store";
import { distributionFormSchema } from "@/schemas";
import { ApiResponse } from "@/types/api";
import { Distribution, DistributionType } from "@/types/distribution";
import { Brand, Product } from "@/types/product";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { toast } from "sonner";
import { z } from "zod";
import { useShallow } from "zustand/shallow";
import DistributionAddProduct from "./components/DistributionAddProduct";
import DistributionForm from "./components/DistributionForm";
import FilterDialog from "./components/FilterDialog";

type Props = {
  distributions: Distribution[];
  brands: Brand[];
  products: Product[];
};

const DistributionClient = ({ distributions, brands, products }: Props) => {
  const [openDistributionDialog, setOpenDistributionDialog] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const isDesktop = useMediaQuery({ query: "(min-width: 1224px)" });
  const distributionForm = useDistributionForm();
  const { items, clearItems } = useDistributionStore(
    useShallow((state) => ({
      items: state.items,
      clearItems: state.clearItems,
    })),
  );
  const router = useRouter();

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
          <FilterDialog brands={brands} />
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
                    onClick={() => distributionForm.handleSubmit(onSubmit)()}
                    disabled={
                      // disabled only when form is not valid, isSubmitting, or
                      // product list is empty
                      !(
                        distributionForm.formState.isValid && items.length > 0
                      ) || distributionForm.formState.isSubmitting
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
