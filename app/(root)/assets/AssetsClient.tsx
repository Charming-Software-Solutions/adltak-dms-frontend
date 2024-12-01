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
  AssetColumns,
  visibleAssetColumns,
} from "@/components/shared/table/columns/AssetColumns";
import { DataTable } from "@/components/shared/table/data-table";
import { Button } from "@/components/ui/button";
import { useResponsive } from "@/hooks";
import { Asset } from "@/types/asset";
import { Classification } from "@/types/generics";
import { FileIcon, PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import AssetForm, { useAssetForm } from "./components/AssetForm";
import { UserSession } from "@/types/user";
import { hasPermission } from "@/lib/auth";
import { UserRoleEnum } from "@/enums";
import { Product } from "@/types/product";
import DialogFormButton from "@/components/shared/buttons/DialogFormButton";
import FilterTaskAsset, {
  useAssetTaskFilters,
} from "@/components/shared/filter/FilterAssetTask";

type Props = {
  user: UserSession;
  assets: Asset[];
  assetTypes: Classification[];
  products: Product[];
};

const AssetsClient = ({ user, assets, assetTypes, products }: Props) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const isDesktop = useResponsive("desktop");
  const { form, onSubmit } = useAssetForm({ mode: "create" });
  const { getFilteredItems } = useAssetTaskFilters(assets);

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
          {hasPermission(user.role, [
            UserRoleEnum.ADMIN,
            UserRoleEnum.LOGISTICS_SPECIALIST,
          ]) && (
            <ResponsiveDialog open={openDialog} setOpen={setOpenDialog}>
              <ResponsiveDialogTrigger>
                <Button className="h-8">
                  <PlusCircle className="mr-9 md:mr-2 size-4" />
                  <span className="hidden sm:inline">Add Asset</span>
                </Button>
              </ResponsiveDialogTrigger>
              <ResponsiveDialogContent>
                <ResponsiveDialogHeader className="px-1">
                  <ResponsiveDialogTitle>Add Asset</ResponsiveDialogTitle>
                </ResponsiveDialogHeader>
                <AssetForm
                  form={form}
                  assetTypes={assetTypes}
                  products={products}
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
                    <DialogFormButton
                      onClick={form.handleSubmit((values) =>
                        onSubmit(values, setOpenDialog),
                      )}
                      disabled={
                        !form.formState.isValid || form.formState.isSubmitting
                      }
                      loading={form.formState.isSubmitting}
                    >
                      Add Asset
                    </DialogFormButton>
                  </div>
                </ResponsiveDialogFooter>
              </ResponsiveDialogContent>
            </ResponsiveDialog>
          )}
        </div>
      </Header>
      <main className="main-container">
        {isMounted ? (
          <DataTable
            columns={AssetColumns}
            data={getFilteredItems()}
            visibleColumns={
              isDesktop
                ? visibleAssetColumns(user.role).desktop
                : visibleAssetColumns(user.role).mobile
            }
            searchField={{
              placeholder: "Search asset...",
              column: "name",
            }}
            filters={
              <FilterTaskAsset
                items={assets}
                type="asset"
                assetTypes={assetTypes}
              />
            }
          />
        ) : null}
      </main>
    </React.Fragment>
  );
};

export default AssetsClient;
