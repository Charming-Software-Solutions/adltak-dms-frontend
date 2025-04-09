"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { imagePlaceholder } from "@/constants";
import { ItemTypeEnum, ProjectStatusEnum, UserRoleEnum } from "@/enums";
import {
  getProjectItemById,
  updateProjectItemQuantity,
} from "@/lib/actions/project.actions";
import { hasPermission } from "@/lib/auth";
import { ProjectItem } from "@/lib/store";
import { formatExpiration } from "@/lib/utils";
import { ProjectMaterial, ProjectProduct } from "@/types/project";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import QuantityAdjuster from "../QuantityAdjuster";
import React from "react";

type Props = {
  itemType: ItemTypeEnum;
  userRoles: UserRoleEnum[];
  projectStatus: ProjectStatusEnum;
  projectItem: ProjectItem;
  isProjectsPage?: boolean;
};

const ItemCard = ({
  itemType,
  userRoles,
  projectStatus,
  projectItem,
  isProjectsPage = false,
}: Props) => {
  const queryClient = useQueryClient();
  const projectItemData =
    itemType === ItemTypeEnum.PRODUCT
      ? (projectItem as ProjectProduct)
      : (projectItem as ProjectMaterial);

  const itemDetails =
    itemType === ItemTypeEnum.PRODUCT
      ? (projectItemData as ProjectProduct).product
      : (projectItemData as ProjectMaterial).material;

  const { data: updatedProjectItem } = useQuery({
    queryKey: ["get-updated-project-item", projectItem.id],
    queryFn: () => getProjectItemById(projectItem.id, itemType),
    select: (response) => response.data,
  });

  const { mutate } = useMutation({
    mutationKey: ["update-project-item-quantity"],
    mutationFn: updateProjectItemQuantity,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-updated-project-item", projectItem.id],
      });
    },
  });

  const currentUsedQuantity =
    updatedProjectItem?.quantity ?? projectItem.used_quantity;

  return (
    <Card>
      <CardContent className="p-4 space-y-2.5">
        <div className="flex items-center gap-2">
          <Image
            src={itemDetails.thumbnail ?? imagePlaceholder}
            alt={"item-thumbnail"}
            className="h-[3.9rem] w-auto object-contain rounded-sm"
            priority
            width={100}
            height={100}
          />
          <div className="grid flex-1 gap-1.5 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{itemDetails.name}</span>
            <div className="flex gap-2 items-center text-xs">
              <span className="truncate">
                {itemType === ItemTypeEnum.PRODUCT
                  ? itemDetails.brand.name
                  : itemDetails.type.name}
              </span>
              <Separator className="h-2" orientation="vertical" />
              <Badge variant={"outline"} className="justify-center">
                <span className="font-medium">{projectItem.quantity} QTY</span>
              </Badge>
              {itemType === ItemTypeEnum.PRODUCT && (
                <React.Fragment>
                  <Separator className="h-2" orientation="vertical" />
                  <span className="font-medium">
                    <strong>EXP: </strong>
                    {formatExpiration(
                      (projectItem as ProjectProduct).expiration,
                    )}
                  </span>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
        {(projectStatus === ProjectStatusEnum.CONCLUDED ||
          projectStatus === ProjectStatusEnum.LOCKED) &&
          isProjectsPage &&
          itemType === ItemTypeEnum.PRODUCT &&
          hasPermission(userRoles, [
            UserRoleEnum.ADMIN,
            UserRoleEnum.LOGISTICS_TEAM_MEMBER,
          ]) && (
            <div className="flex gap-2 w-full md:w-auto items-center">
              <div className="flex items-center">
                <Badge
                  className="text-xs p-3 rounded-lg truncate"
                  variant={"outline"}
                >
                  Used Quantity
                </Badge>
              </div>
              <QuantityAdjuster
                value={currentUsedQuantity}
                onChange={(newQuantity) =>
                  mutate({
                    itemType: itemType,
                    id: projectItemData.id,
                    quantity: newQuantity,
                    isUsedQuantity: true,
                  })
                }
                inputProps={{
                  disabled: projectStatus === ProjectStatusEnum.LOCKED,
                }}
                minMax={{
                  min: 1,
                  max: projectItemData.quantity,
                  disabled: projectStatus === ProjectStatusEnum.LOCKED,
                  onMaxClick: () =>
                    mutate({
                      itemType: itemType,
                      id: projectItemData.id,
                      quantity: projectItemData.quantity,
                      isUsedQuantity: true,
                    }),
                  onMinClick: () =>
                    mutate({
                      itemType: itemType,
                      id: projectItemData.id,
                      quantity: 1,
                      isUsedQuantity: true,
                    }),
                }}
                stepButtons={{
                  decrementDisabled:
                    currentUsedQuantity <= 1 ||
                    projectStatus === ProjectStatusEnum.LOCKED,
                  incrementDisabled:
                    currentUsedQuantity >= projectItemData.quantity ||
                    projectStatus === ProjectStatusEnum.LOCKED,
                  onDecrementClick: () =>
                    mutate({
                      itemType: itemType,
                      id: projectItemData.id,
                      quantity: currentUsedQuantity - 1,
                      isUsedQuantity: true,
                    }),
                  onIncrementClick: () =>
                    mutate({
                      itemType: itemType,
                      id: projectItemData.id,
                      quantity: currentUsedQuantity + 1,
                      isUsedQuantity: true,
                    }),
                }}
              />
            </div>
          )}
      </CardContent>
    </Card>
  );
};

export default ItemCard;
