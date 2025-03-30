"use client";

import Header from "@/components/shared/Header";
import {
  ActivityLogColumns,
  visibileActivityLogColumns,
} from "@/components/shared/table/columns/ActivityLogColumns";
import { Button } from "@/components/ui/button";
import { useResponsive } from "@/hooks";
import { useDataTable } from "@/hooks/use-datatable";
import { ActivityLog } from "@/types/activityLog";
import { FileIcon } from "lucide-react";
import { parseAsString, useQueryStates } from "nuqs";
import React from "react";
import { ActivityLogFilter } from "./components/ActivityLogFilter";

type Props = {
  activityLogs: ActivityLog[];
};

const ActivityLogsClient = ({ activityLogs }: Props) => {
  const isDesktop = useResponsive("desktop");
  const [filters, setFilters] = useQueryStates(
    {
      role: parseAsString.withDefault(""),
      type: parseAsString.withDefault(""),
      module: parseAsString.withDefault(""),
    },
    {
      history: "push",
      shallow: false,
    },
  );

  const dataTable = useDataTable({
    columns: ActivityLogColumns,
    data: activityLogs,
    visibleColumns: isDesktop
      ? visibileActivityLogColumns.desktop
      : visibileActivityLogColumns.mobile,
    leftTools: {
      searchField: {
        column: "employee",
        placeholder: "Search by employee...",
        className: "w-[100rem]",
      },
    },
    filters: (
      <div className="flex ml-2 gap-2">
        <ActivityLogFilter filters={filters} setFilters={setFilters} />
      </div>
    ),
  });

  return (
    <React.Fragment>
      <Header overrideHeaderTitle="Activity Logs">
        <Button size="sm" variant="outline" className="h-8 gap-1">
          <FileIcon className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Export
          </span>
        </Button>
      </Header>
      <main className="main-container">{dataTable.render()}</main>
    </React.Fragment>
  );
};

export default ActivityLogsClient;
