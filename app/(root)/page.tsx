import HomeClient from "./Client";
import { getDistributions } from "@/lib/actions/distribution.actions";

export default async function Home() {
  const distributions = await getDistributions();

  return <HomeClient distributions={distributions} />;
}
