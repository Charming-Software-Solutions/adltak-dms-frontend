"use client";

import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "../ResponsiveDialog";

type Props = {
  title: string;
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditDialog = ({ title, children, open, setOpen }: Props) => {
  return (
    <ResponsiveDialog open={open} setOpen={setOpen}>
      <ResponsiveDialogTrigger>
        <Button size={"icon"} variant={"outline"}>
          <Pen className="size-4" />
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader className="px-1">
          <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        {children}
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default EditDialog;
