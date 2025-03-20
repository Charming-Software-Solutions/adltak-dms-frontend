import React from "react";
import ActivityLogsClient from "./ActivityLogClient";
import { getActivityLogs } from "@/lib/actions/activity.logs.actions";
import type { SearchParams } from "nuqs/server";
import { loadActivityLogSearchPrams } from "@/lib/searchParams";

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function ActivityLogPage({ searchParams }: Props) {
  const filters = await loadActivityLogSearchPrams(searchParams);
  const activityLogs = await getActivityLogs(filters);

  return <ActivityLogsClient activityLogs={activityLogs} />;
}
