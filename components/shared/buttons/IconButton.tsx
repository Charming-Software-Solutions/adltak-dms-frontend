"use client";

import { forwardRef } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type IconButtonProps = ButtonProps & {
  tooltip?: string;
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ tooltip, children, ...props }, ref) => {
    const button = (
      <Button ref={ref} size="icon" variant="outline" {...props}>
        {children}
      </Button>
    );

    if (!tooltip) return button;

    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
);

IconButton.displayName = "IconButton";
export default IconButton;
