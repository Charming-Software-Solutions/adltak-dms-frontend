"use client";

import CalendarPicker from "@/components/shared/CalendarPicker";
import FilterDialog from "@/components/shared/filter/FilterDialog";
import FilterSelect from "@/components/shared/filter/FilterSelect";
import { ResponsiveDialogFooter } from "@/components/shared/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TASK_STATUS } from "@/constants";
import { useTaskFilters } from "@/hooks/use-filters";
import { SelectItemType } from "@/types/primitives";
import { useState } from "react";

const TaskFilter = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [taskFilters, setTaskFilters] = useTaskFilters();
  const { status, start_date, end_date } = taskFilters;

  const taskStatusItems: SelectItemType[] = Object.keys(TASK_STATUS).map(
    (key) => ({
      value: key,
      label: TASK_STATUS[key as keyof typeof TASK_STATUS],
    }),
  );

  return (
    <FilterDialog open={openDialog} setOpen={setOpenDialog}>
      <FilterSelect
        name="Status"
        items={taskStatusItems}
        placeholder="Select status"
        onChange={(value) => setTaskFilters({ status: value })}
        onRemove={() => setTaskFilters({ status: "" })}
        value={status}
        className="px-4"
      />
      <div className="space-y-2 px-4 w-full">
        <span className="text-sm font-semibold">Date Range</span>
        <div className="flex space-x-2 w-full">
          <CalendarPicker
            date={start_date ?? undefined}
            placeholder="Select start date"
            type="from"
            onSelect={(value) => setTaskFilters({ start_date: value as Date })}
            onRemove={() => setTaskFilters({ start_date: null })}
            label="From:"
          />
          <CalendarPicker
            minDate={start_date ?? undefined}
            date={end_date ?? undefined}
            placeholder="Select end date"
            onSelect={(value) => {
              setTaskFilters({ end_date: value as Date });
            }}
            onRemove={() => setTaskFilters({ end_date: null })}
            type="to"
            label="To:"
            disabled={!start_date}
          />
        </div>
      </div>
      <Separator className="mt-4" />
      <ResponsiveDialogFooter className="px-4">
        <div className="flex flex-row flex-grow w-full gap-2">
          <Button
            variant="outline"
            className="flex-grow w-full"
            onClick={() =>
              setTaskFilters({
                status: "",
                start_date: null,
                end_date: null,
              })
            }
          >
            Clear Filters
          </Button>
          <Button
            className="flex-grow w-full"
            onClick={() => setOpenDialog(false)}
          >
            View All
          </Button>
        </div>
      </ResponsiveDialogFooter>
    </FilterDialog>
  );
};

export default TaskFilter;
