"use client";

import ProductForm, {
  useProductForm,
} from "@/app/(root)/products/components/ProductForm";
import ProductRemainingCard from "@/app/(root)/products/components/ProductRemainingcard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  imagePlaceholder,
  INCOMING_PRODUCTS_STATUS,
  PROJECT_STATUSES,
} from "@/constants";
import {
  FormModeEnum,
  IncomingProductsStatus,
  ItemTypeEnum,
  ProjectStatusEnum,
  UserRoleEnum,
} from "@/enums";
import { useDialog } from "@/hooks";
import {
  getBrands,
  getCategories,
  getTypes,
} from "@/lib/actions/product.classications.actions";
import {
  getProjectsByProduct,
  updateProjectIncomingProductsStatus,
  updateProjectItemQuantity,
} from "@/lib/actions/project.actions";
import { hasPermission } from "@/lib/auth";
import { formatDateTime, formatExpiration } from "@/lib/utils";
import { Product } from "@/types/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import DialogFormButton from "../../buttons/DialogFormButton";
import EditDialog from "../../dialogs/EditDialog";
import QuantityAdjuster from "../../QuantityAdjuster";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "../../ResponsiveDialog";
import StatusDropdown from "../../StatusDropDown";

function useFetchProjectsByProduct(productName: string, rowId: string) {
  return useQuery({
    queryKey: ["get-projects-by-product", rowId],
    queryFn: async () => await getProjectsByProduct(productName),
  });
}

export const visibleProductColumns = (userRoles: UserRoleEnum[]) => {
  return {
    thumbnail: true,
    name: true,
    project: true,
    sku: true,
    classifications: true,
    incoming_products: true,
    remaining_products: true,
    stock: true,
    area: true,
    actions: hasPermission(userRoles, [
      UserRoleEnum.ADMIN,
      UserRoleEnum.LOGISTICS_TEAM_MEMBER,
    ]),
  };
};

const ProductActionsCell = React.memo(
  ({ product, userRoles }: { product: Product; userRoles: UserRoleEnum[] }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const { form, onSubmit } = useProductForm({
      product,
      mode: FormModeEnum.EDIT,
    });

    const { data } = useQuery({
      queryKey: ["edit-product"],
      queryFn: async () => {
        const [brands, categories, productTypes] = await Promise.all([
          getBrands(),
          getCategories(),
          getTypes(),
        ]);
        return { brands, categories, productTypes };
      },
    });

    return (
      <div className="flex items-center gap-2">
        <EditDialog
          title="Edit Product"
          open={openDialog}
          setOpen={setOpenDialog}
        >
          <ProductForm
            form={form}
            userRoles={userRoles}
            className="px-4 md:px-1 pb-4"
            brands={data?.brands ?? []}
            categories={data?.categories ?? []}
            types={data?.productTypes ?? []}
            mode={FormModeEnum.EDIT}
          />
          <ResponsiveDialogFooter className="px-1">
            <div className="flex flex-row w-full gap-2">
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
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
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

export const ProductColumns = (
  userRoles: UserRoleEnum[],
): ColumnDef<Product>[] => [
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
          alt="Product image"
          priority
          className="aspect-square rounded-md object-cover"
          height={58}
          width={58}
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
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "project",
    header: "Project",
    cell: ({ row }) => {
      const product = row.original;
      const { data } = useFetchProjectsByProduct(product.name, row.id);
      const [openDialog, setOpenDialog] = useState(false);

      return (
        <ResponsiveDialog open={openDialog} setOpen={setOpenDialog}>
          <ResponsiveDialogTrigger>
            <Button variant={"outline"}>
              <Eye className="size-4 mr-2" /> View
            </Button>
          </ResponsiveDialogTrigger>
          <ResponsiveDialogContent className="gap-0">
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle>
                Assigned Projects Details
              </ResponsiveDialogTitle>
              <ResponsiveDialogDescription>
                The projects that are assigned under this product.
              </ResponsiveDialogDescription>
            </ResponsiveDialogHeader>
            <div className="flex flex-col space-y-2">
              <Accordion
                type="single"
                collapsible
                defaultValue={data && data.length > 0 ? data[0].id : ""}
              >
                {data && data.length > 0 ? (
                  data.map((project, index) => (
                    <AccordionItem value={project.id} key={index}>
                      <AccordionTrigger>{project.name}</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-3 text-sm">
                          <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">
                              BA Reference Number
                            </dt>
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
                            <dt className="text-muted-foreground">Status</dt>
                            <dd>{PROJECT_STATUSES[project.status]}</dd>
                          </div>
                          <Separator className="my-1" />
                          <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">Client</dt>
                            <dd>{project.client}</dd>
                          </div>
                          <Separator className="my-1" />
                          <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">
                              Date Created
                            </dt>
                            <dd>{formatDateTime(project.created_at)}</dd>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))
                ) : (
                  <span>No projects found</span>
                )}
              </Accordion>
            </div>
          </ResponsiveDialogContent>
        </ResponsiveDialog>
      );
    },
  },
  {
    accessorKey: "classifications",
    header: "Classifications",
    cell: ({ row }) => {
      const [openDialog, setOpenDialog] = useState(false);
      const product = row.original;

      return (
        <ResponsiveDialog open={openDialog} setOpen={setOpenDialog}>
          <ResponsiveDialogTrigger>
            <Button variant={"outline"}>
              <Eye className="size-4 mr-2" /> View
            </Button>
          </ResponsiveDialogTrigger>
          <ResponsiveDialogContent className="md:max-w-[25rem]">
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle>Classifications</ResponsiveDialogTitle>
            </ResponsiveDialogHeader>
            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Brand</dt>
                <dd>{product.brand.name}</dd>
              </div>
              <Separator className="my-1" />
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Category</dt>
                <dd>{product.category.name}</dd>
              </div>
              <Separator className="my-1" />
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Type</dt>
                <dd>{product.type.name}</dd>
              </div>
            </div>
          </ResponsiveDialogContent>
        </ResponsiveDialog>
      );
    },
  },
  {
    accessorKey: "incoming_products",
    header: "Incoming",
    cell: ({ row }) => {
      const product = row.original;
      const { data } = useFetchProjectsByProduct(product.name, row.id);
      const { openDialog, setOpenDialog } = useDialog();

      const queryClient = useQueryClient();
      const router = useRouter();

      const { mutate } = useMutation({
        mutationKey: ["update-project-product-quantity"],
        mutationFn: updateProjectItemQuantity,
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["get-projects-by-product", row.id],
          });
        },
      });

      return (
        <ResponsiveDialog open={openDialog} setOpen={setOpenDialog}>
          <ResponsiveDialogTrigger>
            <Button variant={"outline"}>
              <Eye className="size-4 mr-2" /> View
            </Button>
          </ResponsiveDialogTrigger>
          <ResponsiveDialogContent className="gap-0">
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle>
                Incoming Products per Project
              </ResponsiveDialogTitle>
              <ResponsiveDialogDescription>
                The products incoming within a project.
              </ResponsiveDialogDescription>
            </ResponsiveDialogHeader>

            <Accordion
              type="single"
              collapsible
              className="mb-0"
              defaultValue={data && data.length > 0 ? data[0].name : ""}
            >
              {data?.length === 0 ? (
                <span>No projects found</span>
              ) : (
                data?.map((project) => (
                  <AccordionItem value={project.name} key={project.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center space-x-2">
                        <p className="hover:underline">{project.name}</p>
                        <Badge variant={"outline"}>
                          {project.products.length} products
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <Card className="bg-muted">
                        <CardContent className="p-2">
                          <div className="flex items-center justify-between">
                            <Badge
                              variant={"outline"}
                              className="py-2 rounded-md bg-card"
                            >
                              Incoming Products Status
                            </Badge>
                            <StatusDropdown
                              id={project.id}
                              mutationKey="update-project-incoming-products-status"
                              currentStatus={project.incoming_products_status}
                              statuses={INCOMING_PRODUCTS_STATUS}
                              mutationFn={updateProjectIncomingProductsStatus}
                              onSuccess={() => {
                                queryClient.invalidateQueries({
                                  queryKey: ["get-projects-by-product", row.id],
                                });
                                router.refresh();
                              }}
                              disabled={
                                project.incoming_products_status ===
                                  IncomingProductsStatus.RECEIVED ||
                                !hasPermission(userRoles, [
                                  UserRoleEnum.WAREHOUSE_PERSONNEL,
                                  UserRoleEnum.LOGISTICS_TEAM_MEMBER,
                                  UserRoleEnum.ADMIN,
                                ])
                              }
                            />
                          </div>
                        </CardContent>
                      </Card>
                      <ScrollArea className="h-56 border bg-muted p-4 rounded-md">
                        <div className="space-y-2">
                          {project.products.map((projectProduct) => (
                            <Card key={projectProduct.id}>
                              <CardContent className="p-4 space-y-2.5">
                                <div className="flex items-center gap-3">
                                  <Image
                                    src={
                                      projectProduct.product.thumbnail ??
                                      imagePlaceholder
                                    }
                                    alt="product-thumbnail"
                                    className="h-[3.5rem] w-auto object-contain rounded-sm"
                                    priority
                                    width={100}
                                    height={100}
                                  />
                                  <div className="grid flex-1 gap-1 text-left text-sm leading-tight">
                                    <span className="truncate max-w-[12rem] font-semibold">
                                      {projectProduct.product.name || "Unknown"}
                                    </span>
                                    <div className="flex space-x-2 items-center">
                                      <span className="truncate text-xs">
                                        {projectProduct.product.type.name ||
                                          "Unknown Type"}
                                      </span>
                                      <Separator
                                        orientation="vertical"
                                        className="h-2"
                                      />
                                      <span className="truncate text-xs">
                                        <strong>EXP: </strong>
                                        {formatExpiration(
                                          projectProduct.expiration,
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-2 w-full md:w-auto items-center">
                                  <Badge
                                    className="text-xs p-3 rounded-lg truncate items-center"
                                    variant={"outline"}
                                  >
                                    Incoming Quantity
                                  </Badge>
                                  <div className="">
                                    <QuantityAdjuster
                                      value={projectProduct.quantity}
                                      onChange={(newQuantity) =>
                                        mutate({
                                          itemType: ItemTypeEnum.PRODUCT,
                                          id: projectProduct.id,
                                          quantity: newQuantity,
                                        })
                                      }
                                      inputProps={{
                                        disabled:
                                          project.incoming_products_status ===
                                          IncomingProductsStatus.RECEIVED,
                                      }}
                                      stepButtons={{
                                        decrementDisabled:
                                          projectProduct.quantity <= 1 ||
                                          project.incoming_products_status ===
                                            IncomingProductsStatus.RECEIVED,
                                        incrementDisabled:
                                          project.incoming_products_status ===
                                          IncomingProductsStatus.RECEIVED,
                                        onDecrementClick: () =>
                                          mutate({
                                            itemType: ItemTypeEnum.PRODUCT,
                                            id: projectProduct.id,
                                            quantity:
                                              projectProduct.quantity - 1,
                                          }),
                                        onIncrementClick: () =>
                                          mutate({
                                            itemType: ItemTypeEnum.PRODUCT,
                                            id: projectProduct.id,
                                            quantity:
                                              projectProduct.quantity + 1,
                                          }),
                                      }}
                                    />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    </AccordionContent>
                  </AccordionItem>
                ))
              )}
            </Accordion>
          </ResponsiveDialogContent>
        </ResponsiveDialog>
      );
    },
  },
  {
    accessorKey: "remaining_products",
    header: "Remaining",
    cell: ({ row }) => {
      const product = row.original;
      const { data } = useFetchProjectsByProduct(product.name, row.id);
      const { openDialog, setOpenDialog } = useDialog();

      // Filter the projects to show only those with status 'concluded'
      const concludedProjects = data?.filter(
        (project) => project.status === ProjectStatusEnum.LOCKED,
      );

      return (
        <ResponsiveDialog open={openDialog} setOpen={setOpenDialog}>
          <ResponsiveDialogTrigger>
            <Button variant={"outline"}>
              <Eye className="size-4 mr-2" /> View
            </Button>
          </ResponsiveDialogTrigger>
          <ResponsiveDialogContent className="gap-0">
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle>
                Remaining Products per Locked Project
              </ResponsiveDialogTitle>
              <ResponsiveDialogDescription>
                The products remaining within a locked project.
              </ResponsiveDialogDescription>
            </ResponsiveDialogHeader>

            <Accordion
              type="single"
              collapsible
              className="mb-0"
              defaultValue={
                concludedProjects && concludedProjects.length > 0
                  ? concludedProjects[0].name
                  : ""
              }
            >
              {concludedProjects?.length === 0 ? (
                <span>No locked projects found</span>
              ) : (
                concludedProjects?.map((project, index) => (
                  <AccordionItem value={project.name} key={index}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center space-x-2">
                        <p className="hover:underline">{project.name}</p>
                        <Badge variant={"outline"}>
                          {project.products.length} products
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <ScrollArea className="h-56 border bg-muted p-4 rounded-md">
                        <div className="space-y-2">
                          {project.products.map((projectProduct, key) => (
                            <ProductRemainingCard
                              key={key}
                              projectProduct={projectProduct}
                            />
                          ))}
                        </div>
                      </ScrollArea>
                    </AccordionContent>
                  </AccordionItem>
                ))
              )}
            </Accordion>
          </ResponsiveDialogContent>
        </ResponsiveDialog>
      );
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ProductActionsCell
        userRoles={userRoles}
        key={`actions-${row.original.id}`}
        product={row.original}
      />
    ),
  },
];
