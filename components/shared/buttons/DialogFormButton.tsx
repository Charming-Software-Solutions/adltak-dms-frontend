"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

interface Props extends ButtonProps {
  loading?: boolean;
}

const DialogFormButton: React.FC<Props> = ({
  disabled,
  onClick,
  className,
  loading = false,
  variant,
  size,
  children,
  ...props
}) => {
  return (
    <Button
      disabled={disabled || loading}
      className={cn("flex-grow w-full", className)}
      onClick={onClick}
      variant={variant}
      size={size}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin mr-2" /> : children}
    </Button>
  );
};

export default DialogFormButton;
