"use client";

import MetricCard from "@/components/shared/card/MetricCard";
import Header from "@/components/shared/Header";
import {
  ProjectColumns,
  visibleProjectColumns,
} from "@/components/shared/table/columns/ProjectColumns";
import { DataTable } from "@/components/shared/table/data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDataTable } from "@/hooks/use-data-table";
import { InsightsMetrics } from "@/types/metrics";
import { Project } from "@/types/project";
import { User } from "@/types/user";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { ClipboardCheck, FolderKanban, TriangleAlert } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  user: User;
  projects: Project[];
  metrics: InsightsMetrics;
};

const HomeClient = ({ user, projects, metrics }: Props) => {
  const { table } = useDataTable({
    columns: ProjectColumns(user.roles, true),
    data: projects,
  });

  return (
    <React.Fragment>
      <Header>{null}</Header>
      <main className="flex flex-1 flex-col p-4 lg:px-6">
        <div className="grid auto-rows-min gap-6 md:grid-cols-4 pb-2">
          <MetricCard
            title={"Monthly Projects"}
            value={metrics.monthlyProjects.toString()}
            subtitle={"Number of projects per month"}
            icon={<FolderKanban className="size-4" />}
          />
          <MetricCard
            title={"Remaining Tasks"}
            value={metrics.remainingTaskCount.toString()}
            subtitle={"Number of remaining tasks"}
            icon={<ClipboardCheck className="size-4" />}
          />
          <MetricCard
            title={"Products Near Expiration"}
            value={metrics.productsAboutToExpireCount.toString()}
            subtitle={"Number of products near expiration"}
            icon={<TriangleAlert className="size-4" />}
          />
          <MetricCard
            title={"Expired Products"}
            value={metrics.productsExpiredCount.toString()}
            subtitle={"Number of products expired"}
            icon={<TriangleAlert className="size-4" />}
          />
          <div className="flex items-center gap-2"></div>
        </div>
        <div className="flex flex-1 flex-col gap-8">
          <Card className="min-h-[100vh] flex-1 rounded-xl overflow-auto md:min-h-min pb-10">
            <CardHeader className="flex flex-row justify-between items-start">
              <div className="space-y-2">
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>Latest Projects</CardDescription>
              </div>
              <Button>
                <Link href={"/projects"}>View All</Link>
                <ExternalLinkIcon className="size-4 ml-2" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <DataTable
                  table={table}
                  visibleColumns={visibleProjectColumns(user.roles)}
                  showPagination={false}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </React.Fragment>
  );
};

export default HomeClient;
