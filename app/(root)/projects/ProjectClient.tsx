"use client";

import DialogFormButton from "@/components/shared/buttons/DialogFormButton";
import Header from "@/components/shared/Header";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/shared/ResponsiveDialog";
import {
  ProjectColumns,
  visibleProjectColumns,
} from "@/components/shared/table/columns/ProjectColumns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormModeEnum, UserRoleEnum } from "@/enums";
import { useDataTable } from "@/hooks/use-datatable";
import { hasPermission } from "@/lib/auth";
import { useProjectProductStore } from "@/lib/store";
import { Brand, Product } from "@/types/product";
import { Project } from "@/types/project";
import { User } from "@/types/user";
import { AlertCircleIcon, FileIcon, PlusCircle } from "lucide-react";
import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import ProjectAddProduct from "./components/ProjectAddProduct";
import ProjectForm, { useProjectForm } from "./components/ProjectForm";

type Props = {
  user: User;
  employee: string;
  projects: Project[];
  products: Product[];
  brands: Brand[];
};

const ProjectClient = ({ user, employee, projects, products }: Props) => {
  const [openDistributionDialog, setOpenDistributionDialog] = useState(false);

  const { form, onSubmit } = useProjectForm({
    mode: FormModeEnum.CREATE,
    employee: employee,
  });
  const isDesktop = useMediaQuery({ query: "(min-width: 1224px)" });
  const { items, clearItems } = useProjectProductStore();

  const dataTable = useDataTable({
    columns: ProjectColumns(user.roles),
    data: projects,
    visibleColumns: isDesktop
      ? visibleProjectColumns(user.roles).desktop
      : visibleProjectColumns(user.roles).mobile,
    leftTools: {
      searchField: {
        column: "name",
        placeholder: "Search by project name...",
      },
    },
  });

  return (
    <React.Fragment>
      <Header>
        <div className="flex items-center justify-end gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <FileIcon className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          {hasPermission(user.roles, [
            UserRoleEnum.ADMIN,
            UserRoleEnum.LOGISTICS_TEAM_MEMBER,
          ]) && (
            <ResponsiveDialog
              open={openDistributionDialog}
              setOpen={(value) => {
                setOpenDistributionDialog(value);
                if (!value) {
                  clearItems();
                }
              }}
            >
              <ResponsiveDialogTrigger>
                <Button className="h-8">
                  <PlusCircle className="mr-9 md:mr-2 size-4" />
                  <span className="hidden sm:inline">Create Project</span>
                </Button>
              </ResponsiveDialogTrigger>
              <ResponsiveDialogContent className="max-w-xl">
                <ResponsiveDialogHeader>
                  <ResponsiveDialogTitle>Create Project</ResponsiveDialogTitle>
                </ResponsiveDialogHeader>
                <div className="space-y-2 px-4 md:px-0">
                  <Tabs defaultValue="details">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="products">Products</TabsTrigger>
                    </TabsList>
                    <TabsContent value="details" className="space-y-2.5">
                      <Alert>
                        <AlertCircleIcon className="size-4" />
                        <AlertDescription>
                          The Products tab will enable once the details have
                          been filled up.
                        </AlertDescription>
                      </Alert>
                      <Card className="p-4">
                        <ProjectForm form={form} />
                      </Card>
                    </TabsContent>
                    <TabsContent value="products" className="space-y-2.5">
                      <Alert>
                        <AlertCircleIcon className="size-4" />
                        <AlertDescription>
                          This will be the incoming products for this specific
                          project.
                        </AlertDescription>
                      </Alert>
                      <Card className="p-4">
                        <ProjectAddProduct
                          products={products.filter(
                            (product) => !product.discontinued,
                          )}
                        />
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
                <ResponsiveDialogFooter>
                  <div className="flex flex-row w-full gap-2">
                    <Button
                      variant={"outline"}
                      className="flex-grow w-full"
                      onClick={() => {
                        form.reset();
                        clearItems();
                      }}
                    >
                      Reset
                    </Button>
                    <DialogFormButton
                      className="select-none"
                      onClick={form.handleSubmit((values) =>
                        onSubmit(values, setOpenDistributionDialog),
                      )}
                      disabled={
                        // disabled only when form is not valid, isSubmitting, or
                        // product list is empty
                        !form.formState.isValid ||
                        form.formState.isSubmitting ||
                        items.length === 0
                      }
                      loading={form.formState.isSubmitting}
                    >
                      Create Project
                    </DialogFormButton>
                  </div>
                </ResponsiveDialogFooter>
              </ResponsiveDialogContent>
            </ResponsiveDialog>
          )}
        </div>
      </Header>
      <main className="grid flex-1 items-start p-4 lg:px-6 h-[200px]">
        <div className="space-y-2">{dataTable.render()}</div>
      </main>
    </React.Fragment>
  );
};

export default ProjectClient;
