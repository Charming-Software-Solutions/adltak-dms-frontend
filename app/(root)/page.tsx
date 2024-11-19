import { getSession } from "@/lib/session";
import HomeClient from "./Client";
import { getDistributions } from "@/lib/actions/distribution.actions";

export default async function Home() {
  const distributions = await getDistributions();
  const user = (await getSession())!.user;

  return <HomeClient user={user} distributions={distributions} />;
}
