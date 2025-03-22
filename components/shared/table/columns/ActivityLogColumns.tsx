"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { USER_ROLES } from "@/constants";
import { getEmployeeById } from "@/lib/actions/employee.actions";
import { formatDateTime } from "@/lib/utils";
import { ActivityLog } from "@/types/activityLog";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "../../ResponsiveDialog";
import { DataTableColumnHeader } from "../data-table-column-header";

export const visibileActivityLogColumns = {
  desktop: {
    employee: true,
    role: true,
    type: true,
    module: true,
    details: true,
    datetime: true,
  },
  mobile: {
    employee: true,
    role: true,
    type: true,
    module: true,
    details: true,
    datetime: true,
  },
};

const typeBadgeColors: Record<string, string> = {
  CREATE: "bg-green-500",
  UPDATE: "bg-purple-500",
  DELETE: "bg-red-500",
};

export const ActivityLogColumns: ColumnDef<ActivityLog>[] = [
  {
    accessorKey: "employee",
    accessorFn: (row) => row.user.email,
    header: "Employee",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.user.role;

      return <Badge variant={"secondary"}>{USER_ROLES[role]}</Badge>;
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge
        className={`${typeBadgeColors[row.original.type]} pointer-events-none`}
      >
        {row.original.type}
      </Badge>
    ),
  },
  {
    accessorKey: "module",
    header: "Module",
  },
  {
    accessorKey: "details",
    header: "Details",
    cell: ({ row }) => {
      const [openDialog, setOpenDialog] = useState(false);
      const activityLog = row.original;
      const changes = activityLog.changes;
      const activityLogObject = activityLog.object[0];

      const warehousePersonId = activityLogObject?.fields?.warehouse_person;
      const activityLogIdentifier =
        activityLogObject.model.includes("task") ||
        activityLogObject.model.includes("distribution")
          ? activityLogObject.fields.ba_reference_number
          : activityLogObject.fields.name;

      const { data: warehousePerson, isLoading: isWarehousePersonLoading } =
        useQuery({
          queryKey: ["warehouse-person", warehousePersonId],
          queryFn: () => getEmployeeById(warehousePersonId),
          enabled: Boolean(warehousePersonId), // Only fetch if ID exists
        });

      return (
        <ResponsiveDialog open={openDialog} setOpen={setOpenDialog}>
          <ResponsiveDialogTrigger>
            <Button variant={"outline"} size={"icon"}>
              <ExternalLink className="size-4" />
            </Button>
          </ResponsiveDialogTrigger>
          <ResponsiveDialogContent className="max-w-2xl">
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle>
                Activity Log Details
              </ResponsiveDialogTitle>
              <ResponsiveDialogDescription className="flex flex-col space-y-0.5">
                <span className="w-full">
                  <span className="font-semibold text-black">Identifier: </span>
                  <span className="inline-flex items-center space-x-1">
                    <span className="font-normal text-gray-500">
                      {activityLogIdentifier?.trim() || "UNKNOWN"}
                    </span>
                    {activityLogIdentifier?.trim() && (
                      <CopyButton value={activityLogIdentifier.trim()} />
                    )}
                  </span>
                </span>

                {activityLog.module.toLowerCase() === "task" && (
                  <span className="w-full">
                    <span className="font-semibold text-black">
                      Warehouse Person:{" "}
                    </span>
                    <span className="inline-flex items-center space-x-1">
                      <span className="font-normal text-gray-500">
                        {isWarehousePersonLoading ? (
                          <span>Loading...</span>
                        ) : (
                          warehousePerson?.data?.user.email
                        )}
                      </span>
                      <CopyButton
                        value={warehousePerson?.data?.user.email ?? ""}
                      />
                    </span>
                  </span>
                )}
              </ResponsiveDialogDescription>
            </ResponsiveDialogHeader>
            <Card className="m-4 md:m-0">
              <CardHeader>
                <CardTitle>Record Overview</CardTitle>
                <CardDescription>
                  Overview of the original record and the changes made on it.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col space-y-2">
                <Accordion type="single" collapsible>
                  <AccordionItem value="original-object">
                    <AccordionTrigger className="pt-0">
                      Original Record
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="relative text-sm mt-2 rounded-md bg-neutral-100 p-4 max-h-96 md:max-h-none">
                        <CopyButton
                          className="absolute top-2 right-2"
                          value={JSON.stringify(activityLogObject, null, 2)}
                        />

                        <pre className="overflow-auto max-h-80 md:max-h-none">
                          <code className="text-black">
                            {JSON.stringify(activityLogObject, null, 2)}
                          </code>
                        </pre>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Accordion type="single" collapsible>
                  <AccordionItem value="changes">
                    <AccordionTrigger>List of Changes</AccordionTrigger>
                    <AccordionContent>
                      {changes && Object.keys(changes).length > 0 ? (
                        <ScrollArea className="max-h-56">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Field</TableHead>
                                <TableHead>Old</TableHead>
                                <TableHead>New</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {Object.entries(changes).map(
                                ([field, values]) => (
                                  <TableRow key={field}>
                                    <TableCell>{field}</TableCell>
                                    <TableCell>{values[0]}</TableCell>
                                    <TableCell>{values[1]}</TableCell>
                                  </TableRow>
                                ),
                              )}
                            </TableBody>
                          </Table>
                        </ScrollArea>
                      ) : (
                        <span>No Changes.</span>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </ResponsiveDialogContent>
        </ResponsiveDialog>
      );
    },
  },
  {
    accessorKey: "datetime",
    header: ({ column }) => (
      <div className="hidden md:table-cell">
        <DataTableColumnHeader column={column} title="Datetime" />
      </div>
    ),
    cell: ({ row }) => {
      const dateString = row.getValue("datetime");
      return (
        <div className="hidden md:table-cell">
          {formatDateTime(dateString, true)}
        </div>
      );
    },
  },
];
