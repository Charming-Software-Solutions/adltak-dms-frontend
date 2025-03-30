"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { imagePlaceholder } from "@/constants";
import { ProjectStatusEnum, UserRoleEnum } from "@/enums";
import { updateProjectProductQuantity } from "@/lib/actions/project.actions";
import { formatExpiration } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { MinusIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import IconButton from "../buttons/IconButton";
import { hasPermission } from "@/lib/auth";

type Props = {
  userRoles: UserRoleEnum[];
  projectStatus: ProjectStatusEnum;
  id: string;
  thumbnail: string | undefined;
  name: string;
  classification: string;
  quantity: number;
  expiration?: string;
  usedQuantity: number;
};

const ItemCard = ({
  userRoles,
  projectStatus,
  id,
  thumbnail,
  name,
  classification,
  quantity,
  expiration,
  usedQuantity,
}: Props) => {
  const router = useRouter();

  const { mutate } = useMutation({
    mutationKey: ["update-project-product-quantity"],
    mutationFn: updateProjectProductQuantity,
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <Card>
      <CardContent className="p-4 space-y-2.5">
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
        {(projectStatus === ProjectStatusEnum.CONCLUDED ||
          projectStatus === ProjectStatusEnum.LOCKED) &&
          hasPermission(userRoles, [
            UserRoleEnum.ADMIN,
            UserRoleEnum.LOGISTICS_TEAM_MEMBER,
          ]) && (
            <div className="flex gap-2 w-full md:w-auto items-center">
              <div className="flex items-center">
                <Badge
                  className="text-sm p-2.5 rounded-lg truncate"
                  variant={"outline"}
                >
                  Used Quantity
                </Badge>
              </div>

              <div className="flex flex-row w-full items-center justify-between border rounded-md p-2 ml-2 flex-grow">
                <IconButton
                  className="p-1 rounded-sm transition-colors size-6"
                  tooltip="Decrease quantity"
                  disabled={
                    usedQuantity <= 1 ||
                    projectStatus === ProjectStatusEnum.LOCKED
                  }
                  onClick={() =>
                    mutate({
                      id: id,
                      quantity: usedQuantity - 1,
                      isUsedQuantity: true,
                    })
                  }
                >
                  <MinusIcon className="size-4" />
                </IconButton>

                <span className="text-sm mx-2 w-12 text-center inline-block select-none">
                  {usedQuantity}
                </span>

                <IconButton
                  className="p-1 rounded-sm transition-colors size-6"
                  tooltip="Increase quantity"
                  disabled={
                    usedQuantity >= quantity ||
                    projectStatus === ProjectStatusEnum.LOCKED
                  }
                  onClick={() =>
                    mutate({
                      id: id,
                      quantity: usedQuantity + 1,
                      isUsedQuantity: true,
                    })
                  }
                >
                  <PlusIcon className="size-4" />
                </IconButton>
              </div>
            </div>
          )}
      </CardContent>
    </Card>
  );
};

export default ItemCard;
