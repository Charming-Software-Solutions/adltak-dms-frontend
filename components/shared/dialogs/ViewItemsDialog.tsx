"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DistributionAsset, DistributionProduct } from "@/types/distribution";
import { TabsContent } from "@radix-ui/react-tabs";
import { Eye } from "lucide-react";
import { useState } from "react";
import ItemCard from "../card/ItemCard";

import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "../ResponsiveDialog";

type Props = {
  items: {
    products: DistributionProduct[];
    assets: DistributionAsset[];
  };
};

const ViewItemsDialog = ({ items }: Props) => {
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
          <ResponsiveDialogTitle>Items</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <Tabs defaultValue="products" className="w-full px-4 md:px-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
          </TabsList>
          <TabsContent value="products">
            <div className="mt-2 space-y-2">
              <span className="text-sm">Total: {items.products.length}</span>
              <OverlayScrollbarsComponent
                defer
                options={{
                  scrollbars: {
                    autoHide: "leave",
                    autoHideDelay: 200,
                    theme: "os-theme-dark",
                  },
                }}
                className="max-h-[31rem] pb-4 md:pb-0"
              >
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
                      />
                    );
                  })}
                </div>
              </OverlayScrollbarsComponent>
            </div>
          </TabsContent>
          <TabsContent value="assets">
            <div className="mt-2 space-y-2">
              <span className="text-sm">Total: {items.assets.length}</span>
              <OverlayScrollbarsComponent
                defer
                options={{
                  scrollbars: {
                    autoHide: "leave",
                    autoHideDelay: 200,
                    theme: "os-theme-dark",
                  },
                }}
                className="max-h-[31rem] pb-4 md:pb-0"
              >
                <div className="flex flex-col gap-2">
                  {items.assets.map((item) => (
                    <ItemCard
                      key={item.id}
                      thumbnail={item.asset.thumbnail}
                      name={item.asset.name}
                      classification={item.asset.type.name}
                      quantity={item.quantity}
                    />
                  ))}
                </div>
              </OverlayScrollbarsComponent>
            </div>
          </TabsContent>
        </Tabs>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default ViewItemsDialog;
