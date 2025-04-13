"use client";

import { Button } from "@/components/ui/button";
import { ApiResponse } from "@/types/api";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "../ResponsiveDialog";
import IconButton from "../buttons/IconButton";
import { toast } from "sonner";
import { formatErrorResponse } from "@/lib/formatters";

type Props = {
  title: string;
  deleteAction: () => Promise<ApiResponse<string>>;
  placeholder: string;
};

const DeleteDialog = ({ title, deleteAction, placeholder }: Props) => {
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();

  return (
    <ResponsiveDialog open={openDialog} setOpen={setOpenDialog}>
      <ResponsiveDialogTrigger>
        <IconButton tooltip="Delete">
          <Trash className="h-4 w-4 text-red-500" />
        </IconButton>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <p className="p-medium-16 md:p-medium-14 text-gray-500 px-4 md:px-0">
          {placeholder}
        </p>
        <ResponsiveDialogFooter>
          <div className="flex flex-row flex-grow w-full gap-2">
            <Button
              className="flex-grow w-full"
              variant={"outline"}
              onClick={() => setOpenDialog(false)}
            >
              <span>Cancel</span>
            </Button>
            <Button
              className="flex-grow w-full"
              variant={"destructive"}
              onClick={async () => {
                const response = await deleteAction();
                if (response.errors) {
                  toast.error(formatErrorResponse(response.errors));
                }
                setOpenDialog(false);
                router.refresh();
              }}
            >
              Delete
            </Button>
          </div>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default DeleteDialog;
