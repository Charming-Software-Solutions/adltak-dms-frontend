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
  MaterialColumns,
  visibleMaterialColumns,
} from "@/components/shared/table/columns/MaterialColumns";
import { DataTable } from "@/components/shared/table/data-table";
import { DataTableSearch } from "@/components/shared/table/data-table-search";
import { Button } from "@/components/ui/button";
import { FormModeEnum, UserRoleEnum } from "@/enums";
import { useDataTable } from "@/hooks/use-data-table";
import { hasPermission } from "@/lib/auth";
import { Classification } from "@/types/generics";
import { Material } from "@/types/material";
import { User } from "@/types/user";
import { FileIcon, PlusCircle } from "lucide-react";
import React, { useMemo, useState } from "react";
import MaterialFilter from "./components/MaterialFilter";
import MaterialForm, { useMaterialForm } from "./components/MaterialForm";
import { CSVLink } from "react-csv";
import { capitalize, formatDateTime, formatFilterValue } from "@/lib/utils";
import { useMaterialFilters } from "@/hooks/use-filters";
import FilterBadge from "@/components/shared/filter/FilterBadge";

type Props = {
  user: User;
  materials: Material[];
  materialTypes: Classification[];
  brands: Classification[];
};

const MaterialsClient = ({ user, materials, materialTypes, brands }: Props) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [materialFilters, setMaterialFilters] = useMaterialFilters();
  const { form, onSubmit } = useMaterialForm({ mode: FormModeEnum.CREATE });

  const { table } = useDataTable({
    columns: MaterialColumns,
    data: materials,
  });

  const materialsToExport = useMemo(() => {
    return materials.map((material) => ({
      code: material.code,
      agency: material.agency,
      name: material.name,
      brand: material.brand.name,
      type: material.type.name,
      stock: material.stock,
      area: material.area,
      created_at: formatDateTime(material.created_at, true),
    }));
  }, [materials]);

  return (
    <React.Fragment>
      <Header>
        <div className="flex items-center justify-end gap-2">
          <CSVLink data={materialsToExport}>
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
                <Button size={"default"} className="h-8 gap-1">
                  <PlusCircle className="size-4" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Material
                  </span>
                </Button>
              </ResponsiveDialogTrigger>
              <ResponsiveDialogContent>
                <ResponsiveDialogHeader className="px-1">
                  <ResponsiveDialogTitle>Add Material</ResponsiveDialogTitle>
                </ResponsiveDialogHeader>
                <MaterialForm
                  mode={FormModeEnum.CREATE}
                  form={form}
                  materialTypes={materialTypes}
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
                      Add Material
                    </DialogFormButton>
                  </div>
                </ResponsiveDialogFooter>
              </ResponsiveDialogContent>
            </ResponsiveDialog>
          )}
        </div>
      </Header>
      <main className="main-container">
        <DataTable
          table={table}
          visibleColumns={visibleMaterialColumns(user.roles)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DataTableSearch
                table={table}
                column={"name"}
                placeholder={"Search material..."}
              />
              <MaterialFilter
                isFilteredByBrands={true}
                classfications={{ brands: brands, types: materialTypes }}
              />
            </div>

            <MaterialFilter
              classfications={{ brands: brands, types: materialTypes }}
            />
          </div>

          <div className="flex items-start gap-2 flex-wrap w-full flex-grow">
            {Object.entries(materialFilters).map(
              ([key, value]) =>
                value && (
                  <FilterBadge
                    key={key}
                    label={capitalize(key)}
                    value={formatFilterValue(value.toString())}
                    onRemove={() => {
                      setMaterialFilters({ [key]: "" });
                    }}
                  />
                ),
            )}
          </div>
        </DataTable>
      </main>
    </React.Fragment>
  );
};

export default MaterialsClient;
