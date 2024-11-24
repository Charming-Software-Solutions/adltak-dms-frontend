import {
  DataTable,
  DataTableProps,
} from "@/components/shared/table/data-table";
import { useEffect, useState } from "react";

export function useDataTable<TData, TValue>({
  columns,
  data,
  showPagination = true,
  searchField,
  visibleColumns,
  filters,
  tabsList,
}: DataTableProps<TData, TValue>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const dataTable = {
    render: () => {
      if (!isMounted) return null;

      return (
        <DataTable
          data={data}
          columns={columns}
          visibleColumns={visibleColumns}
          showPagination={showPagination}
          searchField={searchField}
          filters={filters}
          tabsList={tabsList}
        />
      );
    },
  };

  return dataTable;
}
