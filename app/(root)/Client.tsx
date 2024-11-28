"use client";

import MetricCard from "@/components/shared/card/MetricCard";
import DistributionFlowComparisonChart from "@/components/shared/charts/DistributionFlowComparisonChart";
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
import { DistributionFlowComparison, InsightsMetrics } from "@/types/metrics";
import { UserSession } from "@/types/user";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import {
  ArrowUpDown,
  ClipboardCheck,
  Package,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

type Props = {
  user: UserSession;
  distributions: Distribution[];
  metrics: InsightsMetrics;
  distributionFlowComparison: DistributionFlowComparison[];
};

const HomeClient = ({
  user,
  distributions,
  metrics,
  distributionFlowComparison,
}: Props) => {
  const [isMounted, setIsMounted] = useState(false);

  const isDesktop = useMediaQuery({ query: "(min-width: 1224px)" });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <React.Fragment>
      <Header>{null}</Header>
      <main className="flex flex-1 flex-col p-4 gap-4 lg:px-6">
        <div className="grid auto-rows-min gap-4 md:grid-cols-4">
          <MetricCard
            title={"Total Product Stock"}
            value={metrics.totalItemStock.toString()}
            subtitle={"Total stock of products"}
            icon={<Package className="size-4" />}
          />
          <MetricCard
            title={"Monthly Distribution Flow"}
            value={metrics.monthlyDistributionFlow.toString()}
            subtitle={"Distributions per month"}
            icon={<ArrowUpDown className="size-4" />}
          />
          <MetricCard
            title={"Remaining Tasks"}
            value={metrics.remainingTaskCount.toString()}
            subtitle={"Overall remaining tasks"}
            icon={<ClipboardCheck className="size-4" />}
          />
          <MetricCard
            title={"Products about to expire"}
            value={metrics.productsAboutToExpireCount.toString()}
            subtitle={"Expiring in 1 month"}
            icon={<TriangleAlert className="size-4" />}
          />
          <div className="flex items-center gap-2"></div>
        </div>
        <DistributionFlowComparisonChart data={distributionFlowComparison} />
        <Card className="min-h-[100vh] flex-1 rounded-xl overflow-auto md:min-h-min">
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
                data={distributions.slice(0, 5)}
                showPagination={false}
                visibleColumns={
                  isDesktop
                    ? visibleDistributionColumns(user.role).desktop
                    : visibleDistributionColumns(user.role).mobile
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
