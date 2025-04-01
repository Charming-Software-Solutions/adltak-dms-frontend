"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { imagePlaceholder } from "@/constants";
import { ProjectStatusEnum, UserRoleEnum } from "@/enums";
import {
  getProjectProductById,
  updateProjectProductQuantity,
} from "@/lib/actions/project.actions";
import { hasPermission } from "@/lib/auth";
import { formatExpiration } from "@/lib/utils";
import { ProjectProduct } from "@/types/project";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import QuantityAdjuster from "../QuantityAdjuster";

type Props = {
  userRoles: UserRoleEnum[];
  projectStatus: ProjectStatusEnum;
  projectProduct: ProjectProduct;
  isProjectsPage?: boolean;
};

const ItemCard = ({
  userRoles,
  projectStatus,
  projectProduct,
  isProjectsPage = false,
}: Props) => {
  const queryClient = useQueryClient();

  const { data: updatedProjectProduct } = useQuery({
    queryKey: ["get-updated-project-product", projectProduct.id],
    queryFn: () => getProjectProductById(projectProduct.id),
    select: (response) => response.data,
  });

  const { mutate } = useMutation({
    mutationKey: ["update-project-product-quantity"],
    mutationFn: updateProjectProductQuantity,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-updated-project-product", projectProduct.id],
      });
    },
  });

  const currentUsedQuantity =
    updatedProjectProduct?.used_quantity ?? projectProduct.used_quantity;

  return (
    <Card>
      <CardContent className="p-4 space-y-2.5">
        <div className="flex items-center gap-2">
          <Image
            src={projectProduct.product.thumbnail ?? imagePlaceholder}
            alt={"item-thumbnail"}
            className="h-[3.9rem] w-auto object-contain rounded-sm"
            priority
            width={100}
            height={100}
          />
          <div className="grid flex-1 gap-1.5 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {projectProduct.product.name}
            </span>
            <div className="flex gap-2 items-center text-xs">
              <span className="truncate">
                {projectProduct.product.brand.name}{" "}
              </span>
              <Separator className="h-2" orientation="vertical" />
              <Badge variant={"outline"} className="justify-center">
                <span className="font-medium">
                  {projectProduct.quantity} QTY
                </span>
              </Badge>
              <Separator className="h-2" orientation="vertical" />
              <span className="font-medium">
                <strong>EXP: </strong>
                {formatExpiration(projectProduct.expiration)}
              </span>
            </div>
          </div>
        </div>
        {(projectStatus === ProjectStatusEnum.CONCLUDED ||
          projectStatus === ProjectStatusEnum.LOCKED) &&
          isProjectsPage &&
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
                    id: projectProduct.id,
                    quantity: newQuantity,
                    isUsedQuantity: true,
                  })
                }
                inputProps={{
                  disabled: projectStatus === ProjectStatusEnum.LOCKED,
                }}
                minMax={{
                  min: 1,
                  max: projectProduct.quantity,
                  disabled: projectStatus === ProjectStatusEnum.LOCKED,
                  onMaxClick: () =>
                    mutate({
                      id: projectProduct.id,
                      quantity: projectProduct.quantity,
                      isUsedQuantity: true,
                    }),
                  onMinClick: () =>
                    mutate({
                      id: projectProduct.id,
                      quantity: 1,
                      isUsedQuantity: true,
                    }),
                }}
                stepButtons={{
                  decrementDisabled:
                    currentUsedQuantity <= 1 ||
                    projectStatus === ProjectStatusEnum.LOCKED,
                  incrementDisabled:
                    currentUsedQuantity >= projectProduct.quantity ||
                    projectStatus === ProjectStatusEnum.LOCKED,
                  onDecrementClick: () =>
                    mutate({
                      id: projectProduct.id,
                      quantity: currentUsedQuantity - 1,
                      isUsedQuantity: true,
                    }),
                  onIncrementClick: () =>
                    mutate({
                      id: projectProduct.id,
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
