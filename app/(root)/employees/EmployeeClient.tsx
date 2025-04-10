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
import { DataTable } from "@/components/shared/table/data-table";
import { DataTableSearch } from "@/components/shared/table/data-table-search";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormModeEnum, UserRoleEnum } from "@/enums";
import { useDataTable } from "@/hooks/use-data-table";
import { Employee } from "@/types/user";
import { FileIcon, PlusCircle } from "lucide-react";
import React, { useState, useMemo } from "react";
import EmployeeForm, { useEmployeeForm } from "./components/EmployeeForm";

type Props = {
  employees: Employee[];
  currentAdmin: Employee;
};

type EmployeeTab = "all" | "logistics" | "warehouse" | "project";

const EmployeeClient = ({ employees, currentAdmin }: Props) => {
  const [openUserDialog, setOpenUserDialog] = useState(false);

  const { form, onSubmit } = useEmployeeForm({ mode: "create" });

  const filteredEmployees = useMemo(() => {
    return {
      all: employees.filter(
        (employee) => employee.user.id !== currentAdmin.user.id,
      ),
      logistics: employees.filter(
        (employee) =>
          employee.user.roles.includes(UserRoleEnum.LOGISTICS_TEAM_MEMBER) &&
          employee.user.id !== currentAdmin.user.id,
      ),
      warehouse: employees.filter(
        (employee) =>
          employee.user.roles.includes(UserRoleEnum.WAREHOUSE_PERSONNEL) &&
          employee.user.id !== currentAdmin.user.id,
      ),
      project: employees.filter(
        (employee) =>
          employee.user.roles.includes(UserRoleEnum.PROJECT_MANAGER) &&
          employee.user.id !== currentAdmin.user.id,
      ),
    };
  }, [employees, currentAdmin.user.id]);

  const renderEmployeeTable = useMemo(
    () => (tab: EmployeeTab) => {
      const filtered = filteredEmployees[tab];

      const { table } = useDataTable({
        columns: EmployeeColumns,
        data: filtered,
      });

      return (
        <DataTable table={table} visibleColumns={visibileEmployeeColumns}>
          <div className="flex items-center justify-between">
            <DataTableSearch
              table={table}
              column={"email"}
              placeholder={"Search email..."}
            />
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="logistics">Logistics Team Member</TabsTrigger>
              <TabsTrigger value="project">Project Manager</TabsTrigger>
              <TabsTrigger value="warehouse">Warehouse Personnel</TabsTrigger>
            </TabsList>
          </div>
        </DataTable>
      );
    },
    [filteredEmployees],
  );

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
            <ResponsiveDialogContent className="max-w-xl">
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
                    disabled={
                      !form.formState.isValid || form.formState.isSubmitting
                    }
                    loading={form.formState.isSubmitting}
                    onClick={form.handleSubmit((values) =>
                      onSubmit(values, setOpenUserDialog),
                    )}
                  >
                    Create Employee
                  </DialogFormButton>
                </div>
              </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
          </ResponsiveDialog>
        </div>
      </Header>
      <main className="grid flex-1 items-start px-4 pt-2 lg:px-6 h-[200px]">
        <Tabs defaultValue="all">
          <TabsContent value="all">{renderEmployeeTable("all")}</TabsContent>
          <TabsContent value="logistics">
            {renderEmployeeTable("logistics")}
          </TabsContent>
          <TabsContent value="project">
            {renderEmployeeTable("project")}
          </TabsContent>
          <TabsContent value="warehouse">
            {renderEmployeeTable("warehouse")}
          </TabsContent>
        </Tabs>
      </main>
    </React.Fragment>
  );
};

export default EmployeeClient;
