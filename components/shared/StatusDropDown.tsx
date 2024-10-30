import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { ApiResponse } from "@/types/api";

type Props<T extends string, R> = {
  id: string;
  mutationKey: string;
  currentStatus: T;
  statuses: Record<T, string>;
  mutationFn: (params: { id: string; status: T }) => Promise<ApiResponse<R>>;
};

const StatusDropdown = <T extends string, R>({
  id,
  mutationKey,
  currentStatus,
  statuses,
  mutationFn,
}: Props<T, R>) => {
  const router = useRouter();

  const { mutate } = useMutation({
    mutationKey: [mutationKey],
    mutationFn: mutationFn,
    onSuccess: () => router.refresh(),
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-[9rem] flex justify-between items-center"
        >
          {statuses[currentStatus]}
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
                "bg-zinc-100": currentStatus === status,
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
