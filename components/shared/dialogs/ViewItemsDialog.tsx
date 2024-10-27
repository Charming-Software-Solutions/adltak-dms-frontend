"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DistributionProduct } from "@/types/distribution";
import { TabsContent } from "@radix-ui/react-tabs";
import { Eye } from "lucide-react";
import { useState } from "react";
import ItemCard from "../card/ItemCard";
import ResponsiveDialog from "../ResponsiveDialog";

import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

type Props = {
  items: {
    products: DistributionProduct[];
  };
};

const ViewItemsDialog = ({ items }: Props) => {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <ResponsiveDialog
      className="w-[25rem]"
      open={openDialog}
      setOpen={setOpenDialog}
      title={"Items"}
      description=""
      trigger={
        <Button variant={"outline"}>
          <Eye className="size-4 mr-2" /> View
        </Button>
      }
    >
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <OverlayScrollbarsComponent
            defer
            options={{
              scrollbars: {
                autoHide: "leave",
                autoHideDelay: 200,
                theme: "os-theme-dark",
              },
            }}
            className="max-h-[31rem] pt-4"
          >
            <div className="flex flex-col gap-2">
              {items.products.map((item) => (
                <ItemCard
                  key={item.id}
                  thumbnail={item.product.thumbnail}
                  name={item.product.name}
                  classification={item.product.category.name}
                  quantity={item.quantity}
                  sku={item.product.sku}
                />
              ))}
            </div>
          </OverlayScrollbarsComponent>
        </TabsContent>
      </Tabs>
    </ResponsiveDialog>
  );
};

export default ViewItemsDialog;
