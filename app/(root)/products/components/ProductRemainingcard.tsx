"use client";

import ProjectProductCardDetails from "@/components/shared/card/ProductCardDetails";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { imagePlaceholder } from "@/constants";
import { handleRemainingProjectProducts } from "@/lib/actions/project.actions";
import { ApiResponse } from "@/types/api";
import { ProjectProduct } from "@/types/project";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ProductRemainingCardProps = {
  projectProduct: ProjectProduct;
};

type ProductRemainingMutationsParams = {
  id: string;
  operation: "recirculate" | "pull_out";
};

const ProductRemainingCard = ({
  projectProduct,
}: ProductRemainingCardProps) => {
  const router = useRouter();
  const { mutate, isPending } = useMutation<
    ApiResponse<ProjectProduct>,
    Error,
    ProductRemainingMutationsParams
  >({
    mutationKey: ["update-project-of-project-product"],
    mutationFn: ({ id, operation }) =>
      handleRemainingProjectProducts({ id, operation }),

    onSuccess: (_, { operation }) => {
      router.refresh();
      toast.success(
        `Product ${operation
          .split("_")
          .map((w) => w[0].toUpperCase() + w.slice(1))
          .join(" ")} succeeded!`,
      );
    },
  });

  return (
    <Card>
      <CardContent className="flex flex-col bg-none border-none items-start justify-between p-4 gap-4">
        <div className="flex items-center gap-3">
          <Image
            src={projectProduct.product.thumbnail ?? imagePlaceholder}
            alt="product-thumbnail"
            className="h-[3.5rem] w-auto object-contain rounded-sm"
            priority
            width={100}
            height={100}
          />
          <ProjectProductCardDetails
            name={projectProduct.product.name}
            brand={projectProduct.product.brand.name}
            unit={{
              value: projectProduct.unit_value,
              type: projectProduct.unit,
            }}
            quantity={projectProduct.remaining_quantity}
            expiration={projectProduct.expiration}
          />
        </div>
        <Separator />
        <div className="w-full grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Recirculate Product</span>
            <Button
              variant={"outline"}
              onClick={() =>
                mutate({ id: projectProduct.id, operation: "recirculate" })
              }
            >
              Recirculate
            </Button>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="font-semibold">Pull Out Product</span>
            <Button
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductRemainingCard;
