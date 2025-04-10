import { getCurrentUser } from "@/auth/currentUser";
import {
  getMontlyProjects,
  getProductsAboutToExpireCount,
  getProductsExpiredCount,
  getRemainingTaskCount,
} from "@/lib/actions/metrics.actions";
import { getProjects } from "@/lib/actions/project.actions";
import { InsightsMetrics } from "@/types/metrics";
import HomeClient from "./Client";
import { Suspense } from "react";
import LoadingSpinnerIcon from "@/components/ui/loading-spinner";

async function HomeServer() {
  const projects = await getProjects();
  const user = await getCurrentUser();
  const metrics: InsightsMetrics = {
    monthlyProjects: await getMontlyProjects(),
    remainingTaskCount: await getRemainingTaskCount(),
    productsAboutToExpireCount: await getProductsAboutToExpireCount(),
    productsExpiredCount: await getProductsExpiredCount(),
  };

  return <HomeClient user={user!} projects={projects} metrics={metrics} />;
}

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingSpinnerIcon />}>
      <HomeServer />
    </Suspense>
  );
}
