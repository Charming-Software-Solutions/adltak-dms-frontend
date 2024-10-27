"use client";

import Header from "@/components/shared/Header";
import {
  DistributionColumns,
  visibleDistributionColumns,
} from "@/components/shared/table/columns/DistributionColumns";
import { DataTable } from "@/components/shared/table/data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Distribution } from "@/types/distribution";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

type Props = {
  distributions: Distribution[];
};

const HomeClient = ({ distributions }: Props) => {
  const [isMounted, setIsMounted] = useState(false);

  const isDesktop = useMediaQuery({ query: "(min-width: 1224px)" });

  const getMostRecentDistributions = (): Distribution[] => {
    const mostRecentDate = new Date(
      Math.max(
        ...distributions.map((distribution) =>
          new Date(distribution.updated_at).getTime(),
        ),
      ),
    );

    return distributions.filter(
      (distribution) =>
        new Date(distribution.updated_at).getTime() ===
        mostRecentDate.getTime(),
    );
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <React.Fragment>
      <Header>{null}</Header>
      <main className="flex flex-1 flex-col p-4 gap-4 lg:px-6">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <Card className="min-h-[100vh] flex-1 rounded-xl overflow-auto bg-muted/50 md:min-h-min">
          <CardHeader className="flex flex-row justify-between items-start">
            <div className="space-y-2">
              <CardTitle>Recent Distributions</CardTitle>
              <CardDescription>Latest distributions</CardDescription>
            </div>
            <Button>
              <Link href={"/distributions"}>View All</Link>
              <ExternalLinkIcon className="size-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent>
            {isMounted ? (
              <DataTable
                columns={DistributionColumns}
                data={distributions}
                showPagination={false}
                visibleColumns={
                  isDesktop
                    ? visibleDistributionColumns.desktop
                    : visibleDistributionColumns.mobile
                }
              />
            ) : null}
          </CardContent>
        </Card>
      </main>
    </React.Fragment>
  );
};

export default HomeClient;
