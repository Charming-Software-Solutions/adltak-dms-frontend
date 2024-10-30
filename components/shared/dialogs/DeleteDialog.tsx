"use client";

import React, { useState } from "react";
import ResponsiveDialog from "../ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/types/api";

type Props = {
  deleteAction: () => Promise<ApiResponse<string>>;
  placeholder: string;
};

const DeleteDialog = ({ deleteAction, placeholder }: Props) => {
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();

  return (
    <ResponsiveDialog
      open={openDialog}
      setOpen={setOpenDialog}
      title={"Delete Product"}
      description="Product deletion action"
      trigger={
        <Button size={"icon"} variant={"outline"} className="w-10">
          <Trash className="h-4 w-4" />
        </Button>
      }
      footer={
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
              await deleteAction();
              setOpenDialog(false);
              router.refresh();
            }}
          >
            Delete
          </Button>
        </div>
      }
    >
      <p className="p-medium-16 md:p-medium-14 text-gray-500 px-4 md:px-0">
        {placeholder}
      </p>
    </ResponsiveDialog>
  );
};

export default DeleteDialog;
