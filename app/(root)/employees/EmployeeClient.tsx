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
  EmployeeColumns,
  visibileEmployeeColumns,
} from "@/components/shared/table/columns/EmployeeColumns";
import { Button } from "@/components/ui/button";
import { useResponsive } from "@/hooks";
import { useDataTable } from "@/hooks/use-datatable";
import { Employee } from "@/types/user";
import React, { useState } from "react";
import EmployeeForm, { useEmployeeForm } from "./components/EmployeeForm";
import { FormModeEnum } from "@/enums";
import { FileIcon, PlusCircle } from "lucide-react";

type Props = {
  employees: Employee[];
};

const EmployeeClient = ({ employees }: Props) => {
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const { form, onSubmit } = useEmployeeForm({ mode: "create" });

  const isDesktop = useResponsive("desktop");
  const dataTable = useDataTable({
    columns: EmployeeColumns,
    data: employees,
    visibleColumns: isDesktop
      ? visibileEmployeeColumns.desktop
      : visibileEmployeeColumns.mobile,
    searchField: {
      column: "email",
      placeholder: "Search employee email",
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
          <ResponsiveDialog open={openUserDialog} setOpen={setOpenUserDialog}>
            <ResponsiveDialogTrigger>
              <Button className="h-8">
                <PlusCircle className="mr-9 md:mr-2 size-4" />
                <span className="hidden sm:inline">Create Employee</span>
              </Button>
            </ResponsiveDialogTrigger>
            <ResponsiveDialogContent>
              <ResponsiveDialogHeader>
                <ResponsiveDialogTitle>Create Employee</ResponsiveDialogTitle>
              </ResponsiveDialogHeader>
              <EmployeeForm form={form} mode={FormModeEnum.CREATE} />
              <ResponsiveDialogFooter>
                <div className="flex flex-row w-full gap-2">
                  <Button
                    className="flex-grow w-full"
                    variant={"outline"}
                    onClick={() => setOpenUserDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-grow w-full"
                    disabled={
                      !form.formState.isValid || form.formState.isSubmitting
                    }
                    onClick={form.handleSubmit((values) =>
                      onSubmit(values, setOpenUserDialog),
                    )}
                  >
                    Create Employee
                  </Button>
                </div>
              </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
          </ResponsiveDialog>
        </div>
      </Header>
      <main className="main-container">{dataTable.render()}</main>
    </React.Fragment>
  );
};

export default EmployeeClient;
