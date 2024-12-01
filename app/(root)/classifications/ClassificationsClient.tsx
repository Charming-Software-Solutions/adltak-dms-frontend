"use client";

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
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRoleEnum } from "@/enums";
import { useResponsive } from "@/hooks";
import { useDataTable } from "@/hooks/use-datatable";
import { hasPermission } from "@/lib/auth";
import { Classification, ClassificationType } from "@/types/generics";
import { UserSession } from "@/types/user";
import { FileIcon, PlusCircle } from "lucide-react";
import React, { useState } from "react";
import ClassificationForm, {
  useClassificationForm,
} from "./components/ClassificationForm";
import DialogFormButton from "@/components/shared/buttons/DialogFormButton";

type Props = {
  user: UserSession;
  classifications: {
    productBrands: Classification[];
    productCategories: Classification[];
    productTypes: Classification[];
    assetTypes: Classification[];
  };
};

const ClassificationsClient = ({ user, classifications }: Props) => {
  const [openDialog, setOpenDialog] = useState(false);

  const renderClassificationTable = (
    classificationType: ClassificationType,
  ) => {
    let filteredClassifcations: Classification[] = [];

    switch (classificationType) {
      case "all":
        filteredClassifcations = [
          ...classifications.productBrands,
          ...classifications.productCategories,
          ...classifications.productTypes,
          ...classifications.assetTypes,
        ];
        break;
      case "product_brand":
        filteredClassifcations = classifications.productBrands;
        break;
      case "product_category":
        filteredClassifcations = classifications.productCategories;
        break;
      case "product_type":
        filteredClassifcations = classifications.productTypes;
        break;
      case "asset_type":
        filteredClassifcations = classifications.assetTypes;
      default:
        break;
    }
    const dataTable = useDataTable({
      columns: getClassificationColumns(classificationType),
      data: filteredClassifcations,
      visibleColumns: isDesktop
        ? visibleClassificationColumns(user.role).desktop
        : visibleClassificationColumns(user.role).mobile,
    });
    return dataTable;
  };

  const isDesktop = useResponsive("desktop");
  const { form, onSubmit } = useClassificationForm({ mode: "create" });

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
          {hasPermission(user.role, [
            UserRoleEnum.ADMIN,
            UserRoleEnum.LOGISTICS_SPECIALIST,
          ]) && (
            <ResponsiveDialog open={openDialog} setOpen={setOpenDialog}>
              <ResponsiveDialogTrigger>
                <Button className="h-8">
                  <PlusCircle className="mr-9 md:mr-2 size-4" />
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
                      variant={"outline"}
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
        <Tabs defaultValue="product_brand">
          <TabsList>
            <TabsTrigger value="product_brand">Product Brands</TabsTrigger>
            <TabsTrigger value="product_category">
              Product Categories
            </TabsTrigger>
            <TabsTrigger value="product_type">Product Types</TabsTrigger>
            <TabsTrigger value="asset_type">Asset Types</TabsTrigger>
          </TabsList>
          <TabsContent value="product_brand">
            {renderClassificationTable("product_brand").render()}
          </TabsContent>
          <TabsContent value="product_category">
            {renderClassificationTable("product_category").render()}
          </TabsContent>
          <TabsContent value="product_type">
            {renderClassificationTable("product_type").render()}
          </TabsContent>
          <TabsContent value="asset_type">
            {renderClassificationTable("asset_type").render()}
          </TabsContent>
        </Tabs>
      </main>
    </React.Fragment>
  );
};

export default ClassificationsClient;
