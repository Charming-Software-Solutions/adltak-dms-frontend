import React from "react";
import ActivityLogsClient from "./ActivityLogClient";
import { getActivityLogs } from "@/lib/actions/activity.logs.actions";

export default async function ActivityLogPage() {
  const activityLogs = await getActivityLogs();

  return <ActivityLogsClient activityLogs={activityLogs} />;
}
