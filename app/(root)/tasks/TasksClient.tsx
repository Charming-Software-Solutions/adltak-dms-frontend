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
import { DataTable } from "@/components/shared/table/data-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormModeEnum, TaskStatusEnum, UserRoleEnum } from "@/enums";
import { useDataTable } from "@/hooks/use-data-table";
import { hasPermission } from "@/lib/auth";
import { Project } from "@/types/project";
import { Task } from "@/types/task";
import { Employee } from "@/types/user";
import { FileIcon, PlusCircle } from "lucide-react";
import React, { useState, useMemo } from "react";
import TaskForm, { useTaskForm } from "./components/TaskForm";
import TaskFilter from "./components/TaskFilter";
import { DataTableSearch } from "@/components/shared/table/data-table-search";
import { CSVLink } from "react-csv";
import { formatDateTime } from "@/lib/utils";
import { useTaskFilters } from "@/hooks/use-filters";
import FilterBadge from "@/components/shared/filter/FilterBadge";
import { TASK_STATUS } from "@/constants";

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
  const { form, onSubmit } = useTaskForm({ mode: FormModeEnum.CREATE });
  const [taskFilters, setTaskFilters] = useTaskFilters();
  const { status, start_date, end_date } = taskFilters;

  const hasWarehousePersonnelRole = employee.user.roles.includes(
    UserRoleEnum.WAREHOUSE_PERSONNEL,
  );
  const isWarehousePersonnelOnly =
    employee.user.roles.length === 1 && hasWarehousePersonnelRole;

  const uniqueTasks = useMemo(() => {
    return [
      ...new Map(tasks.map((task) => [task.project.name, task])).values(),
    ];
  }, [tasks]);

  const ownTasks = useMemo(() => {
    return tasks.filter((task) => task.warehouse_person.id === employee.id);
  }, [tasks, employee.id]);

  const tasksToExport = employee.user.roles.includes(
    UserRoleEnum.WAREHOUSE_PERSONNEL,
  )
    ? isWarehousePersonnelOnly
      ? ownTasks
      : tasks
    : uniqueTasks;

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

    const { table } = useDataTable({
      columns: TaskColumns(employee.user.roles),
      data: employee.user.roles.includes(UserRoleEnum.WAREHOUSE_PERSONNEL)
        ? filteredTasks
        : uniqueTasks,
    });

    return (
      <DataTable
        table={table}
        visibleColumns={visibleTaskColumns(employee.user.roles)}
      >
        <div className="flex items-center justify-between">
          <DataTableSearch
            table={table}
            column={"project"}
            placeholder={"Search project..."}
          />
          <div className="flex items-center space-x-2">
            <TabsList>
              <TabsTrigger value="all" disabled={isWarehousePersonnelOnly}>
                All
              </TabsTrigger>
              {hasWarehousePersonnelRole && (
                <TabsTrigger value="my_tasks">My Tasks</TabsTrigger>
              )}
            </TabsList>
            <TaskFilter />
          </div>
        </div>
        <div className="flex items-start gap-2 flex-wrap w-full flex-grow">
          {status && (
            <FilterBadge
              key="status"
              onRemove={() => {
                setTaskFilters({ status: "" });
              }}
              label="Status"
              value={TASK_STATUS[status as TaskStatusEnum]}
            />
          )}
          {start_date && end_date && (
            <FilterBadge
              key="dateRange"
              onRemove={() => {
                setTaskFilters({ start_date: null, end_date: null });
              }}
              label="Date"
              value={`${start_date.toLocaleDateString()} - ${end_date.toLocaleDateString()}`}
            />
          )}
        </div>
      </DataTable>
    );
  };

  return (
    <React.Fragment>
      <Header>
        <div className="flex items-center justify-end gap-2">
          <CSVLink
            data={tasksToExport.map((task) => ({
              warehouse_person: `${task.warehouse_person.first_name} ${task.warehouse_person.last_name}`,
              ba_reference_number: task.project.ba_reference_number,
              project: task.project.name,
              created_at: formatDateTime(task.created_at, true),
              updated_at: formatDateTime(task.updated_at, true),
            }))}
          >
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <FileIcon className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
          </CSVLink>
          {hasPermission(employee.user.roles, [
            UserRoleEnum.ADMIN,
            UserRoleEnum.PROJECT_MANAGER,
          ]) && (
            <ResponsiveDialog open={openDialog} setOpen={setOpenDialog}>
              <ResponsiveDialogTrigger>
                <Button size={"default"} className="h-8 gap-1">
                  <PlusCircle className="size-4" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Create Task
                  </span>
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
          <TabsContent value="all">{renderTaskTable("all")}</TabsContent>
          <TabsContent value="my_tasks">
            {renderTaskTable("my_tasks")}
          </TabsContent>
        </Tabs>
      </main>
    </React.Fragment>
  );
};

export default TasksClient;
