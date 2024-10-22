"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import React from "react";

type Props = {
  text: string;
};

const DialogTriggerButton = ({ text }: Props) => {
  return (
    <Button className="h-8">
      <PlusCircle className="mr-9 md:mr-2 size-4" />
      <span className="hidden sm:inline">{text}</span>
    </Button>
  );
};

export default DialogTriggerButton;
