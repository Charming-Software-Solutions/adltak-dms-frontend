"use client";

import DialogFormButton from "@/components/shared/buttons/DialogFormButton";
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
import { Button } from "@/components/ui/button";
import { FormModeEnum, UserRoleEnum } from "@/enums";
import { useResponsive } from "@/hooks";
import { useDataTable } from "@/hooks/use-datatable";
import { hasPermission } from "@/lib/auth";
import { Asset } from "@/types/asset";
import { Classification } from "@/types/generics";
import { User } from "@/types/user";
import { FileIcon, PlusCircle } from "lucide-react";
import React, { useState } from "react";
import AssetForm, { useAssetForm } from "./components/AssetForm";

type Props = {
  user: User;
  assets: Asset[];
  assetTypes: Classification[];
  brands: Classification[];
};

const AssetsClient = ({ user, assets, assetTypes, brands }: Props) => {
  const [openDialog, setOpenDialog] = useState(false);

  const isDesktop = useResponsive("desktop");
  const { form, onSubmit } = useAssetForm({ mode: FormModeEnum.CREATE });

  const dataTable = useDataTable({
    columns: AssetColumns,
    data: assets,
    visibleColumns: isDesktop
      ? visibleAssetColumns(user.roles).desktop
      : visibleAssetColumns(user.roles).mobile,
    leftTools: {
      searchField: {
        column: "name",
        placeholder: "Search asset...",
      },
    },
  });

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
          {hasPermission(user.roles, [
            UserRoleEnum.ADMIN,
            UserRoleEnum.LOGISTICS_TEAM_MEMBER,
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
                  brands={brands}
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
      <main className="main-container">{dataTable.render()}</main>
    </React.Fragment>
  );
};

export default AssetsClient;
