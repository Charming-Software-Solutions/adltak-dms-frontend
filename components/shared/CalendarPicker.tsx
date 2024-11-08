"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type Props = {
  date: Date | undefined;
  placeholder: string;
  type: "from" | "to";
  onSelect: React.Dispatch<React.SetStateAction<Date | undefined>>;
  label?: string;
  disabled?: boolean;
  minDate?: Date;
};

const CalendarPicker = ({
  date,
  placeholder,
  type,
  onSelect,
  label,
  disabled,
  minDate,
}: Props) => {
  return (
    <div className="grid space-y-2 w-full">
      <span className="text-sm">{label}</span>
      <Popover>
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            variant={"outline"}
            className={cn(
              "pl-3 text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
            <CalendarIcon className="ml-auto 2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            selected={date}
            mode="single"
            initialFocus
            onSelect={onSelect}
            disabled={(date) => {
              if (type === "from") {
                return (
                  date > new Date() ||
                  date >
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() + 10),
                    )
                );
              }
              // If type is 'to'
              return minDate ? date < minDate : false;
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CalendarPicker;
