"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

type Props = {
  title: string;
  children: React.ReactNode;
};

const ChartCard = ({ title, children }: Props) => {
  return (
    <Card className="w-full">
      <CardHeader className="p-4 bg-muted/95 rounded-t-md">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  );
};

export default ChartCard;
