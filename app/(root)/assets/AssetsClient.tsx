"use client";

import Header from "@/components/shared/Header";
import ResponsiveDialog from "@/components/shared/ResponsiveDialog";
import {
  AssetColumns,
  visibleAssetColumns,
} from "@/components/shared/table/columns/AssetColumns";
import { DataTable } from "@/components/shared/table/data-table";
import { Button } from "@/components/ui/button";
import { useAssetForm, useResponsive } from "@/hooks";
import { Asset } from "@/types/asset";
import { PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import AssetForm from "./components/AssetForm";
import { Classification } from "@/types/generics";
import { assetFormSchema } from "@/schemas";
import { z } from "zod";
import { ICreateAsset } from "@/interfaces";
import { ApiResponse } from "@/types/api";
import { createAsset } from "@/lib/actions/asset.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  assets: Asset[];
  assetTypes: Classification[];
};

const AssetsClient = ({ assets, assetTypes }: Props) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();
  const isDesktop = useResponsive("desktop");
  const form = useAssetForm();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit = async (values: z.infer<typeof assetFormSchema>) => {
    const asset: ICreateAsset = {
      name: values.name,
      code: values.code,
      type: values.type,
    };

    const result: ApiResponse<Asset> = await createAsset(asset);

    if (result.errors) {
      toast.error(`${result.errors}`, {
        position: "top-center",
      });
    } else {
      setOpenDialog(false);
      router.refresh();
      form.reset();
    }
  };

  return (
    <React.Fragment>
      <Header>
        <div className="flex items-center justify-end gap-2">
          <ResponsiveDialog
            open={openDialog}
            setOpen={setOpenDialog}
            title="Add Asset"
            description=""
            trigger={
              <Button className="h-8">
                <PlusCircle className="mr-9 md:mr-2 size-4" />
                <span className="hidden sm:inline">Add Asset</span>
              </Button>
            }
            footer={
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
                  onClick={() => form.handleSubmit(onSubmit)()}
                >
                  Add Asset
                </Button>
              </div>
            }
          >
            <AssetForm form={form} assetTypes={assetTypes} />
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
