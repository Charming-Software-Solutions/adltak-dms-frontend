import React from "react";
import ActivityLogsClient from "./ActivityLogClient";
import { getActivityLogs } from "@/lib/actions/activity.logs.actions";
import type { SearchParams } from "nuqs/server";
import { loadActivityLogSearchPrams } from "@/lib/searchParams";
import { getCurrentUser } from "@/auth/currentUser";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function ActivityLogPage({ searchParams }: Props) {
  const filters = await loadActivityLogSearchPrams(searchParams);
  const activityLogs = await getActivityLogs(filters);
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <ActivityLogsClient activityLogs={activityLogs} user={user} />;
}
