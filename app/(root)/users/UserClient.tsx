"use client";

import Header from "@/components/shared/Header";
import { Button } from "@/components/ui/button";
import { useUserForm } from "@/hooks";
import { User } from "@/types/user";
import { PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import UserForm from "./componets/UserForm";
import { DrawerClose } from "@/components/ui/drawer";
import { z } from "zod";
import { userFormSchema } from "@/schemas";
import { ICreateUser } from "@/interfaces";
import { getUserRoleBooleans } from "@/lib/utils";
import { createUser } from "@/lib/actions/user.actions";
import { ApiResponse } from "@/types/api";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/shared/table/data-table";
import {
  UserColumns,
  visibileUserColumns,
} from "@/components/shared/table/columns/UserColumns";
import { useMediaQuery } from "react-responsive";

type Props = {
  user: User;
  users: User[];
};

const UserClient = ({ user, users }: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const isDesktop = useMediaQuery({ query: "(min-width: 1224px)" });
  const userForm = useUserForm();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit = async (values: z.infer<typeof userFormSchema>) => {
    const userRole = getUserRoleBooleans(values.role);

    const user: ICreateUser = {
      email: values.email,
      password: values.password,
      ...userRole,
    };

    const result: ApiResponse<User> = await createUser(user);

    if (result.errors) {
      console.log(result.errors);
    } else {
      router.refresh();
      userForm.reset();
    }
  };

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
