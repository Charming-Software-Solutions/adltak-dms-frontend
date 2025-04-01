"use client";

import { Button } from "@/components/ui/button";
import { Project } from "@/types/project";
import { Eye } from "lucide-react";
import { useState } from "react";
import ItemCard from "../card/ItemCard";

import { CopyButton } from "@/components/ui/copy-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserRoleEnum } from "@/enums";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "../ResponsiveDialog";

type Props = {
  userRoles: UserRoleEnum[];
  project: Project;
  isProjectsPage?: boolean;
};

const ViewItemsDialog = ({
  userRoles,
  project,
  isProjectsPage = false,
}: Props) => {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <ResponsiveDialog open={openDialog} setOpen={setOpenDialog}>
      <ResponsiveDialogTrigger>
        <Button variant={"outline"}>
          <Eye className="size-4 mr-2" /> View
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Products in Project</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            <span className="flex items-center space-x-2 w-full">
              <span className="font-semibold text-foreground">
                BA Reference Number:
              </span>
              <span className="inline-flex items-center space-x-1">
                <span className="font-normal text-muted-foreground">
                  {project.ba_reference_number}
                </span>
                <CopyButton value={project.ba_reference_number} />
              </span>
            </span>
            <span className="flex items-center space-x-2 w-full">
              <span className="font-semibold text-foreground">
                Project Name:
              </span>
              <span className="inline-flex items-center space-x-1">
                <span className="font-normal text-muted-foreground">
                  {project.name}
                </span>
                <CopyButton value={project.name} />
              </span>
            </span>
            <span className="flex items-center space-x-2 w-full">
              <span className="font-semibold text-foreground">
                Total Products:
              </span>
              <span className="inline-flex items-center space-x-1">
                <span className="font-normal text-muted-foreground">
                  {project.products.length}
                </span>
              </span>
            </span>
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <ScrollArea className="h-72 border bg-muted p-4 rounded-md">
          <div className="flex flex-col gap-2">
            {project.products.map((item, index) => {
              return (
                <ItemCard
                  userRoles={userRoles}
                  key={index}
                  projectStatus={project.status}
                  projectProduct={item}
                  isProjectsPage={isProjectsPage}
                />
              );
            })}
          </div>
        </ScrollArea>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default ViewItemsDialog;
