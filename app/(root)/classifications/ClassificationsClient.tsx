"use client";

import React, { useState, useMemo } from "react";
import { CSVLink } from "react-csv";
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
  getClassificationColumns,
  visibleClassificationColumns,
} from "@/components/shared/table/columns/ClassificationColumns";
import { DataTable } from "@/components/shared/table/data-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRoleEnum } from "@/enums";
import { useDataTable } from "@/hooks/use-data-table";
import { hasPermission } from "@/lib/auth";
import { Classification } from "@/types/generics";
import { User } from "@/types/user";
import { FileIcon, PlusCircle } from "lucide-react";
import ClassificationForm, {
  useClassificationForm,
} from "./components/ClassificationForm";
import { formatDateTime } from "@/lib/utils";
import DialogFormButton from "@/components/shared/buttons/DialogFormButton";

type Props = {
  user: User;
  classifications: {
    productBrands: Classification[];
    productCategories: Classification[];
    productTypes: Classification[];
    materialTypes: Classification[];
  };
};

const ClassificationsClient = ({ user, classifications }: Props) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "product_brand" | "product_category" | "product_type" | "material_type"
  >("product_brand");

  // Compute the filtered classifications based on the active tab.
  const classificationsToExport = useMemo(() => {
    switch (activeTab) {
      case "product_brand":
        return classifications.productBrands;
      case "product_category":
        return classifications.productCategories;
      case "product_type":
        return classifications.productTypes;
      case "material_type":
        return classifications.materialTypes;
      default:
        return [];
    }
  }, [activeTab, classifications]);

  const renderClassificationTable = (classificationType: typeof activeTab) => {
    let filteredClassifications: Classification[] = [];

    switch (classificationType) {
      case "product_brand":
        filteredClassifications = classifications.productBrands;
        break;
      case "product_category":
        filteredClassifications = classifications.productCategories;
        break;
      case "product_type":
        filteredClassifications = classifications.productTypes;
        break;
      case "material_type":
        filteredClassifications = classifications.materialTypes;
        break;
      default:
        break;
    }

    const { table } = useDataTable({
      columns: getClassificationColumns(classificationType),
      data: filteredClassifications,
    });

    return (
      <DataTable
        table={table}
        showPagination={true}
        visibleColumns={visibleClassificationColumns(user.roles)}
      />
    );
  };

  const { form, onSubmit } = useClassificationForm({ mode: "create" });

  return (
    <>
      <Header>
        <div className="flex items-center justify-end gap-2">
          <CSVLink
            data={classificationsToExport.map((classification) => ({
              name: classification.name,
              description: classification.description,
              created_at: formatDateTime(classification.created_at, true),
            }))}
          >
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
            <ResponsiveDialog open={openDialog} setOpen={setOpenDialog}>
              <ResponsiveDialogTrigger>
                <Button className="h-8">
                  <PlusCircle className="mr-9 md:mr-2" />
                  <span className="hidden sm:inline">Add Classification</span>
                </Button>
              </ResponsiveDialogTrigger>
              <ResponsiveDialogContent>
                <ResponsiveDialogHeader className="px-1">
                  <ResponsiveDialogTitle>
                    Add Classification
                  </ResponsiveDialogTitle>
                </ResponsiveDialogHeader>
                <ClassificationForm form={form} />
                <ResponsiveDialogFooter className="px-1">
                  <div className="flex flex-row w-full gap-2">
                    <Button
                      variant="outline"
                      className="flex-grow w-full"
                      onClick={() => form.reset()}
                    >
                      Reset
                    </Button>
                    <DialogFormButton
                      loading={form.formState.isSubmitting}
                      disabled={
                        !form.formState.isValid || form.formState.isSubmitting
                      }
                      onClick={form.handleSubmit((values) =>
                        onSubmit(values, setOpenDialog),
                      )}
                    >
                      Add Classification
                    </DialogFormButton>
                  </div>
                </ResponsiveDialogFooter>
              </ResponsiveDialogContent>
            </ResponsiveDialog>
          )}
        </div>
      </Header>
      <main className="main-container">
        <Tabs defaultValue={activeTab}>
          <TabsList>
            <TabsTrigger
              value="product_brand"
              onClick={() => setActiveTab("product_brand")}
            >
              Product Brands
            </TabsTrigger>
            <TabsTrigger
              value="product_category"
              onClick={() => setActiveTab("product_category")}
            >
              Product Categories
            </TabsTrigger>
            <TabsTrigger
              value="product_type"
              onClick={() => setActiveTab("product_type")}
            >
              Product Types
            </TabsTrigger>
            <TabsTrigger
              value="material_type"
              onClick={() => setActiveTab("material_type")}
            >
              Material Types
            </TabsTrigger>
          </TabsList>
          <TabsContent value="product_brand">
            {renderClassificationTable("product_brand")}
          </TabsContent>
          <TabsContent value="product_category">
            {renderClassificationTable("product_category")}
          </TabsContent>
          <TabsContent value="product_type">
            {renderClassificationTable("product_type")}
          </TabsContent>
          <TabsContent value="material_type">
            {renderClassificationTable("material_type")}
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
};

export default ClassificationsClient;
