"use client";

import React from "react";

interface DataTableToolbarProps {
  leftTools: React.ReactNode;
  filters?: React.ReactNode;
  tabsList?: React.ReactNode;
  filterOnBottom?: React.ReactNode;
}

export function DataTableToolbar({
  leftTools,
  filters,
  tabsList,
  filterOnBottom,
}: DataTableToolbarProps) {
  return (
    <React.Fragment>
      {(leftTools || filters || tabsList) && (
        <div className="flex shrink-0 items-center">
          <div className="flex items-start w-full justify-between space-x-4">
            {leftTools && leftTools}
            {tabsList && tabsList}
            {filters && filters}
          </div>
        </div>
      )}
      {filterOnBottom && <div className="mt-4">{filterOnBottom}</div>}
    </React.Fragment>
  );
}
