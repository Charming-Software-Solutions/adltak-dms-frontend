"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { USER_ROLES } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { ActivityLog } from "@/types/activityLog";
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
    identifier: false,
    changes: true,
    datetime: true,
  },
  mobile: {
    employee: true,
    role: true,
    type: true,
    module: true,
    identifier: false,
    changes: true,
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
    accessorKey: "identifier",
    header: "Identifier",
  },
  {
    accessorKey: "changes",
    header: "Changes",
    cell: ({ row }) => {
      const [openDialog, setOpenDialog] = useState(false);
      const changes = row.original.changes;

      return (
        <ResponsiveDialog open={openDialog} setOpen={setOpenDialog}>
          <ResponsiveDialogTrigger>
            <Button variant={"outline"} size={"icon"}>
              <ExternalLink className="size-4" />
            </Button>
          </ResponsiveDialogTrigger>
          <ResponsiveDialogContent>
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle>List of Changes</ResponsiveDialogTitle>
              {row.original.identifier && (
                <ResponsiveDialogDescription>
                  <span className="font-semibold text-black">Identifer: </span>
                  {row.original.identifier}
                </ResponsiveDialogDescription>
              )}
            </ResponsiveDialogHeader>
            {changes && Object.keys(changes).length > 0 ? (
              <div className="overflow-auto no-scrollbar">
                <div className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Field</TableHead>
                        <TableHead>Old</TableHead>
                        <TableHead>New</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(changes).map(([field, values]) => (
                        <TableRow key={field}>
                          <TableCell>{field}</TableCell>
                          <TableCell>{values[0]}</TableCell>
                          <TableCell>{values[1]}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <span>No Changes.</span>
            )}
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
