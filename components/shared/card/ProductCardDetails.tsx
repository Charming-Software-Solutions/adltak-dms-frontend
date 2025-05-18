"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatExpiration } from "@/lib/utils";
import { ProjectProduct } from "@/types/project";

type ProjectProductCardDetailsProps = {
  name: string;
  brand: string;
  unit: {
    value: number;
    type: string;
  };
  quantity: number;
  expiration: string;
};

const ProjectProductCardDetails = ({
  name,
  brand,
  unit,
  quantity,
  expiration,
}: ProjectProductCardDetailsProps) => {
  return (
    <div className="grid flex-1 gap-1.5 text-left text-sm leading-tight">
      <span className="truncate font-semibold">{name}</span>
      <div className="flex gap-2 items-center text-xs">
        <span className="truncate">{brand}</span>
        <Separator className="h-2" orientation="vertical" />
        <Badge variant={"outline"} className="justify-center rounded-md">
          <span className="font-medium">
            {`${unit.value}${unit.type} x ${quantity}pcs`}
          </span>
        </Badge>
        <Separator className="h-2" orientation="vertical" />
        <span className="font-medium">
          <strong>EXP: </strong>
          {formatExpiration(expiration)}
        </span>
      </div>
    </div>
  );
};

export default ProjectProductCardDetails;
