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
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProjectStatusEnum, UserRoleEnum } from "@/enums";

type Props = {
  userRoles: UserRoleEnum[];
  baReferenceNumber: string;
  projectStatus: ProjectStatusEnum;
  items: {
    products: ProjectProduct[];
  };
};

const ViewItemsDialog = ({
  userRoles,
  baReferenceNumber,
  projectStatus,
  items,
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
          <ResponsiveDialogTitle>Project Products</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            <span className="flex items-center space-x-2 w-full">
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
            <span className="w-full">
              <span className="font-semibold text-foreground">
                Total Products:{" "}
              </span>
              <span className="inline-flex items-center space-x-1">
                <span className="font-normal text-muted-foreground">
                  {items.products.length}
                </span>
              </span>
            </span>
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <ScrollArea className="h-72 border bg-muted p-4 rounded-md">
          <div className="flex flex-col gap-2">
            {items.products.map((item, index) => {
              const nextProduct = items.products[index + 1];
              const currentProductName = item.product.name;
              const nextName = nextProduct?.product.name;
              return (
                <ItemCard
                  userRoles={userRoles}
                  key={index}
                  projectStatus={projectStatus}
                  id={item.id}
                  thumbnail={item.product.thumbnail}
                  name={
                    currentProductName === nextName
                      ? `${currentProductName} ${index + 1}`
                      : currentProductName
                  }
                  classification={item.product.category.name}
                  quantity={item.quantity}
                  expiration={item.expiration}
                  usedQuantity={item.used_quantity}
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
