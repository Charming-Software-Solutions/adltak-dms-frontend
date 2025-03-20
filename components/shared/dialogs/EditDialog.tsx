"use client";

import { cn } from "@/lib/utils";
import { Pen } from "lucide-react";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "../ResponsiveDialog";
import IconButton from "../buttons/IconButton";

type Props = {
  title: string;
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
};

const EditDialog = ({ title, children, open, setOpen, className }: Props) => {
  return (
    <ResponsiveDialog open={open} setOpen={setOpen}>
      <ResponsiveDialogTrigger>
        <IconButton tooltip="Edit">
          <Pen className="size-4" />
        </IconButton>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent className={className}>
        <ResponsiveDialogHeader className={(cn("px-1"), className)}>
          <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        {children}
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default EditDialog;
