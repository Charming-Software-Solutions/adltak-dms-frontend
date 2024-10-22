import { User } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";

export const visibileUserColumns = {
  desktop: {
    email: true,
    last_login: true,
    role: true,
  },
  mobile: {
    email: true,
    last_login: true,
  },
};

export const UserColumns: ColumnDef<User>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "last_login",
    header: "Last Login",
  },
  {
    header: "Job Role",
    cell: ({ row }) => {
      const user = row.original;
      const userRole = user.role;

      return <div>{userRole}</div>;
    },
  },
];
