"use client";

import DialogFormButton from "@/components/shared/buttons/DialogFormButton";
import FilterTaskAsset, {
  useAssetTaskFilters,
} from "@/components/shared/filter/FilterAssetTask";
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
  TaskColumns,
  visibleTaskColumns,
} from "@/components/shared/table/columns/TaskColumns";
import { DataTable } from "@/components/shared/table/data-table";
import { Button } from "@/components/ui/button";
import { UserRoleEnum } from "@/enums";
import { hasPermission } from "@/lib/auth";
import { Distribution } from "@/types/distribution";
import { Task } from "@/types/task";
import { Employee } from "@/types/user";
import { FileIcon, PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import TaskForm, { useTaskForm } from "./components/TaskForm";

type Props = {
  employee: Employee;
  tasks: Task[];
  distributions: Distribution[];
  warehousePersons: Employee[];
};

const TasksClient = ({
  employee,
  tasks,
  distributions,
  warehousePersons,
}: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const isDesktop = useMediaQuery({ query: "(min-width: 1224px)" });
  const { form, onSubmit } = useTaskForm({ mode: "create" });
  const { getFilteredItems } = useAssetTaskFilters(tasks);

  const filteredWarehousePersons = warehousePersons.filter(
    (person) => person.user.role === UserRoleEnum.WAREHOUSE_WORKER,
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);
  console.log(tasks);

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
          {hasPermission(employee.user.role, [
            UserRoleEnum.ADMIN,
            UserRoleEnum.PROJECT_HANDLER,
          ]) && (
            <ResponsiveDialog open={openDialog} setOpen={setOpenDialog}>
              <ResponsiveDialogTrigger>
                <Button className="h-8">
                  <PlusCircle className="mr-9 md:mr-2 size-4" />
                  <span className="hidden sm:inline">Create Task</span>
                </Button>
              </ResponsiveDialogTrigger>
              <ResponsiveDialogContent>
                <ResponsiveDialogHeader className="px-1">
                  <ResponsiveDialogTitle>Create Task</ResponsiveDialogTitle>
                </ResponsiveDialogHeader>
                <TaskForm
                  form={form}
                  distributions={distributions}
                  warehousePersons={filteredWarehousePersons}
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
                      Create Task
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
            columns={TaskColumns}
            data={getFilteredItems()}
            visibleColumns={
              isDesktop
                ? visibleTaskColumns(employee.user.role).desktop
                : visibleTaskColumns(employee.user.role).mobile
            }
            searchField={{
              placeholder: "Search distribution...",
              column: "distribution_id",
            }}
            filters={<FilterTaskAsset items={tasks} type="task" />}
          />
        ) : null}
      </main>
    </React.Fragment>
  );
};

export default TasksClient;
