"use client";

import { Card } from "@/components/ui/card";
import React from "react";
import Image from "next/image";
import { imagePlaceholder } from "@/constants";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type Props = {
  thumbnail: string;
  name: string;
  classification: string;
  quantity: number;
  sku: string;
};

const ItemCard = ({
  thumbnail,
  name,
  classification,
  quantity,
  sku,
}: Props) => {
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
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{name}</span>
          <div className="flex gap-2 items-center text-xs">
            <span className="truncate">{classification} </span>
            <Separator className="h-2" orientation="vertical" />
            <span>x{quantity}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ItemCard;
