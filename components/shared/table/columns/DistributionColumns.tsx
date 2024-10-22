"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { imagePlaceholder } from "@/constants";
import { deleteDistribution } from "@/lib/actions/distribution.actions";
import { formatDateTime } from "@/lib/utils";
import { Distribution } from "@/types/distribution";
import { BackpackIcon, PersonIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import ViewItemsDialog from "../../dialogs/ViewItemsDialog";
import ResponsiveDialog from "../../ResponsiveDialog";
import { DataTableColumnHeader } from "../data-table-column-header";

export const visibleDistributionColumns = {
  desktop: {
    // thumbnail: true,
    // products: true,
    // product_name: true,
    // product_sku: true,
    // product_brand: true,
    // quantity: true,
    dist_id: true,
    product_count: true,
    asset_count: true,
    status: true,
    client: true,
    logistics_person: true,
    created_at: true,
    actions: true,
  },
  mobile: {
    dist_id: true,
    // product_count: true,
    // asset_count: true,
    // status: true,
    // client: true,
    logistics_person: true,
    // created_at: true,
    actions: true,
  },
};

export const DistributionColumns: ColumnDef<Distribution>[] = [
  {
    accessorKey: "thumbnail",
    header: () => (
      <div className="w-[1rem]">
        <span className="sr-only">Image</span>
      </div>
    ),
    cell: ({ row }) => {
      const products = row.original.products;
      return (
        <div className="flex flex-col gap-2">
          {products.map((distributionProduct, index) => (
            <Image
              key={index}
              alt="Product image"
              priority
              className="aspect-square rounded-md object-cover border p-1"
              height={40}
              width={40}
              src={
                distributionProduct.product.thumbnail
                  ? distributionProduct.product.thumbnail
                  : imagePlaceholder
              }
            />
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => {
      const products = row.original.products;
      return (
        <div className="flex flex-col gap-2">
          {products.map((item, index) => (
            <Card className="flex items-center justify-between p-1" key={index}>
              <div className="flex items-center gap-2">
                <Image
                  src={item.product.thumbnail ?? imagePlaceholder}
                  alt={"product-thumbnail"}
                  className="h-[3rem] w-auto object-contain rounded-sm"
                  priority
                  width={100}
                  height={100}
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {item.product.name}
                  </span>
                  <span className="truncate text-xs">
                    {item.product.brand.name}{" "}
                  </span>
                </div>
              </div>
              <span className="text-sm">x{item.quantity}</span>
              <span className="text-sm mr-2 font-semibold">
                {item.product.sku}
              </span>
            </Card>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "product_name",
    header: "Product/s",
    cell: ({ row }) => {
      const products = row.original.products;

      return (
        <div className="flex flex-col gap-2">
          {products.map((distributionProduct, index) => (
            <div className="flex flex-col gap-2" key={index}>
              <span>{distributionProduct.product.name}</span>
              <Badge className="flex-grow w-fit" variant={"outline"}>
                {distributionProduct.product.category.name}
              </Badge>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "product_sku",
    header: "SKU",
    cell: ({ row }) => {
      const products = row.original.products;

      return (
        <div className="flex flex-col gap-2">
          {products.map((distributionProduct, index) => (
            <span key={index}>{distributionProduct.product.sku}</span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "product_brand",
    header: "Brand",
    cell: ({ row }) => {
      const products = row.original.products;

      return (
        <div className="flex flex-col gap-2">
          {products.map((distributionProduct, index) => (
            <span key={index}>{distributionProduct.product.brand.name}</span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => {
      const products = row.original.products;

      return (
        <div className="flex flex-col gap-2">
          {products.map((distributionProduct, index) => (
            <span key={index}>{distributionProduct.quantity}</span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "dist_id",
    header: "Distribuition ID",
    cell: ({ row }) => {
      return <span>#{row.original.dist_id}</span>;
    },
  },
  {
    accessorKey: "product_count",
    header: "Products",
    cell: ({ row }) => {
      return (
        <span className="items-center">{row.original.products.length}</span>
      );
    },
  },
  {
    accessorKey: "asset_count",
    header: "Assets",
    cell: ({ row }) => {
      return <span>20</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <Badge variant={"secondary"}>{row.original.status}</Badge>;
    },
  },
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <BackpackIcon className="size-4" />
          <span>{row.original.client}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "logistics_person",
    header: "Logistics Person",
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <PersonIcon className="size-4" />
          <span>{row.original.employee}</span>
        </div>
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
        <div className="hidden md:table-cell">{formatDateTime(dateString)}</div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const distribution = row.original;
      const router = useRouter();
      const [openDialog, setOpenDialog] = useState(false);
      const [openViewItemsDialog, setOpenViewItemsDialog] = useState(false);

      const isDesktop = useMediaQuery({ query: "(min-width: 1224px)" });

      return (
        <div className="flex items-center gap-2">
          <ViewItemsDialog
            items={{
              products: distribution.products,
            }}
          />
          <ResponsiveDialog
            open={openDialog}
            setOpen={setOpenDialog}
            title={"Delete Product"}
            description="Product deletion action"
            trigger={
              <Button size={"icon"} variant={"outline"} className="w-10">
                <Trash className="h-4 w-4" />
              </Button>
            }
            footer={
              <div className="flex flex-row flex-grow w-full gap-2">
                <Button
                  className="flex-grow w-full"
                  variant={"outline"}
                  onClick={() => setOpenDialog(false)}
                >
                  <span>Cancel</span>
                </Button>
                <Button
                  className="flex-grow w-full"
                  variant={"destructive"}
                  onClick={async () => {
                    await deleteDistribution(distribution.id);
                    setOpenDialog(false);
                    router.refresh();
                  }}
                >
                  Delete
                </Button>
              </div>
            }
          >
            <p className="p-medium-16 md:p-medium-14 text-gray-500 px-4 md:px-0">
              Are you sure you want to delete the product?
            </p>
          </ResponsiveDialog>
        </div>
      );
    },
  },
];
