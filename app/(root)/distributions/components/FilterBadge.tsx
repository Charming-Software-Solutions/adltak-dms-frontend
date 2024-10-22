import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import React from "react";

type Props = {
  children: React.ReactNode;
  onRemove: () => void;
};

const FilterBadge = ({ children, onRemove }: Props) => {
  return (
    <Card className="relative p-2 text-sm cursor-pointer">
      <div className="flex items-center justify-center">
        {children}
        <X onClick={onRemove} className="ml-1 size-5" />
      </div>
    </Card>
  );
};

export default FilterBadge;
