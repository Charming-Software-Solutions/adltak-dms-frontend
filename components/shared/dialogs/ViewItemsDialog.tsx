"use client";

import { Button } from "@/components/ui/button";
import { ProjectProduct } from "@/types/project";
import { Eye } from "lucide-react";
import { useState } from "react";
import ItemCard from "../card/ItemCard";

import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "../ResponsiveDialog";
import { CopyButton } from "@/components/ui/copy-button";

type Props = {
  baReferenceNumber: string;
  items: {
    products: ProjectProduct[];
  };
};

const ViewItemsDialog = ({ baReferenceNumber, items }: Props) => {
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
          <ResponsiveDialogTitle>Project Products</ResponsiveDialogTitle>
          <ResponsiveDialogDescription className="flex items-center space-x-2">
            <span className="w-full">
              <span className="font-semibold text-foreground">
                BA Reference Number:{" "}
              </span>
              <span className="inline-flex items-center space-x-1">
                <span className="font-normal text-muted-foreground">
                  {baReferenceNumber}
                </span>
                <CopyButton value={baReferenceNumber} />
              </span>
            </span>
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <div className="flex flex-col gap-2">
          {items.products.map((item, index) => {
            const nextProduct = items.products[index + 1];
            const currentProductName = item.product.name;
            const nextName = nextProduct?.product.name;
            return (
              <ItemCard
                key={item.id}
                thumbnail={item.product.thumbnail}
                name={
                  currentProductName === nextName
                    ? `${currentProductName} ${index + 1}`
                    : currentProductName
                }
                classification={item.product.category.name}
                quantity={item.quantity}
                expiration={item.expiration}
                status={item.status}
              />
            );
          })}
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default ViewItemsDialog;
