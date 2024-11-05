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
import { PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import AssetForm, { useAssetForm } from "./components/AssetForm";

type Props = {
  assets: Asset[];
  assetTypes: Classification[];
};

const AssetsClient = ({ assets, assetTypes }: Props) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const isDesktop = useResponsive("desktop");
  const { form, onSubmit } = useAssetForm({ mode: "create" });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <React.Fragment>
      <Header>
        <div className="flex items-center justify-end gap-2">
          <ResponsiveDialog open={openDialog} setOpen={setOpenDialog}>
            <ResponsiveDialogTrigger>
              <Button className="h-8">
                <PlusCircle className="mr-9 md:mr-2 size-4" />
                <span className="hidden sm:inline">Add Asset</span>
              </Button>
            </ResponsiveDialogTrigger>
            <ResponsiveDialogContent>
              <ResponsiveDialogHeader>
                <ResponsiveDialogTitle>Add Asset</ResponsiveDialogTitle>
              </ResponsiveDialogHeader>
              <AssetForm form={form} assetTypes={assetTypes} />
              <ResponsiveDialogFooter>
                <div className="flex flex-row w-full gap-2">
                  <Button
                    className="flex-grow w-full"
                    variant={"outline"}
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-grow w-full"
                    disabled={
                      !form.formState.isValid || form.formState.isSubmitting
                    }
                    onClick={form.handleSubmit((values) =>
                      onSubmit(values, setOpenDialog),
                    )}
                  >
                    Add Asset
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
            columns={AssetColumns}
            data={assets}
            visibleColumns={
              isDesktop
                ? visibleAssetColumns.desktop
                : visibleAssetColumns.mobile
            }
          />
        ) : null}
      </main>
    </React.Fragment>
  );
};

export default AssetsClient;
