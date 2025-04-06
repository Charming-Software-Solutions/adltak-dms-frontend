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
  TaskColumns,
  visibleTaskColumns,
} from "@/components/shared/table/columns/TaskColumns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormModeEnum, UserRoleEnum } from "@/enums";
import { useResponsive } from "@/hooks";
import { useDataTable } from "@/hooks/use-datatable";
import { hasPermission } from "@/lib/auth";
import { Project } from "@/types/project";
import { Task } from "@/types/task";
import { Employee } from "@/types/user";
import { FileIcon, PlusCircle } from "lucide-react";
import React, { useState } from "react";
import TaskForm, { useTaskForm } from "./components/TaskForm";

type Props = {
  employee: Employee;
  tasks: Task[];
  projects: Project[];
  warehousePersons: Employee[];
};

const TasksClient = ({
  employee,
  tasks,
  projects,
  warehousePersons,
}: Props) => {
  const [openDialog, setOpenDialog] = useState(false);
  const isDesktop = useResponsive("desktop");
  const { form, onSubmit } = useTaskForm({ mode: "create" });

  // Checks if is warehouse personnel only and only if they
  // have a single role which is the warehouse personnel
  const hasWarehousePersonnelRole = employee.user.roles.includes(
    UserRoleEnum.WAREHOUSE_PERSONNEL,
  );
  const isWarehousePersonnelOnly =
    employee.user.roles.length === 1 && hasWarehousePersonnelRole;

  const uniqueTasks = [
    ...new Map(tasks.map((task) => [task.project.name, task])).values(),
  ];

  const ownTasks = tasks.filter(
    (task) => task.warehouse_person.id === employee.id,
  );

  const renderTaskTable = (tab: "all" | "my_tasks") => {
    let filteredTasks: Task[] = [];

    if (isWarehousePersonnelOnly) {
      filteredTasks = ownTasks;
    }

    switch (tab) {
      case "all":
        filteredTasks = tasks;
        break;
      case "my_tasks":
        filteredTasks = ownTasks;
        break;
      default:
        break;
    }

    const dataTable = useDataTable({
      columns: TaskColumns(employee.user.roles),
      data: employee.user.roles.includes(UserRoleEnum.WAREHOUSE_PERSONNEL)
        ? filteredTasks
        : uniqueTasks,
      visibleColumns: isDesktop
        ? visibleTaskColumns(employee.user.roles).desktop
        : visibleTaskColumns(employee.user.roles).mobile,
      leftTools: {
        searchField: {
          column: "project",
          placeholder: "Search project...",
        },
      },
      tabsList: (
        <TabsList>
          <TabsTrigger value="all" disabled={isWarehousePersonnelOnly}>
            All
          </TabsTrigger>
          {hasWarehousePersonnelRole && (
            <TabsTrigger value="my_tasks">My Tasks</TabsTrigger>
          )}
        </TabsList>
      ),
    });

    return dataTable;
  };

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
          {hasPermission(employee.user.roles, [
            UserRoleEnum.ADMIN,
            UserRoleEnum.PROJECT_MANAGER,
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
                  mode={FormModeEnum.CREATE}
                  form={form}
                  projects={projects}
                  warehousePersons={warehousePersons}
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
        <Tabs
          defaultValue={isWarehousePersonnelOnly ? "my_tasks" : "all"}
          className="overflow-auto"
        >
          <TabsContent value="all">
            {renderTaskTable("all").render()}
          </TabsContent>
          <TabsContent value="my_tasks">
            {renderTaskTable("my_tasks").render()}
          </TabsContent>
        </Tabs>
      </main>
    </React.Fragment>
  );
};

export default TasksClient;
