"use client";

import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/shared/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ListFilter } from "lucide-react";

type Props = {
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const FilterDialog = ({ children, open, setOpen }: Props) => {
  return (
    <ResponsiveDialog open={open} setOpen={setOpen}>
      <ResponsiveDialogTrigger>
        <Button variant="outline" size="default" className="gap-1">
          <ListFilter className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Filter
          </span>
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="px-0">
        <ResponsiveDialogHeader className="px-4">
          <ResponsiveDialogTitle>Filters</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <Separator />
        {children}
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default FilterDialog;
