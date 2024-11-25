import { getDistributions } from "@/lib/actions/distribution.actions";
import {
  getMonthlyDistributionFlow,
  getProductsAboutToExpireCount,
  getRemainingTaskCount,
  getTotalItemStock,
} from "@/lib/actions/metrics.actions";
import { getSession } from "@/lib/session";
import { InsightsMetrics } from "@/types/metrics";
import HomeClient from "./Client";

export default async function Home() {
  const distributions = await getDistributions();
  const user = (await getSession())!.user;
  const metrics: InsightsMetrics = {
    totalItemStock: await getTotalItemStock(),
    monthlyDistributionFlow: await getMonthlyDistributionFlow(),
    remainingTaskCount: await getRemainingTaskCount(),
    productsAboutToExpireCount: await getProductsAboutToExpireCount(),
  };

  return (
    <HomeClient user={user} distributions={distributions} metrics={metrics} />
  );
}
