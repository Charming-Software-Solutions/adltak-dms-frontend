"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

// Define the ProgressSegment type
type SegmentProgressType = {
  value: number; // Percentage value
  color: string; // CSS color
};

interface SegmentedProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  segments: SegmentProgressType[];
}

const SegmentedProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  SegmentedProgressProps
>(({ className, segments, ...props }, ref) => {
  // Compute the total width for the progress bar

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-6 w-full overflow-hidden rounded-md bg-secondary",
        className,
      )}
      {...props}
    >
      <div className="flex h-full w-full">
        {segments.map((segment, index) => (
          <div
            key={index}
            className={cn("h-full", segment.color)}
            style={{
              width: `${segment.value}%`,
            }}
          />
        ))}
      </div>
    </ProgressPrimitive.Root>
  );
});

SegmentedProgress.displayName = ProgressPrimitive.Root.displayName;

export { SegmentedProgress };
