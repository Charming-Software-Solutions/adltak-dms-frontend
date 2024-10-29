"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TASK_STATUS,
  TASK_STATUS_EXPORT,
  TASK_STATUS_IMPORT,
} from "@/constants";
import { updateTaskStatus } from "@/lib/actions/task.actions";
import { cn } from "@/lib/utils";
import { TaskStatus } from "@/types/task";
import { useMutation } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  currentStatus: keyof typeof TASK_STATUS;
  type: "IMPORT" | "EXPORT";
};

const TaskStatusDropdown = ({ id, currentStatus, type }: Props) => {
  const router = useRouter();

  const { mutate } = useMutation({
    mutationKey: ["update-order-status"],
    mutationFn: updateTaskStatus,
    onSuccess: () => router.refresh(),
  });

  const statusEnum =
    type === "IMPORT" ? TASK_STATUS_IMPORT : TASK_STATUS_EXPORT;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-[9rem] flex justify-between items-center"
        >
          {TASK_STATUS[currentStatus]}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0">
        {Object.keys(statusEnum).map((status) => (
          <DropdownMenuItem
            key={status}
            className={cn(
              "flex text-sm gap-1 items-center p-2.5 cursor-default hover:bg-zinc-100",
              {
                "bg-zinc-100": currentStatus === status,
              },
            )}
            onClick={() => mutate({ id, status: status as TaskStatus })}
          >
            <Check
              className={cn(
                "mr-2 h-4 w-4 text-primary",
                currentStatus === status ? "opacity-100" : "opacity-0",
              )}
            />
            {TASK_STATUS[status as keyof typeof TASK_STATUS]}{" "}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskStatusDropdown;
