"use client";

import Header from "@/components/shared/Header";
import {
  ActivityLogColumns,
  visibileActivityLogColumns,
} from "@/components/shared/table/columns/ActivityLogColumns";
import { DataTable } from "@/components/shared/table/data-table";
import { DataTableSearch } from "@/components/shared/table/data-table-search";
import { Button } from "@/components/ui/button";
import { USER_ROLES } from "@/constants";
import { UserRoleEnum } from "@/enums";
import { useDataTable } from "@/hooks/use-data-table";
import { hasPermission } from "@/lib/auth";
import { capitalize, formatDateTime, formatFilterValue } from "@/lib/utils";
import { ActivityLog } from "@/types/activityLog";
import { User } from "@/types/user";
import { FileIcon } from "lucide-react";
import React, { useMemo } from "react";
import { CSVLink } from "react-csv";
import { ActivityLogFilter } from "./components/ActivityLogFilter";
import { useActivityLogFilters } from "@/hooks/use-filters";
import FilterBadge from "@/components/shared/filter/FilterBadge";

type Props = {
  activityLogs: ActivityLog[];
  user: User;
};

const ActivityLogsClient = ({ activityLogs, user }: Props) => {
  const memoizedActivityLogs = useMemo(() => activityLogs, [activityLogs]);
  const [activityLogFilters, setActivityLogFilters] = useActivityLogFilters();

  const { table } = useDataTable({
    columns: ActivityLogColumns,
    data: memoizedActivityLogs,
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
            <ActivityLogFilter />
          </div>
          <div className="flex items-start gap-2 flex-wrap w-full flex-grow">
            {Object.entries(activityLogFilters).map(
              ([key, value]) =>
                value && (
                  <FilterBadge
                    key={key}
                    label={capitalize(key)}
                    value={formatFilterValue(value)}
                    onRemove={() => {
                      setActivityLogFilters({ [key]: "" });
                    }}
                  />
                ),
            )}
          </div>
        </DataTable>
      </main>
    </React.Fragment>
  );
};

export default ActivityLogsClient;
