"use client";

import CalendarPicker from "@/components/shared/CalendarPicker";
import FilterDialog from "@/components/shared/filter/FilterDialog";
import FilterSelect from "@/components/shared/filter/FilterSelect";
import { ResponsiveDialogFooter } from "@/components/shared/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PROJECT_STATUSES } from "@/constants";
import { useProjectFilters } from "@/hooks/use-filters";
import { SelectItemType } from "@/types/primitives";
import { useState } from "react";

const ProjectFilter = () => {
  const [projectFilters, setProjectFilters] = useProjectFilters();
  const { status, start_date, end_date } = projectFilters;
  const [openDialog, setOpenDialog] = useState(false);
  const statusItems: SelectItemType[] = Object.keys(PROJECT_STATUSES).map(
    (key) => ({
      value: key,
      label: PROJECT_STATUSES[key as keyof typeof PROJECT_STATUSES],
    }),
  );

  return (
    <FilterDialog open={openDialog} setOpen={setOpenDialog}>
      <FilterSelect
        name="Status"
        items={statusItems}
        placeholder="Select status"
        onChange={(value) => setProjectFilters({ status: value })}
        onRemove={() => setProjectFilters({ status: "" })}
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
            onSelect={(value) =>
              setProjectFilters({ start_date: value as Date | undefined })
            }
            onRemove={() => setProjectFilters({ start_date: null })}
            label="From:"
          />

          <CalendarPicker
            date={end_date ?? undefined}
            placeholder="Select end date"
            onSelect={(value) =>
              setProjectFilters({ end_date: value as Date | undefined })
            }
            onRemove={() => setProjectFilters({ end_date: null })}
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
              setProjectFilters({
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

export default ProjectFilter;
