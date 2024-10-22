import { getSession } from "@/lib/auth";
import HomeClient from "./Client";

export default async function Home() {
  const user = (await getSession()).user;

  return <HomeClient user={user} />;
}
