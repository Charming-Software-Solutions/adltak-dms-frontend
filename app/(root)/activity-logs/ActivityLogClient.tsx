"use client";

import Header from "@/components/shared/Header";
import {
  ActivityLogColumns,
  visibileActivityLogColumns,
} from "@/components/shared/table/columns/ActivityLogColumns";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useResponsive } from "@/hooks";
import { useDataTable } from "@/hooks/use-datatable";
import { ActivityLog } from "@/types/activityLog";
import { FileIcon, ListFilter } from "lucide-react";
import { parseAsString, useQueryStates } from "nuqs";
import React from "react";
import { ActivityLogFilter } from "./components/ActivityLogFilter";
import { filterDataTable } from "@/lib/utils";

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
    },
  );

  const filteredActivityLogs = filterDataTable(activityLogs, (log) => {
    const isRoleValid = !filters.role || filters.role === log.user.role;
    const isTypeValid = !filters.type || filters.type === log.type;
    const isModuleValid = !filters.module || filters.module === log.module;

    return isRoleValid && isTypeValid && isModuleValid;
  });

  const hasActiveFilters = () => {
    return Object.values(filters).some((value) => value !== "");
  };

  const dataTable = useDataTable({
    columns: ActivityLogColumns,
    data: hasActiveFilters() ? filteredActivityLogs : activityLogs,
    visibleColumns: isDesktop
      ? visibileActivityLogColumns.desktop
      : visibileActivityLogColumns.mobile,
    searchField: {
      column: "employee",
      placeholder: "Search by employee...",
      className: "w-[100rem]",
    },
    filters: (
      <div className="flex ml-2 gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="default" className="gap-1">
              <ListFilter className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Filter
              </span>
            </Button>
          </SheetTrigger>

          <SheetContent className="flex flex-col h-full">
            <SheetHeader>
              <SheetTitle>Activity Logs Filter</SheetTitle>
              <SheetDescription>
                Quickly refine activity logs by role, type, and module to
                pinpoint key entries.
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto">
              <ActivityLogFilter filters={filters} setFilters={setFilters} />
            </div>
            <SheetFooter className="pt-2">
              <div className="flex w-full items-center space-x-2">
                <SheetClose asChild>
                  <Button className="w-full flex-grow">View All</Button>
                </SheetClose>
                <Button
                  variant={"outline"}
                  className="w-full flex-grow"
                  onClick={() => setFilters(null)}
                >
                  Clear All
                </Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
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
