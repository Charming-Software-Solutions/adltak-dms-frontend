"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
  className?: string;
};

const EditDialog = ({ title, children, open, setOpen, className }: Props) => {
  return (
    <ResponsiveDialog open={open} setOpen={setOpen}>
      <ResponsiveDialogTrigger>
        <Button size={"icon"} variant={"outline"}>
          <Pen className="size-4" />
        </Button>
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
