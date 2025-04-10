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
import React, { useMemo } from "react";
import { ActivityLogFilter } from "./components/ActivityLogFilter";
import { CSVLink } from "react-csv";
import { User } from "@/types/user";
import { hasPermission } from "@/lib/auth";
import { UserRoleEnum } from "@/enums";
import { formatDateTime } from "@/lib/utils";
import { USER_ROLES } from "@/constants";

type Props = {
  activityLogs: ActivityLog[];
  user: User;
};

const ActivityLogsClient = ({ activityLogs, user }: Props) => {
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

  const logsToExport = useMemo(() => {
    return activityLogs.map((log) => ({
      employee: log.user.email,
      roles: log.user.roles.map((role) => USER_ROLES[role]).join(", "),
      type: log.type,
      module: log.module,
      object: JSON.stringify(log.object[0]),
      changes: JSON.stringify(log.changes),
      datetime: formatDateTime(log.datetime, true),
    }));
  }, [activityLogs]);

  return (
    <React.Fragment>
      <Header overrideHeaderTitle="Activity Logs">
        {hasPermission(user.roles, [UserRoleEnum.ADMIN]) && (
          <CSVLink data={logsToExport}>
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <FileIcon className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
          </CSVLink>
        )}
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
