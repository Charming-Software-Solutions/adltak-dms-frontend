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
  TaskColumns,
  visibleTaskColumns,
} from "@/components/shared/table/columns/TaskColumns";
import { DataTable } from "@/components/shared/table/data-table";
import { Button } from "@/components/ui/button";
import { Distribution } from "@/types/distribution";
import { Task } from "@/types/task";
import { FileIcon, PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import TaskForm, { useTaskForm } from "./components/TaskForm";
import { Employee, UserSession } from "@/types/user";
import { hasPermission } from "@/lib/auth";
import { UserRoleEnum } from "@/enums";
import DialogFormButton from "@/components/shared/buttons/DialogFormButton";

type Props = {
  user: UserSession;
  tasks: Task[];
  distributions: Distribution[];
  warehousePersons: Employee[];
};

const TasksClient = ({
  user,
  tasks,
  distributions,
  warehousePersons,
}: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const isDesktop = useMediaQuery({ query: "(min-width: 1224px)" });
  const { form, onSubmit } = useTaskForm({ mode: "create" });

  const filteredWarehousePersons = warehousePersons.filter(
    (person) => person.user.role === UserRoleEnum.WAREHOUSE_WORKER,
  );

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
                      className="flex-grow w-full"
                      variant={"outline"}
                      onClick={() => setOpenDialog(false)}
                    >
                      Cancel
                    </Button>
                    <DialogFormButton
                      text="Create Task"
                      onClick={form.handleSubmit((values) =>
                        onSubmit(values, setOpenDialog),
                      )}
                      disabled={
                        !form.formState.isValid || form.formState.isSubmitting
                      }
                      loading={form.formState.isSubmitting}
                    />
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
            data={tasks}
            visibleColumns={
              isDesktop
                ? visibleTaskColumns(user.role).desktop
                : visibleTaskColumns(user.role).mobile
            }
          />
        ) : null}
      </main>
    </React.Fragment>
  );
};

export default TasksClient;
