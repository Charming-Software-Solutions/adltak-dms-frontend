"use client";

import MaterialForm, {
  useMaterialForm,
} from "@/app/(root)/materials/components/MaterialForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { imagePlaceholder, MATERIAL_STATUS } from "@/constants";
import {
  FormModeEnum,
  MaterialIssueEnum,
  MaterialStatusEnum,
  UserRoleEnum,
} from "@/enums";
import { getClassifications } from "@/lib/actions/classification.actions";
import {
  getMaterialById,
  updateMaterialIssue,
} from "@/lib/actions/material.actions";
import { getMaterialTypes } from "@/lib/actions/material.classifcations.actions";
import { getProjectByMaterial } from "@/lib/actions/project.actions";
import { hasPermission } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { Material } from "@/types/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import {
  AlertCircleIcon,
  BadgeX,
  Ban,
  ExternalLink,
  Eye,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import QuantityAdjuster from "../../QuantityAdjuster";
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
import { DataTableColumnHeader } from "../data-table-column-header";

export const visibleMaterialColumns = (userRole: UserRoleEnum[]) => {
  return {
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
  };
};

type MaterialIssueRowProps = {
  materialId: string;
  issueType: string;
  issueData: any;
  currentIssueQuantity: number;
  remainingStock: number;
  IconComponent?: React.ComponentType<{ className?: string }>;
};

const MaterialIssueRow = ({
  materialId,
  issueType,
  issueData,
  currentIssueQuantity,
  remainingStock,
  IconComponent,
}: MaterialIssueRowProps) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-material-issue", issueType],
    mutationFn: updateMaterialIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-updated-material", materialId],
      });
    },
  });

  return (
    <Card key={issueType} className="flex items-center justify-between p-3">
      <dt className="flex items-center gap-2">
        {IconComponent && <IconComponent className="h-4 w-4" />}
        <span>{issueType}</span>
      </dt>
      <dd>
        <QuantityAdjuster
          value={currentIssueQuantity}
          onChange={(newQuantity) => {
            mutate({
              id: materialId,
              issues_data: {
                [issueType]: {
                  ...issueData,
                  quantity: newQuantity,
                },
              },
            });
          }}
          inputProps={{ disabled: isPending }}
          minMax={{
            min: 1,
            disabled: isPending,
            minDisabled: remainingStock === 0,
            maxDisabled: currentIssueQuantity >= remainingStock,
            max: remainingStock,
            onMaxClick: () => {
              mutate({
                id: materialId,
                issues_data: {
                  [issueType]: {
                    ...issueData,
                    quantity: remainingStock,
                  },
                },
              });
            },
            onMinClick: () => {
              mutate({
                id: materialId,
                issues_data: {
                  [issueType]: {
                    ...issueData,
                    quantity: 1,
                  },
                },
              });
            },
          }}
          stepButtons={{
            decrementDisabled: currentIssueQuantity <= 0 || isPending,
            incrementDisabled: remainingStock === 0 || isPending,
            onDecrementClick: () => {
              mutate({
                id: materialId,
                issues_data: {
                  [issueType]: {
                    ...issueData,
                    quantity: currentIssueQuantity - 1,
                  },
                },
              });
            },
            onIncrementClick: () => {
              mutate({
                id: materialId,
                issues_data: {
                  [issueType]: {
                    ...issueData,
                    quantity: currentIssueQuantity + 1,
                  },
                },
              });
            },
          }}
          loading={isPending}
        />
      </dd>
    </Card>
  );
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
      const { data: updatedMaterial } = useQuery({
        queryKey: ["get-updated-material", material.id],
        queryFn: () => getMaterialById(material.id),
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

      const totalIssuesQuantity = Object.values(
        updatedMaterial?.issues || {},
      ).reduce((sum, issue) => sum + (issue.quantity || 0), 0);

      const remainingStock = material.stock - totalIssuesQuantity;

      // Define your icon mapping as before
      const MATERIAL_ISSUE_ICONS = {
        [MaterialIssueEnum.DAMAGED]: Ban,
        [MaterialIssueEnum.FOR_REPAIR]: Wrench,
        [MaterialIssueEnum.LOST]: BadgeX,
      };

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
            <div className="-mx-6 max-h-[37rem] overflow-y-auto px-6 text-sm flex flex-col gap-2">
              <Separator className="my-1" />
              <span>Material Details</span>
              <div className="space-y-2 bg-muted border p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Material Name</dt>
                  <dd>{material.name}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Material Code</dt>
                  <dd>{material.code}</dd>
                </div>
              </div>
              <Separator className="my-1" />
              <span>Material Inventory Status</span>
              <div className="space-y-2 bg-muted border p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Available Stock:</dt>
                  <dd>{remainingStock} QTY</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Current Status:</dt>
                  <dd>{MATERIAL_STATUS[material.status]}</dd>
                </div>
              </div>
              <Separator className="my-1" />
              <span>Assigned Project</span>
              <div className="space-y-2 bg-muted border p-4 rounded-md">
                {project ? (
                  <>
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
                  </>
                ) : (
                  <span className="text-xs">No Project Found.</span>
                )}
              </div>
              <Separator className="my-1" />
              <span>Material Issue</span>
              <div className="space-y-2">
                {material.status === MaterialStatusEnum.AVAILABLE ? (
                  <>
                    <Alert className="bg-muted">
                      <AlertCircleIcon className="size-4" />
                      <AlertDescription>
                        Adding or removing items here directly affects available
                        stock.
                      </AlertDescription>
                    </Alert>
                    {Object.entries(material.issues).map(
                      ([issueType, issueData]) => {
                        const issueEnum = issueType as MaterialIssueEnum;
                        const IconComponent = MATERIAL_ISSUE_ICONS[issueEnum];
                        const currentIssueQuantity =
                          updatedMaterial?.issues[issueEnum]?.quantity ??
                          issueData.quantity;

                        return (
                          <MaterialIssueRow
                            key={issueType}
                            materialId={material.id}
                            issueType={issueType}
                            issueData={issueData}
                            currentIssueQuantity={currentIssueQuantity}
                            remainingStock={remainingStock}
                            IconComponent={IconComponent}
                          />
                        );
                      },
                    )}
                  </>
                ) : (
                  <div className="space-y-2 bg-muted border p-4 rounded-md text-center text-muted-foreground">
                    Material issue management is only available for materials
                    with "Available" status.
                  </div>
                )}
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
