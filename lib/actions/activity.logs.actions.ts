"use server";

import { ActivityLog } from "@/types/activityLog";
import { fetchAndHandleResponse } from "../utils";
import { getSession } from "@/auth/session";

async function getActivityLogs(): Promise<ActivityLog[]> {
  const response = await fetchAndHandleResponse<ActivityLog[]>({
    url: `${process.env.DOMAIN}/activity-log/`,
    jwt: (await getSession())?.access,
    method: "GET",
  });
  return response.data ?? [];
}

export { getActivityLogs };
