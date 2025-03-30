"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { imagePlaceholder } from "@/constants";
import { formatExpiration } from "@/lib/utils";
import Image from "next/image";
import React from "react";

type Props = {
  thumbnail: string | undefined;
  name: string;
  classification: string;
  quantity: number;
  expiration?: string;
};

const ItemCard = ({
  thumbnail,
  name,
  classification,
  quantity,
  expiration,
}: Props) => {
  return (
    <Card>
      <CardContent className="p-2 space-y-2">
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
              {expiration && (
                <React.Fragment>
                  <Separator className="h-2" orientation="vertical" />
                  <span className="font-medium">
                    <strong>EXP: </strong>
                    {formatExpiration(expiration)}
                  </span>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemCard;
