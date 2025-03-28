import { getCurrentUser } from "@/auth/currentUser";
import {
  getDistributionFlowComparison,
  getMontlyProjects,
  getProductsAboutToExpireCount,
  getProductsExpiredCount,
  getRemainingTaskCount,
} from "@/lib/actions/metrics.actions";
import { getProjects } from "@/lib/actions/project.actions";
import { InsightsMetrics } from "@/types/metrics";
import HomeClient from "./Client";

export default async function Home() {
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
