"use client";

import { Button } from "@/components/ui/button";
import { Project } from "@/types/project";
import { Eye } from "lucide-react";
import { useState } from "react";
import ItemCard from "../card/ItemCard";

import { CopyButton } from "@/components/ui/copy-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItemTypeEnum, UserRoleEnum } from "@/enums";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
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
      <ResponsiveDialogContent className="max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Items in Project</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <div className="grid gap-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Project Name</dt>
            <div className="flex items-center">
              {project.name}
              <CopyButton className="ml-1" value={project.name} />
            </div>
          </div>
          <Separator className="my-1" />
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">BA Reference Number</dt>
            <div className="flex items-center">
              {project.ba_reference_number}{" "}
              <CopyButton
                className="ml-1"
                value={project.ba_reference_number}
              />
            </div>
          </div>
          <Separator className="my-1" />
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Total Products</dt>
            <dd>{project.products.length} QTY</dd>
          </div>
          <Separator className="my-1" />
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Total Materials</dt>
            <dd>{project.materials.length} QTY</dd>
          </div>
        </div>
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
          </TabsList>
          <TabsContent value="products">
            <ScrollArea className="h-72 border bg-muted p-4 rounded-md">
              <div className="flex flex-col gap-2 h-full">
                {project.products.length > 0 ? (
                  project.products.map((projectProduct, index) => (
                    <ItemCard
                      key={index}
                      itemType={ItemTypeEnum.PRODUCT}
                      userRoles={userRoles}
                      projectStatus={project.status}
                      projectItem={projectProduct}
                      isProjectsPage={isProjectsPage}
                    />
                  ))
                ) : (
                  <div className="flex flex-1 items-center justify-center">
                    <span className="text-center">No Products.</span>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="materials">
            <ScrollArea className="h-72 border bg-muted p-4 rounded-md">
              <div className="flex flex-col gap-2 h-full">
                {project.materials.length > 0 ? (
                  project.materials.map((projectMaterial, index) => (
                    <ItemCard
                      key={index}
                      itemType={ItemTypeEnum.MATERIAL}
                      projectItem={projectMaterial}
                      userRoles={userRoles}
                      projectStatus={project.status}
                      isProjectsPage={isProjectsPage}
                    />
                  ))
                ) : (
                  <div className="flex flex-1 items-center justify-center">
                    <span className="text-center">No Materials.</span>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default ViewItemsDialog;
