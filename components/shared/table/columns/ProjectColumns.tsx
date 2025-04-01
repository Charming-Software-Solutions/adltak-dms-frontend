"use client";

import ProjectForm, {
  useProjectForm,
} from "@/app/(root)/projects/components/ProjectForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { PROJECT_STATUSES } from "@/constants";
import { FormModeEnum, ProjectStatusEnum, UserRoleEnum } from "@/enums";
import {
  deleteProject,
  updateProjectStatus,
} from "@/lib/actions/project.actions";
import { hasPermission } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { Project } from "@/types/project";
import { BackpackIcon, PersonIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import DialogFormButton from "../../buttons/DialogFormButton";
import DeleteDialog from "../../dialogs/DeleteDialog";
import EditDialog from "../../dialogs/EditDialog";
import ViewItemsDialog from "../../dialogs/ViewItemsDialog";
import { ResponsiveDialogFooter } from "../../ResponsiveDialog";
import StatusDropdown from "../../StatusDropDown";
import { DataTableColumnHeader } from "../data-table-column-header";

export const visibleProjectColumns = (userRoles: UserRoleEnum[]) => ({
  desktop: {
    name: true,
    ba_reference_number: true,
    status: true,
    client: true,
    products: true,
    logistics_person: true,
    created_at: true,
    actions: hasPermission(userRoles, [
      UserRoleEnum.ADMIN,
      UserRoleEnum.LOGISTICS_TEAM_MEMBER,
    ]),
  },
  mobile: {
    name: true,
    ba_reference_number: true,
    status: true,
    client: true,
    products: true,
    logistics_person: true,
    created_at: true,
    actions: hasPermission(userRoles, [
      UserRoleEnum.ADMIN,
      UserRoleEnum.LOGISTICS_TEAM_MEMBER,
    ]),
  },
});

const ProjectActionsCell = React.memo(({ project }: { project: Project }) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { form, onSubmit } = useProjectForm({
    project,
    mode: FormModeEnum.EDIT,
  });

  return (
    <div className="flex items-center gap-2">
      <EditDialog
        title="Edit Project"
        open={openEditDialog}
        setOpen={setOpenEditDialog}
      >
        <ProjectForm form={form} mode={FormModeEnum.EDIT} />
        <ResponsiveDialogFooter className="px-1">
          <div className="dialog-footer">
            <Button
              variant={"outline"}
              className="flex-grow w-full"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <DialogFormButton
              onClick={form.handleSubmit((values) =>
                onSubmit(values, setOpenEditDialog),
              )}
              disabled={form.formState.isSubmitting}
              loading={form.formState.isSubmitting}
            >
              Save Changes
            </DialogFormButton>
          </div>
        </ResponsiveDialogFooter>
      </EditDialog>
      <DeleteDialog
        title="Delete Project"
        deleteAction={async () => await deleteProject(project.id)}
        placeholder="Are you sure you want to delete the project?"
      />
    </div>
  );
});

export const ProjectColumns = (
  userRoles: UserRoleEnum[],
  isInsightsPage = false,
): ColumnDef<Project>[] => {
  // Define the basic columns array
  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "ba_reference_number",
      header: "BA Ref Number",
      cell: ({ row }) => {
        return (
          <span className="inline-flex items-center space-x-1">
            <CopyButton
              value={row.original.ba_reference_number ?? "UNDEFINED"}
            />
            <span className="font-normal text-muted-foreground">
              {row.original.ba_reference_number}
            </span>
          </span>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "products",
      header: "Products",
      cell: ({ row }) => {
        const project = row.original;

        return (
          <ViewItemsDialog
            userRoles={userRoles}
            projectStatus={project.status}
            baReferenceNumber={project.ba_reference_number}
            items={{
              products: project.products,
            }}
          />
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const router = useRouter();

        return (
          <StatusDropdown
            id={row.original.id}
            mutationKey="update-project-status"
            currentStatus={status}
            statuses={PROJECT_STATUSES}
            mutationFn={updateProjectStatus}
            onSuccess={() => router.refresh()}
            disabled={status === ProjectStatusEnum.LOCKED || isInsightsPage}
          />
        );
      },
    },
    {
      accessorKey: "client",
      header: "Client",
      cell: ({ row }) => {
        return (
          <Badge variant="outline" className="py-1 rounded-md [&>svg]:size-3.5">
            <BackpackIcon className="mr-2" />
            <span>{row.original.client}</span>
          </Badge>
        );
      },
    },
    {
      accessorKey: "logistics_person",
      header: "Logistics Team Member",
      cell: ({ row }) => {
        return (
          <Badge variant="outline" className="py-1 rounded-md [&>svg]:size-3.5">
            <PersonIcon className="mr-2" />
            <span>{row.original.employee}</span>
          </Badge>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <div className="hidden md:table-cell">
          <DataTableColumnHeader column={column} title="Date" />
        </div>
      ),
      cell: ({ row }) => {
        const dateString = row.getValue("created_at");
        return (
          <div className="hidden md:table-cell">
            {formatDateTime(dateString)}
          </div>
        );
      },
    },
  ];

  // Only render when not insights page
  if (
    !isInsightsPage &&
    hasPermission(userRoles, [
      UserRoleEnum.ADMIN,
      UserRoleEnum.LOGISTICS_TEAM_MEMBER,
    ])
  ) {
    columns.push({
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <ProjectActionsCell
          key={`actions-${row.original.id}`}
          project={row.original}
        />
      ),
    });
  }

  return columns;
};
