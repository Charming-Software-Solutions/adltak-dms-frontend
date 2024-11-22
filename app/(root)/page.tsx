import { getSession } from "@/lib/session";
import HomeClient from "./Client";
import { getDistributions } from "@/lib/actions/distribution.actions";
import {
  getMonthlyDistributionFlow,
  getProductsAboutToExpireCount,
  getTotalItemStock,
  getWeeklyRemainingTaskCount,
} from "@/lib/actions/metrics.actions";
import { InsightsMetrics } from "@/types/metrics";

export default async function Home() {
  const distributions = await getDistributions();
  const user = (await getSession())!.user;
  const metrics: InsightsMetrics = {
    totalItemStock: await getTotalItemStock(),
    monthlyDistributionFlow: await getMonthlyDistributionFlow(),
    weeklyRemainingTaskCount: await getWeeklyRemainingTaskCount(),
    productsAboutToExpireCount: await getProductsAboutToExpireCount(),
  };

  return (
    <HomeClient user={user} distributions={distributions} metrics={metrics} />
  );
}
