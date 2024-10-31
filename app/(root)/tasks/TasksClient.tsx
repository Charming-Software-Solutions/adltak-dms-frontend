"use client";

import Header from "@/components/shared/Header";
import {
  TaskColumns,
  visibleTaskColumns,
} from "@/components/shared/table/columns/TaskColumns";
import { DataTable } from "@/components/shared/table/data-table";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/task";
import { PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import TaskForm from "./components/TaskForm";
import { Distribution } from "@/types/distribution";
import { useTaskForm } from "@/hooks";
import { taskFormSchema } from "@/schemas";
import { z } from "zod";
import { ICreateTask } from "@/interfaces";
import { ApiResponse } from "@/types/api";
import { createTask } from "@/lib/actions/task.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  tasks: Task[];
  distributions: Distribution[];
};

const TasksClient = ({ tasks, distributions }: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const isDesktop = useMediaQuery({ query: "(min-width: 1224px)" });
  const taskForm = useTaskForm();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit = async (values: z.infer<typeof taskFormSchema>) => {
    const task: ICreateTask = {
      employee: values.employee,
      distribution: values.distribution,
    };

    const result: ApiResponse<Task> = await createTask(task);

    if (result.errors) {
      toast.error(`${result.errors}`, {
        position: "top-center",
      });
    } else {
      setOpenDialog(false);
      router.refresh();
      taskForm.reset();
    }
  };

  return (
    <React.Fragment>
      <Header>
        <div className="flex items-center justify-end gap-2">
          {/* <ResponsiveDialog */}
          {/*   open={openDialog} */}
          {/*   setOpen={setOpenDialog} */}
          {/*   title="Create Task" */}
          {/*   description="" */}
          {/*   trigger={ */}
          {/*     <Button className="h-8"> */}
          {/*       <PlusCircle className="mr-9 md:mr-2 size-4" /> */}
          {/*       <span className="hidden sm:inline">Create Task</span> */}
          {/*     </Button> */}
          {/*   } */}
          {/*   footer={ */}
          {/*     <div className="flex flex-row w-full gap-2"> */}
          {/*       <Button */}
          {/*         className="flex-grow w-full" */}
          {/*         variant={"outline"} */}
          {/*         onClick={() => setOpenDialog(false)} */}
          {/*       > */}
          {/*         Cancel */}
          {/*       </Button> */}
          {/*       <Button */}
          {/*         className="flex-grow w-full" */}
          {/*         disabled={ */}
          {/*           !taskForm.formState.isValid || */}
          {/*           taskForm.formState.isSubmitting */}
          {/*         } */}
          {/*         onClick={() => taskForm.handleSubmit(onSubmit)()} */}
          {/*       > */}
          {/*         Create Task */}
          {/*       </Button> */}
          {/*     </div> */}
          {/*   } */}
          {/* > */}
          {/*   <TaskForm form={taskForm} distributions={distributions} /> */}
          {/* </ResponsiveDialog> */}
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
