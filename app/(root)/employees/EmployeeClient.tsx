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
  EmployeeColumns,
  visibileEmployeeColumns,
} from "@/components/shared/table/columns/EmployeeColumns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormModeEnum, UserRoleEnum } from "@/enums";
import { useResponsive } from "@/hooks";
import { useDataTable } from "@/hooks/use-datatable";
import { Employee } from "@/types/user";
import { FileIcon, PlusCircle } from "lucide-react";
import React, { useState } from "react";
import EmployeeForm, { useEmployeeForm } from "./components/EmployeeForm";

type Props = {
  employees: Employee[];
  currentAdmin: Employee;
};

type EmployeeTab = "all" | "logistics" | "warehouse" | "project";

const EmployeeClient = ({ employees, currentAdmin }: Props) => {
  const [openUserDialog, setOpenUserDialog] = useState(false);

  const { form, onSubmit } = useEmployeeForm({ mode: "create" });

  const renderEmployeeTable = (tab: EmployeeTab) => {
    let filteredEmployees: Employee[] = [];

    switch (tab) {
      case "all":
        filteredEmployees = employees;
        break;
      case "logistics":
        filteredEmployees = employees.filter(
          (employee) =>
            employee.user.role === UserRoleEnum.LOGISTICS_SPECIALIST,
        );
        break;
      case "warehouse":
        filteredEmployees = employees.filter(
          (employee) => employee.user.role === UserRoleEnum.WAREHOUSE_WORKER,
        );
        break;
      case "project":
        filteredEmployees = employees.filter(
          (employee) => employee.user.role === UserRoleEnum.PROJECT_HANDLER,
        );
        break;
      default:
        break;
    }

    filteredEmployees = filteredEmployees.filter(
      (employee) => employee.user.id !== currentAdmin.user.id,
    );

    const dataTable = useDataTable({
      columns: EmployeeColumns,
      data: filteredEmployees,
      visibleColumns: isDesktop
        ? visibileEmployeeColumns.desktop
        : visibileEmployeeColumns.mobile,
      searchField: {
        column: "email",
        placeholder: "Search email...",
        className: "w-[100rem]",
      },
      tabsList: (
        <div>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="logistics">Logistics Team Member</TabsTrigger>
            <TabsTrigger value="project">Project Manager</TabsTrigger>
            <TabsTrigger value="warehouse">Warehouse Personnel</TabsTrigger>
          </TabsList>
        </div>
      ),
    });

    return dataTable;
  };

  const isDesktop = useResponsive("desktop");

  return (
    <React.Fragment>
      <Header>
        <div className="flex items-center justify-end gap-2">
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <FileIcon className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
          </div>

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
                    variant={"outline"}
                    className="flex-grow w-full"
                    onClick={() => form.reset()}
                  >
                    Reset
                  </Button>
                  <DialogFormButton
                    text="Create Employee"
                    disabled={
                      !form.formState.isValid || form.formState.isSubmitting
                    }
                    loading={form.formState.isSubmitting}
                    onClick={form.handleSubmit((values) =>
                      onSubmit(values, setOpenUserDialog),
                    )}
                  />
                </div>
              </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
          </ResponsiveDialog>
        </div>
      </Header>
      <main className="grid flex-1 items-start px-4 pt-2 lg:px-6 h-[200px]">
        <Tabs defaultValue="all">
          <TabsContent value="all">
            {renderEmployeeTable("all").render()}
          </TabsContent>
          <TabsContent value="logistics">
            {renderEmployeeTable("logistics").render()}
          </TabsContent>
          <TabsContent value="project">
            {renderEmployeeTable("project").render()}
          </TabsContent>
          <TabsContent value="warehouse">
            {renderEmployeeTable("warehouse").render()}
          </TabsContent>
        </Tabs>
      </main>
    </React.Fragment>
  );
};

export default EmployeeClient;
