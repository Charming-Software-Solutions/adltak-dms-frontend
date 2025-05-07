import { getCurrentUser } from "@/auth/currentUser";
import LoadingSpinnerIcon from "@/components/ui/loading-spinner";
import { getActivityLogs } from "@/lib/actions/activity.logs.actions";
import { loadActivityLogSearchPrams } from "@/lib/searchParams";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import ActivityLogsClient from "./ActivityLogClient";

type Props = {
  searchParams: Promise<SearchParams>;
};

async function ActivityServer({ searchParams }: Props) {
  const filters = await loadActivityLogSearchPrams(searchParams);
  const activityLogs = await getActivityLogs(filters);
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <ActivityLogsClient activityLogs={activityLogs} user={user} />;
}

export default function ActivityLogsPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<LoadingSpinnerIcon />}>
      <ActivityServer searchParams={searchParams} />
    </Suspense>
  );
}
