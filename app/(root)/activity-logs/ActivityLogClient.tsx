"use client";

import Header from "@/components/shared/Header";
import {
  ActivityLogColumns,
  visibileActivityLogColumns,
} from "@/components/shared/table/columns/ActivityLogColumns";
import { DataTable } from "@/components/shared/table/data-table";
import { DataTableSearch } from "@/components/shared/table/data-table-search";
import { Button } from "@/components/ui/button";
import { useDataTable } from "@/hooks/use-data-table";
import { ActivityLog } from "@/types/activityLog";
import { FileIcon } from "lucide-react";
import { parseAsString, useQueryStates } from "nuqs";
import React from "react";
import { ActivityLogFilter } from "./components/ActivityLogFilter";

type Props = {
  activityLogs: ActivityLog[];
};

const ActivityLogsClient = ({ activityLogs }: Props) => {
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

  const { table } = useDataTable({
    columns: ActivityLogColumns,
    data: activityLogs,
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
      <main className="main-container">
        <DataTable
          table={table}
          visibleColumns={visibileActivityLogColumns}
          className="w-full"
        >
          <div className="flex items-center justify-between">
            <DataTableSearch
              table={table}
              column={"employee"}
              placeholder={"Search by employee..."}
            />
            <ActivityLogFilter filters={filters} setFilters={setFilters} />
          </div>
        </DataTable>
      </main>
    </React.Fragment>
  );
};

export default ActivityLogsClient;
