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
import { MinusIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import IconButton from "../buttons/IconButton";

type Props = {
  userRoles: UserRoleEnum[];
  projectStatus: ProjectStatusEnum;
  projectProduct: ProjectProduct;
};

const ItemCard = ({ userRoles, projectStatus, projectProduct }: Props) => {
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

              <div className="flex flex-row flex-grow w-full items-center gap-0 border rounded-md">
                <IconButton
                  className="p-0 border-none rounded-r-none rounded-l-sm flex-grow text-xs"
                  variant="secondary"
                  disabled={projectStatus === ProjectStatusEnum.LOCKED}
                  onClick={() =>
                    mutate({
                      id: projectProduct.id,
                      quantity: 1,
                      isUsedQuantity: true,
                    })
                  }
                >
                  MIN
                </IconButton>

                <Separator orientation="vertical" className="h-10" />
                <IconButton
                  className="rounded-none transition-colors size-10 border-none hover:bg-muted "
                  tooltip="Decrease quantity"
                  disabled={
                    currentUsedQuantity <= 1 ||
                    projectStatus === ProjectStatusEnum.LOCKED
                  }
                  onClick={() =>
                    mutate({
                      id: projectProduct.id,
                      quantity: currentUsedQuantity - 1,
                      isUsedQuantity: true,
                    })
                  }
                >
                  <MinusIcon className="size-4" />
                </IconButton>

                <Separator orientation="vertical" className="h-10" />
                <span className="text-sm min-w-[3ch] text-center tabular-nums inline-block select-none mx-4">
                  {updatedProjectProduct?.used_quantity ??
                    projectProduct.used_quantity}
                </span>
                <Separator orientation="vertical" className="h-10" />

                <IconButton
                  className="p-1 rounded-sm transition-colors size-10 border-none hover:bg-muted"
                  tooltip="Increase quantity"
                  disabled={
                    currentUsedQuantity >= projectProduct.quantity ||
                    projectStatus === ProjectStatusEnum.LOCKED
                  }
                  onClick={() =>
                    mutate({
                      id: projectProduct.id,
                      quantity: currentUsedQuantity + 1,
                      isUsedQuantity: true,
                    })
                  }
                >
                  <PlusIcon className="size-4" />
                </IconButton>
                <Separator orientation="vertical" className="h-10" />
                <IconButton
                  className="p-0 border-none rounded-r-sm rounded-l-none flex-grow text-xs"
                  variant="secondary"
                  disabled={projectStatus === ProjectStatusEnum.LOCKED}
                  onClick={() =>
                    mutate({
                      id: projectProduct.id,
                      quantity: projectProduct.quantity,
                      isUsedQuantity: true,
                    })
                  }
                >
                  MAX
                </IconButton>
              </div>
            </div>
          )}
      </CardContent>
    </Card>
  );
};

export default ItemCard;
