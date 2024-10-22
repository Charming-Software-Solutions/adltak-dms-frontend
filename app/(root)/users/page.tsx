import React from "react";
import UserClient from "./UserClient";
import { getSession } from "@/lib/auth";
import { getUsers } from "@/lib/actions/user.actions";

export default async function UsersPage() {
  const users = await getUsers();

  return <UserClient user={(await getSession()).user} users={users} />;
}
