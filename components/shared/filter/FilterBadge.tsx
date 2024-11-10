import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

type Props = {
  label: string;
  value: string;
  onRemove: () => void;
};

const FilterBadge = ({ label, value, onRemove }: Props) => {
  return (
    <Card className="relative w-auto py-2 px-3.5 text-sm cursor-pointer max-w-xs truncate h-10 border-red-200 bg-red-100">
      <div className="flex items-center justify-center">
        <span>
          {label}:<strong className="ml-1 font-semibold">{value}</strong>
        </span>
        <X onClick={onRemove} className="ml-1 size-4" />
      </div>
    </Card>
  );
};

export default FilterBadge;
