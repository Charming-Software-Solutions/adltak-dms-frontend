"use client";

import { cn } from "@/lib/utils";
import React from "react";

type AccountSettingCardBaseProps = {
  children: React.ReactNode;
  className?: string;
};

const AccountSettingContent = ({
  children,
  className,
}: AccountSettingCardBaseProps) => {
  return (
    <div className={cn("flex flex-col space-y-2 p-8", className)}>
      {children}
    </div>
  );
};

const AccountSettingCard = ({
  children,
  className,
}: AccountSettingCardBaseProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-[3fr_1fr] p-0 rounded-md border shadow-sm w-full",
        className,
      )}
    >
      {children}
    </div>
  );
};

const AccountSettingCardDialog = ({
  children,
  className,
}: AccountSettingCardBaseProps) => {
  return (
    <div
      className={cn("flex items-center justify-center border-l p-4", className)}
    >
      {children}
    </div>
  );
};

export { AccountSettingCard, AccountSettingContent, AccountSettingCardDialog };
