"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { imagePlaceholder } from "@/constants";
import Image from "next/image";

type Props = {
  thumbnail: string | undefined;
  name: string;
  classification: string;
  quantity: number;
};

const ItemCard = ({ thumbnail, name, classification, quantity }: Props) => {
  return (
    <Card className="flex items-center justify-between p-1">
      <div className="flex items-center gap-2">
        <Image
          src={thumbnail ?? imagePlaceholder}
          alt={"item-thumbnail"}
          className="h-[3.9rem] w-auto object-contain rounded-sm"
          priority
          width={100}
          height={100}
        />
        <div className="grid flex-1 gap-1.5 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{name}</span>
          <div className="flex gap-2 items-center text-xs">
            <span className="truncate">{classification} </span>
            <Separator className="h-2" orientation="vertical" />
            <Badge variant={"outline"} className="justify-center">
              <span className="font-medium">{quantity} QTY</span>
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ItemCard;
