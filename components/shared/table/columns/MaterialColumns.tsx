"use client";

import MaterialForm, {
  useMaterialForm,
} from "@/app/(root)/materials/components/MaterialForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { imagePlaceholder } from "@/constants";
import { FormModeEnum, UserRoleEnum } from "@/enums";
import { getClassifications } from "@/lib/actions/classification.actions";
import { getProjectByMaterial } from "@/lib/actions/project.actions";
import { hasPermission } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { Material } from "@/types/material";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink, Eye } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "../../ResponsiveDialog";
import DialogFormButton from "../../buttons/DialogFormButton";
import EditDialog from "../../dialogs/EditDialog";
import { createColumnConfig } from "../column.config";
import { DataTableColumnHeader } from "../data-table-column-header";
import { getMaterialTypes } from "@/lib/actions/material.classifcations.actions";

export const visibleMaterialColumns = (userRole: UserRoleEnum[]) => {
  return createColumnConfig({
    desktop: {
      thumbnail: true,
      agency: true,
      name: true,
      code: true,
      product: true,
      type: true,
      stock: true,
      status: true,
      area: true,
      brand: true,
      created_at: true,
      actions: hasPermission(userRole, [
        UserRoleEnum.ADMIN,
        UserRoleEnum.LOGISTICS_TEAM_MEMBER,
      ]),
    },
    mobile: {
      thumbnail: true,
      agency: true,
      name: true,
      code: true,
      product: true,
      type: true,
      stock: true,
      status: true,
      area: true,
      brand: true,
      created_at: true,
      actions: hasPermission(userRole, [
        UserRoleEnum.ADMIN,
        UserRoleEnum.LOGISTICS_TEAM_MEMBER,
      ]),
    },
  });
};

const MaterialActionsCell = React.memo(
  ({ material }: { material: Material }) => {
    const [openDialog, setOpenDialog] = useState(false);

    const { form, onSubmit } = useMaterialForm({
      material,
      mode: FormModeEnum.EDIT,
    });

    const { data } = useQuery({
      queryKey: ["edit-material", material.id],
      queryFn: async () => {
        const materialTypes = await getMaterialTypes();
        const brands = await getClassifications("product_brand");
        return { materialTypes, brands };
      },
    });

    return (
      <div className="flex items-center gap-2">
        <EditDialog
          key={`edit-dialog-${material.id}`}
          title="Edit Material"
          open={openDialog}
          setOpen={setOpenDialog}
        >
          <MaterialForm
            key={`form-${material.id}`}
            form={form}
            mode={FormModeEnum.EDIT}
            materialTypes={data?.materialTypes ?? []}
            brands={data?.brands ?? []}
          />
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
                  onSubmit(values, setOpenDialog),
                )}
                disabled={form.formState.isSubmitting}
                loading={form.formState.isSubmitting}
              >
                Save Changes
              </DialogFormButton>
            </div>
          </ResponsiveDialogFooter>
        </EditDialog>
      </div>
    );
  },
);

export const MaterialColumns: ColumnDef<Material>[] = [
  {
    accessorKey: "thumbnail",
    header: () => (
      <div className="w-[1rem]">
        <span className="sr-only">Image</span>
      </div>
    ),
    cell: ({ row }) => {
      return (
        <Image
          alt="Material image"
          priority
          className="aspect-square rounded-md object-cover"
          height={64}
          width={64}
          src={
            row.getValue("thumbnail")
              ? row.getValue("thumbnail")
              : imagePlaceholder
          }
        />
      );
    },
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "agency",
    header: "Agency",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "brand",
    header: "Brand",
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="py-1 rounded-md [&>svg]:size-3.5">
          {row.original.brand.name}
        </Badge>
      );
    },
  },
  {
    accessorKey: "type",
    accessorFn: (row) => row.type.name,
    header: "Type",
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="py-1 rounded-md [&>svg]:size-3.5">
          {row.original.type.name}
        </Badge>
      );
    },
  },
  { accessorKey: "stock", header: "Stock" },
  {
    accessorKey: "area",
    header: "Area",
    cell: ({ row }) => {
      const [openDialog, setOpenDialog] = useState(false);

      return (
        <ResponsiveDialog open={openDialog} setOpen={setOpenDialog}>
          <ResponsiveDialogTrigger>
            <Button variant={"outline"} size={"icon"}>
              <ExternalLink className="size-4" />
            </Button>
          </ResponsiveDialogTrigger>
          <ResponsiveDialogContent className="md:max-w-md">
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle>Area</ResponsiveDialogTitle>
            </ResponsiveDialogHeader>
            <span className="font-medium text-sm">
              {row.original.area ?? "No area found."}
            </span>
          </ResponsiveDialogContent>
        </ResponsiveDialog>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const material = row.original;
      const [openDialog, setOpenDialog] = useState(false);
      const { data: project } = useQuery({
        queryKey: ["fetch-project-by-material", row.id],
        queryFn: async () => await getProjectByMaterial(material.name),
        select: (response) => response.data,
      });
      const productsInProject = [
        ...new Map(
          project?.products.map((projectProduct) => [
            projectProduct.product.brand.name,
            projectProduct,
          ]),
        ).values(),
      ];

      // TODO: make the status from material conditionally render the
      // material issue
      // - add a resolve issue button that will resolve the selected
      // issue
      // - only allow 1 issue at a time

      return (
        <ResponsiveDialog open={openDialog} setOpen={setOpenDialog}>
          <ResponsiveDialogTrigger>
            <Button variant={"outline"}>
              <Eye className="size-4 mr-2" /> View
            </Button>
          </ResponsiveDialogTrigger>
          <ResponsiveDialogContent className="md:max-w-md">
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle>Material Status</ResponsiveDialogTitle>
            </ResponsiveDialogHeader>
            <div className="grid gap-3 text-sm">
              <Separator className="my-1" />
              <div className="flex items-center justify-between">
                <Badge variant={"outline"} className="rounded-md">
                  Available Stock
                </Badge>
                <dd>{material.stock} QTY</dd>
              </div>
              <Separator className="my-1" />
              <span>Assigned Project</span>
              <div className="space-y-2 bg-muted border p-4 rounded-md">
                {project ? (
                  <React.Fragment>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">In Use:</dt>
                      <dd>
                        {project.materials.find(
                          (projectMaterial) =>
                            projectMaterial.material.name === material.name,
                        )?.quantity || 0}{" "}
                        QTY
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Project Name:</dt>
                      <dd>{project.name}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">
                        BA Reference Number:
                      </dt>
                      <dd>{project.ba_reference_number}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Brands:</dt>
                      <dd>
                        {productsInProject
                          .map(
                            (projectProduct) =>
                              projectProduct.product.brand.name,
                          )
                          .join(", ")}
                      </dd>
                    </div>
                  </React.Fragment>
                ) : (
                  <span className="text-xs">No Project Found.</span>
                )}
              </div>
              <Separator className="my-1" />
              <span>Material Issue</span>
              <div className="space-y-2 bg-muted border p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Damaged: </dt>
                  <dd>Some qty</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">For Repair: </dt>
                  <dd>Some qty</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Lost: </dt>
                  <dd>Some qty</dd>
                </div>
              </div>
            </div>
          </ResponsiveDialogContent>
        </ResponsiveDialog>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <div className="hidden md:table-cell">
        <DataTableColumnHeader column={column} title="Created" />
      </div>
    ),
    cell: ({ row }) => {
      const dateString = row.getValue("created_at");
      return (
        <div className="hidden md:table-cell">{formatDateTime(dateString)}</div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <MaterialActionsCell
        key={`actions-${row.original.id}`}
        material={row.original}
      />
    ),
  },
];
