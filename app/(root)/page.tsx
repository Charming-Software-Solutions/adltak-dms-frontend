import { getDistributions } from "@/lib/actions/distribution.actions";
import {
  getDistributionFlowComparison,
  getMonthlyDistributionFlow,
  getProductsAboutToExpireCount,
  getProductsExpiredCount,
  getRemainingTaskCount,
} from "@/lib/actions/metrics.actions";
import { InsightsMetrics } from "@/types/metrics";
import HomeClient from "./Client";
import { getCurrentUser } from "@/auth/currentUser";

export default async function Home() {
  const distributions = await getDistributions();
  const user = await getCurrentUser();
  const metrics: InsightsMetrics = {
    monthlyDistributionFlow: await getMonthlyDistributionFlow(),
    remainingTaskCount: await getRemainingTaskCount(),
    productsAboutToExpireCount: await getProductsAboutToExpireCount(),
    productsExpiredCount: await getProductsExpiredCount(),
  };
  const distributionFlowComparison = await getDistributionFlowComparison();

  return (
    <HomeClient
      user={user!}
      distributions={distributions}
      metrics={metrics}
      distributionFlowComparison={distributionFlowComparison}
    />
  );
}
