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
import { PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import TaskForm, { useTaskForm } from "./components/TaskForm";

type Props = {
  tasks: Task[];
  distributions: Distribution[];
};

const TasksClient = ({ tasks, distributions }: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const isDesktop = useMediaQuery({ query: "(min-width: 1224px)" });
  const { form, onSubmit } = useTaskForm({ mode: "create" });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <React.Fragment>
      <Header>
        <div className="flex items-center justify-end gap-2">
          <ResponsiveDialog open={openDialog} setOpen={setOpenDialog}>
            <ResponsiveDialogTrigger>
              <Button className="h-8">
                <PlusCircle className="mr-9 md:mr-2 size-4" />
                <span className="hidden sm:inline">Create Task</span>
              </Button>
            </ResponsiveDialogTrigger>
            <ResponsiveDialogContent>
              <ResponsiveDialogHeader>
                <ResponsiveDialogTitle>Create Task</ResponsiveDialogTitle>
              </ResponsiveDialogHeader>
              <TaskForm form={form} distributions={distributions} />
              <ResponsiveDialogFooter>
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
                    onClick={form.handleSubmit((values) =>
                      onSubmit(values, setOpenDialog),
                    )}
                  >
                    Create Task
                  </Button>
                </div>
              </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
          </ResponsiveDialog>
        </div>
      </Header>

      <main className="main-container">
        {isMounted ? (
          <DataTable
            columns={TaskColumns}
            data={tasks}
            visibleColumns={
              isDesktop ? visibleTaskColumns.desktop : visibleTaskColumns.mobile
            }
          />
        ) : null}
      </main>
    </React.Fragment>
  );
};

export default TasksClient;
