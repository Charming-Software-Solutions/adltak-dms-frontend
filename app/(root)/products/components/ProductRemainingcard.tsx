"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { imagePlaceholder } from "@/constants";
import { ProjectStatusEnum } from "@/enums";
import {
  getProjects,
  handleRemainingProjectProducts,
} from "@/lib/actions/project.actions";
import { formatExpiration } from "@/lib/utils";
import { ProjectProduct } from "@/types/project";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import ProductTransferComboBox from "./ProductTransferComboBox";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type ProductRemainingCardProps = {
  projectProduct: ProjectProduct;
};

const ProductRemainingCard = ({
  projectProduct,
}: ProductRemainingCardProps) => {
  const router = useRouter();
  const { data: availableProjects } = useQuery({
    queryKey: ["fetch-project"],
    queryFn: async () => await getProjects(),
    select: (response) =>
      response.filter(
        (project) => project.status === ProjectStatusEnum.AWAITING_PWP,
      ),
  });
  const { mutate, isPending } = useMutation({
    mutationKey: ["update-project-of-project-product"],
    mutationFn: handleRemainingProjectProducts,
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <Card>
      <CardContent className="flex flex-col bg-none border-none items-start justify-between p-4 space-y-2.5">
        <div className="flex items-center gap-3">
          <Image
            src={projectProduct.product.thumbnail ?? imagePlaceholder}
            alt="product-thumbnail"
            className="h-[3.5rem] w-auto object-contain rounded-sm"
            priority
            width={100}
            height={100}
          />
          <div className="grid flex-1 gap-1 text-left text-sm leading-tight">
            <span className="font-semibold">
              {projectProduct.product.name || "Unknown"}
            </span>
            <div className="flex space-x-2 items-center">
              <span className="truncate text-xs">
                {projectProduct.product.type.name || "Unknown Type"}
              </span>
              <Separator className="h-2" orientation="vertical" />
              <Badge variant={"outline"} className="justify-center">
                <span className="font-medium">
                  {projectProduct.remaining_quantity} QTY
                </span>
              </Badge>
              <Separator orientation="vertical" className="h-2" />
              <span className="truncate text-xs">
                <strong>EXP: </strong>
                {formatExpiration(projectProduct.expiration)}
              </span>
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col space-y-2 w-full">
          <span className="font-semibold">Pull Out Product</span>
          <Button
            className="flex-grow w-full"
            onClick={() =>
              mutate({ id: projectProduct.id, operation: "pull_out" })
            }
          >
            {isPending ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <span>Pull Out</span>
            )}
          </Button>
        </div>
        {/* <div className="w-full grid grid-cols-2"> */}
        {/*   <div className="flex flex-col space-y-2"> */}
        {/*     <span className="font-semibold">Allocate Product</span> */}
        {/*     <ProductTransferComboBox */}
        {/*       projects={availableProjects ?? []} */}
        {/*       onTransfer={(project) => */}
        {/*         mutate({ */}
        {/*           id: projectProduct.id, */}
        {/*           project: project?.id, */}
        {/*           operation: "allocate", */}
        {/*         }) */}
        {/*       } */}
        {/*     /> */}
        {/*   </div> */}
        {/*   <div className="flex flex-col space-y-2"> */}
        {/*     <span className="font-semibold">Pull Out Product</span> */}
        {/*     <Button */}
        {/*       onClick={() => */}
        {/*         mutate({ id: projectProduct.id, operation: "pull_out" }) */}
        {/*       } */}
        {/*     > */}
        {/*       {isPending ? ( */}
        {/*         <Loader2 className="animate-spin mr-2" /> */}
        {/*       ) : ( */}
        {/*         <span>Pull Out</span> */}
        {/*       )} */}
        {/*     </Button> */}
        {/*   </div> */}
        {/* </div> */}
      </CardContent>
    </Card>
  );
};

export default ProductRemainingCard;
