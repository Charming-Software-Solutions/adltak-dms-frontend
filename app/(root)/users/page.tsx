import React from "react";
import UserClient from "./UserClient";
import { getUserById, getUsers } from "@/lib/actions/user.actions";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  const session = await getSession();
  const users = await getUsers();

  if (!session) {
    redirect("/login");
  }
  const user = await getUserById(session.userId, session.access);

  if (!user.data) {
    throw Error("User not found");
  }

  return <UserClient user={user.data} users={users} />;
}
