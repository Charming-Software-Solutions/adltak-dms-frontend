"use client";

import { LoaderIcon } from "lucide-react";
import React from "react";

const LoadingSpinnerIcon = () => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <LoaderIcon className="animate-spin" />
    </div>
  );
};

export default LoadingSpinnerIcon;
