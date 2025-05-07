import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatErrorResponse } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { ApiResponse } from "@/types/api";
import { useMutation } from "@tanstack/react-query";
import { Check, ChevronsUpDown, LoaderIcon } from "lucide-react";
import { toast } from "sonner";

type Props<T extends string, R> = {
  id: string;
  mutationKey: string;
  currentStatus: T;
  statuses: Record<T, string>;
  mutationFn: (params: { id: string; status: T }) => Promise<ApiResponse<R>>;
  onSuccess: () => void;
  disabled?: boolean;
};

const StatusDropdown = <T extends string, R>({
  id,
  mutationKey,
  currentStatus,
  statuses,
  mutationFn,
  onSuccess,
  disabled,
}: Props<T, R>) => {
  const { mutate, isPending } = useMutation({
    mutationKey: [mutationKey],
    mutationFn: mutationFn,
    onSuccess: (response) => {
      if (response.errors) {
        toast.error(formatErrorResponse(response.errors), {
          position: "top-center",
        });
      }

      onSuccess();
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled || isPending}
          className="w-[12rem] flex justify-between items-center"
        >
          {isPending ? (
            <LoaderIcon className="animate-spin" />
          ) : (
            statuses[currentStatus]
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0">
        {Object.keys(statuses).map((status) => (
          <DropdownMenuItem
            key={status}
            className={cn(
              "flex text-sm gap-1 items-center p-2.5 cursor-default hover:bg-zinc-100",
              {
                "bg-muted": currentStatus === status,
              },
            )}
            onClick={() => mutate({ id, status: status as T })}
          >
            <Check
              className={cn(
                "mr-2 h-4 w-4 text-primary",
                currentStatus === status ? "opacity-100" : "opacity-0",
              )}
            />
            {statuses[status as T]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusDropdown;
