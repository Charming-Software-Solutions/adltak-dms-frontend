"use client";

import {
  UserColumns,
  visibileUserColumns,
} from "@/components/shared/table/columns/UserColumns";
import { DataTable } from "@/components/shared/table/data-table";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

type Props = {
  user: User;
  users: User[];
};

const UserClient = ({ user, users }: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const isDesktop = useMediaQuery({ query: "(min-width: 1224px)" });
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <React.Fragment>
      <main className="grid flex-1 items-start px-4 lg:px-6 h-[200px]">
        {isMounted ? (
          <DataTable
            columns={UserColumns}
            data={users}
            visibleColumns={
              isDesktop
                ? visibileUserColumns.desktop
                : visibileUserColumns.mobile
            }
          />
        ) : null}
      </main>
    </React.Fragment>
  );
};

export default UserClient;
